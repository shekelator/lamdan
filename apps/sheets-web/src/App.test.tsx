import { fireEvent, render, screen } from '@testing-library/react'
import { MemoryRouter } from 'react-router-dom'
import { beforeEach, describe, expect, it, vi } from 'vitest'
import App from './App'

const catalogData = [
  {
    id: 'justice-and-mercy',
    title: 'Justice and Mercy',
    summary: 'Texts on justice and compassion.',
    topics: ['Ethics'],
    tags: ['middot'],
    languageSupport: ['english', 'hebrew'],
    format: 'markdown',
    filePath: '/data/sheets/justice-and-mercy.md',
    preferredDirection: 'mixed',
  },
  {
    id: 'shabbat-lights',
    title: 'Shabbat Lights',
    summary: 'Welcoming Shabbat with light.',
    topics: ['Shabbat'],
    tags: ['ritual'],
    languageSupport: ['english'],
    format: 'html',
    filePath: '/data/sheets/shabbat-lights.html',
    preferredDirection: 'ltr',
  },
]

beforeEach(() => {
  const fetchMock = vi.fn(async (input: RequestInfo | URL) => {
    const url = String(input)

    if (url.includes('/data/sheets/catalog.json')) {
      return new Response(JSON.stringify(catalogData), {
        status: 200,
        headers: { 'Content-Type': 'application/json' },
      })
    }

    if (url.includes('/data/sheets/justice-and-mercy.md')) {
      return new Response('# Selected Sheet', {
        status: 200,
        headers: { 'Content-Type': 'text/markdown' },
      })
    }

    if (url.includes('/data/sheets/shabbat-lights.html')) {
      return new Response('<h1>Shabbat Lights</h1><p>Candle blessing</p>', {
        status: 200,
        headers: { 'Content-Type': 'text/html' },
      })
    }

    return new Response('Not Found', { status: 404 })
  })

  vi.stubGlobal('fetch', fetchMock)
})

const renderAt = (path: string) =>
  render(
    <MemoryRouter initialEntries={[path]}>
      <App />
    </MemoryRouter>,
  )

describe('App', () => {
  // @spec SHEETS-CAT-001
  it('filters sheet cards using search text', async () => {
    renderAt('/')

    await screen.findByText('Justice and Mercy')

    fireEvent.change(screen.getByLabelText('Search'), { target: { value: 'Shabbat' } })

    expect(screen.getByText('Shabbat Lights')).toBeInTheDocument()
    expect(screen.queryByText('Justice and Mercy')).not.toBeInTheDocument()
  })

  // @spec SHEETS-VS-001, SHEETS-WEB-001, SHEETS-WEB-003
  it('renders the Discovery view and not the Reader view at /', async () => {
    renderAt('/')

    await screen.findByText('Justice and Mercy')
    expect(screen.getByLabelText('Search')).toBeInTheDocument()
    expect(screen.getByRole('button', { name: /just pick one/i })).toBeEnabled()
    expect(screen.queryByRole('button', { name: /^back$/i })).not.toBeInTheDocument()
  })

  // @spec SHEETS-VS-002, SHEETS-READ-001, SHEETS-READ-005
  it('renders the Reader view with a compact header and Back at /s/:id', async () => {
    renderAt('/s/justice-and-mercy')

    await screen.findByRole('heading', { name: 'Selected Sheet' })
    expect(screen.getByRole('button', { name: /^back$/i })).toBeInTheDocument()
    expect(screen.queryByLabelText('Search')).not.toBeInTheDocument()
  })

  // @spec SHEETS-VS-003
  it('redirects an unknown /s/:id to / with a transient not-found status', async () => {
    renderAt('/s/nope')

    await screen.findByText(/sheet not found/i)
    expect(screen.getByLabelText('Search')).toBeInTheDocument()
  })

  // @spec SHEETS-VS-006
  it('navigates to a random sheet from the filtered list on "Just pick one"', async () => {
    renderAt('/')

    await screen.findByText('Justice and Mercy')
    vi.spyOn(Math, 'random').mockReturnValue(0) // first by title = justice-and-mercy
    fireEvent.click(screen.getByRole('button', { name: /just pick one/i }))

    await screen.findByRole('heading', { name: 'Selected Sheet' })
    vi.restoreAllMocks()
  })

  // @spec SHEETS-VS-007
  it('disables "Just pick one" when the filtered list is empty', async () => {
    renderAt('/')

    await screen.findByText('Justice and Mercy')
    fireEvent.change(screen.getByLabelText('Search'), { target: { value: 'zzzznope' } })

    expect(screen.getByRole('button', { name: /just pick one/i })).toBeDisabled()
  })

  // @spec SHEETS-VS-007
  it('disables "Just pick one" when the catalog fails to load', async () => {
    vi.stubGlobal('fetch', vi.fn(async () => new Response('err', { status: 500 })))

    renderAt('/')

    await screen.findByText(/catalog could not be loaded/i)
    expect(screen.getByRole('button', { name: /just pick one/i })).toBeDisabled()
  })

  // @spec SHEETS-VS-004
  it('shows a loading state then renders the reader for a deep-linked sheet', async () => {
    let resolveCatalog!: (response: Response) => void
    const catalogPromise = new Promise<Response>((resolve) => {
      resolveCatalog = resolve
    })

    vi.stubGlobal(
      'fetch',
      vi.fn(async (input: RequestInfo | URL) => {
        const url = String(input)
        if (url.includes('/data/sheets/catalog.json')) return catalogPromise
        if (url.includes('/data/sheets/justice-and-mercy.md')) {
          return new Response('# Selected Sheet', { status: 200 })
        }
        return new Response('Not Found', { status: 404 })
      }),
    )

    renderAt('/s/justice-and-mercy')

    await screen.findByText(/loading/i)
    resolveCatalog(
      new Response(JSON.stringify(catalogData), {
        status: 200,
        headers: { 'Content-Type': 'application/json' },
      }),
    )
    await screen.findByRole('heading', { name: 'Selected Sheet' })
  })

  // @spec SHEETS-VS-005
  it('restores retained discovery filter state after returning from the reader', async () => {
    renderAt('/')

    await screen.findByText('Justice and Mercy')
    fireEvent.change(screen.getByLabelText('Search'), { target: { value: 'Shabbat' } })
    expect(screen.getByText('Shabbat Lights')).toBeInTheDocument()
    expect(screen.queryByText('Justice and Mercy')).not.toBeInTheDocument()

    fireEvent.click(screen.getByText('Shabbat Lights'))
    await screen.findByText('Candle blessing')

    fireEvent.click(screen.getByRole('button', { name: /^back$/i }))
    await screen.findByText('Shabbat Lights')
    expect((screen.getByLabelText('Search') as HTMLInputElement).value).toBe('Shabbat')
    expect(screen.queryByText('Justice and Mercy')).not.toBeInTheDocument()
  })

  // @spec SHEETS-VS-009
  it('presents default filters on a fresh Discovery view', async () => {
    renderAt('/')

    await screen.findByText('Justice and Mercy')
    expect((screen.getByLabelText('Search') as HTMLInputElement).value).toBe('')
    expect((screen.getByLabelText('Topic') as HTMLSelectElement).value).toBe('all')
    expect((screen.getByLabelText('Tag') as HTMLSelectElement).value).toBe('all')
  })
})