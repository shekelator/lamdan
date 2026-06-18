import { useEffect, useMemo, useState } from 'react'
import { filterSheets } from './lib/filterSheets'
import { renderSheet } from './lib/renderSheet'
import type { RenderedSheet, SheetSummary } from './types'

function App() {
  const [catalog, setCatalog] = useState<SheetSummary[]>([])
  const [catalogLoading, setCatalogLoading] = useState(true)
  const [catalogError, setCatalogError] = useState<string | null>(null)

  const [query, setQuery] = useState('')
  const [topic, setTopic] = useState('all')
  const [tag, setTag] = useState('all')

  const [selectedSheetId, setSelectedSheetId] = useState<string | null>(null)
  const [renderedSheet, setRenderedSheet] = useState<RenderedSheet | null>(null)
  const [sheetLoading, setSheetLoading] = useState(false)
  const [sheetError, setSheetError] = useState<string | null>(null)

  // @spec SHEETS-WEB-001
  useEffect(() => {
    let isActive = true

    const loadCatalog = async () => {
      setCatalogLoading(true)
      setCatalogError(null)

      try {
        const response = await fetch('/data/sheets/catalog.json')
        if (!response.ok) {
          throw new Error('Unable to load the sheet catalog.')
        }

        const data = (await response.json()) as SheetSummary[]
        if (isActive) {
          setCatalog(data)
        }
      } catch {
        if (isActive) {
          setCatalogError('Catalog could not be loaded. Please retry.')
        }
      } finally {
        if (isActive) {
          setCatalogLoading(false)
        }
      }
    }

    void loadCatalog()

    return () => {
      isActive = false
    }
  }, [])

  const selectedSheet = useMemo(
    () => catalog.find((sheet) => sheet.id === selectedSheetId) ?? null,
    [catalog, selectedSheetId],
  )

  const topicOptions = useMemo(() => {
    return Array.from(new Set(catalog.flatMap((sheet) => sheet.topics))).sort((a, b) =>
      a.localeCompare(b),
    )
  }, [catalog])

  const tagOptions = useMemo(() => {
    return Array.from(new Set(catalog.flatMap((sheet) => sheet.tags))).sort((a, b) => a.localeCompare(b))
  }, [catalog])

  const filteredSheets = useMemo(() => {
    return filterSheets(catalog, {
      query,
      topic,
      tag,
    })
  }, [catalog, query, topic, tag])

  // @spec SHEETS-READ-001, SHEETS-READ-004
  useEffect(() => {
    let isActive = true

    const loadSheet = async () => {
      if (!selectedSheet) {
        setRenderedSheet(null)
        setSheetError(null)
        return
      }

      setSheetLoading(true)
      setSheetError(null)

      try {
        const response = await fetch(selectedSheet.filePath)
        if (!response.ok) {
          throw new Error('Unable to load the selected sheet.')
        }

        const rawContent = await response.text()
        const rendered = await renderSheet(
          rawContent,
          selectedSheet.format,
          selectedSheet.preferredDirection,
        )

        if (isActive) {
          setRenderedSheet(rendered)
        }
      } catch {
        if (isActive) {
          setSheetError('This sheet could not be rendered.')
          setRenderedSheet(null)
        }
      } finally {
        if (isActive) {
          setSheetLoading(false)
        }
      }
    }

    void loadSheet()

    return () => {
      isActive = false
    }
  }, [selectedSheet])

  return (
    <div className="app-shell">
      <header className="masthead">
        <p className="eyebrow">Source Sheet Library</p>
        <h1>Find the right sheet for today&apos;s learning.</h1>
        <p className="lead">
          Browse by topic and tags, then read beautifully rendered Markdown or HTML sheets on any
          device.
        </p>
      </header>

      <main className="layout" aria-busy={catalogLoading || sheetLoading}>
        <aside className="catalog-panel">
          <div className="search-controls">
            <label htmlFor="sheet-search">Search</label>
            <input
              id="sheet-search"
              type="search"
              placeholder="Search by title, summary, topic, or tag"
              value={query}
              onChange={(event) => setQuery(event.target.value)}
            />

            <label htmlFor="topic-filter">Topic</label>
            <select
              id="topic-filter"
              value={topic}
              onChange={(event) => setTopic(event.target.value)}
            >
              <option value="all">All topics</option>
              {topicOptions.map((item) => (
                <option key={item} value={item}>
                  {item}
                </option>
              ))}
            </select>

            <label htmlFor="tag-filter">Tag</label>
            <select id="tag-filter" value={tag} onChange={(event) => setTag(event.target.value)}>
              <option value="all">All tags</option>
              {tagOptions.map((item) => (
                <option key={item} value={item}>
                  {item}
                </option>
              ))}
            </select>
          </div>

          {catalogError && <p className="status status-error">{catalogError}</p>}
          {catalogLoading && <p className="status">Loading catalog...</p>}

          {!catalogLoading && !catalogError && filteredSheets.length === 0 && (
            <p className="status">No sheets matched your filters. Try another topic, tag, or search term.</p>
          )}

          <ul className="sheet-list">
            {filteredSheets.map((sheet) => {
              const isActive = selectedSheetId === sheet.id

              return (
                <li key={sheet.id}>
                  <button
                    type="button"
                    className={`sheet-card ${isActive ? 'sheet-card-active' : ''}`}
                    onClick={() => setSelectedSheetId(sheet.id)}
                  >
                    <h2>{sheet.title}</h2>
                    <p>{sheet.summary}</p>
                    <p className="meta">
                      Topic: {sheet.topics.join(', ')} | Tags: {sheet.tags.join(', ')}
                    </p>
                  </button>
                </li>
              )
            })}
          </ul>
        </aside>

        <section className="reader-panel">
          {!selectedSheet && (
            <div className="reader-placeholder">
              Select a source sheet to begin reading. Your selection will render with bilingual-
              friendly typography.
            </div>
          )}

          {selectedSheet && sheetLoading && <p className="status">Loading sheet content...</p>}
          {selectedSheet && sheetError && <p className="status status-error">{sheetError}</p>}

          {selectedSheet && renderedSheet && !sheetLoading && !sheetError && (
            <article className="sheet-reader">
              <header className="sheet-reader-header">
                <h2>{selectedSheet.title}</h2>
                <p>
                  {selectedSheet.topics.join(', ')} | {selectedSheet.tags.join(', ')}
                </p>
              </header>
              <div
                className="sheet-content"
                dir={renderedSheet.direction}
                // @spec SHEETS-WEB-004, SHEETS-READ-002, SHEETS-READ-003
                dangerouslySetInnerHTML={{ __html: renderedSheet.html }}
              />
            </article>
          )}
        </section>
      </main>
    </div>
  )
}

export default App
