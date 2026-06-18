import { fireEvent, render, screen, waitFor } from '@testing-library/react'
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

    return new Response('Not Found', { status: 404 })
  })

  vi.stubGlobal('fetch', fetchMock)
})

describe('App', () => {
  // @spec SHEETS-CAT-001
  it('filters sheet cards using search text', async () => {
    render(<App />)

    await screen.findByText('Justice and Mercy')

    const searchBox = screen.getByLabelText('Search')
    fireEvent.change(searchBox, { target: { value: 'Shabbat' } })

    expect(screen.getByText('Shabbat Lights')).toBeInTheDocument()
    expect(screen.queryByText('Justice and Mercy')).not.toBeInTheDocument()
  })

  // @spec SHEETS-READ-001, SHEETS-READ-004
  it('shows placeholder first and renders sheet after selection', async () => {
    render(<App />)

    expect(screen.getByText(/Select a source sheet to begin reading/i)).toBeInTheDocument()

    const cardTitle = await screen.findByText('Justice and Mercy')
    fireEvent.click(cardTitle)

    await waitFor(() => {
      expect(screen.getByRole('heading', { name: 'Selected Sheet' })).toBeInTheDocument()
    })
  })
})
