import type { SheetSummary } from '../types'

interface DiscoveryViewProps {
  catalog: SheetSummary[]
  filteredSheets: SheetSummary[]
  query: string
  topic: string
  tag: string
  topicOptions: string[]
  tagOptions: string[]
  catalogLoading: boolean
  catalogError: string | null
  notFoundId: string | null
  onQueryChange: (value: string) => void
  onTopicChange: (value: string) => void
  onTagChange: (value: string) => void
  onClearNotFound: () => void
  onOpen: (id: string) => void
  onRandom: () => void
}

// @spec SHEETS-VS-001, SHEETS-WEB-003, SHEETS-VS-006, SHEETS-VS-007, SHEETS-VS-009
export default function DiscoveryView({
  filteredSheets,
  query,
  topic,
  tag,
  topicOptions,
  tagOptions,
  catalogLoading,
  catalogError,
  notFoundId,
  onQueryChange,
  onTopicChange,
  onTagChange,
  onClearNotFound,
  onOpen,
  onRandom,
}: DiscoveryViewProps) {
  const randomDisabled = filteredSheets.length === 0 || catalogLoading || catalogError !== null

  const handleQuery = (value: string) => {
    onClearNotFound()
    onQueryChange(value)
  }

  const handleTopic = (value: string) => {
    onClearNotFound()
    onTopicChange(value)
  }

  const handleTag = (value: string) => {
    onClearNotFound()
    onTagChange(value)
  }

  return (
    <div className="app-shell">
      <header className="masthead">
        <div className="logo-container">
          <img src="/lamdan_logo.png" alt="Lamdan Logo" className="logo-img" />
          <div className="site-title">Lamdan <span>Learning</span></div>
        </div>
        <p className="eyebrow">Source Sheet Library</p>
        <h1>Find the right sheet for today&apos;s learning.</h1>
        <p className="lead">
          Browse by topic and tags, then read beautifully rendered Markdown or HTML sheets on any
          device.
        </p>
      </header>

      <main className="layout" aria-busy={catalogLoading}>
        <section className="catalog-panel">
          <div className="search-controls">
            <label htmlFor="sheet-search">Search</label>
            <input
              id="sheet-search"
              type="search"
              placeholder="Search by title, summary, topic, or tag"
              value={query}
              onChange={(event) => handleQuery(event.target.value)}
            />

            <label htmlFor="topic-filter">Topic</label>
            <select
              id="topic-filter"
              value={topic}
              onChange={(event) => handleTopic(event.target.value)}
            >
              <option value="all">All topics</option>
              {topicOptions.map((item) => (
                <option key={item} value={item}>
                  {item}
                </option>
              ))}
            </select>

            <label htmlFor="tag-filter">Tag</label>
            <select
              id="tag-filter"
              value={tag}
              onChange={(event) => handleTag(event.target.value)}
            >
              <option value="all">All tags</option>
              {tagOptions.map((item) => (
                <option key={item} value={item}>
                  {item}
                </option>
              ))}
            </select>

            <button
              type="button"
              className="just-pick-one"
              onClick={onRandom}
              disabled={randomDisabled}
            >
              Just pick one
            </button>
          </div>

          {notFoundId && <p className="status status-error">Sheet not found</p>}
          {catalogError && <p className="status status-error">{catalogError}</p>}
          {catalogLoading && <p className="status">Loading catalog...</p>}

          {!catalogLoading && !catalogError && filteredSheets.length === 0 && (
            <p className="status">
              No sheets matched your filters. Try another topic, tag, or search term.
            </p>
          )}

          <div className="section-divider" />

          <ul className="sheet-list">
            {filteredSheets.map((sheet) => (
              <li key={sheet.id}>
                <button
                  type="button"
                  className="sheet-card"
                  onClick={() => onOpen(sheet.id)}
                >
                  <h2>{sheet.title}</h2>
                  {sheet.author && <p className="author">By {sheet.author}</p>}
                  <p>{sheet.summary}</p>
                  <p className="meta">
                    Topic: {sheet.topics.join(', ')} | Tags: {sheet.tags.join(', ')}
                  </p>
                </button>
              </li>
            ))}
          </ul>
        </section>
      </main>
    </div>
  )
}