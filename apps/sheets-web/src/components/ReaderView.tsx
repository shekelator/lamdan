import { useEffect, useState } from 'react'
import { useParams } from 'react-router-dom'
import { renderSheet } from '../lib/renderSheet'
import type { RenderedSheet, SheetSummary } from '../types'

interface ReaderViewProps {
  catalog: SheetSummary[]
  catalogLoading: boolean
  onBack: () => void
  onNotFound: (id: string) => void
}

// @spec SHEETS-VS-002, SHEETS-VS-003, SHEETS-VS-004, SHEETS-READ-005
export default function ReaderView({
  catalog,
  catalogLoading,
  onBack,
  onNotFound,
}: ReaderViewProps) {
  const { id = '' } = useParams()
  const sheet = catalog.find((item) => item.id === id) ?? null

  const [renderedSheet, setRenderedSheet] = useState<RenderedSheet | null>(null)
  const [sheetLoading, setSheetLoading] = useState(false)
  const [sheetError, setSheetError] = useState<string | null>(null)

  // Unknown id once the catalog has resolved: return to Discovery with a status.
  useEffect(() => {
    if (!catalogLoading && !sheet) {
      onNotFound(id)
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [catalogLoading, sheet, id])

  // @spec SHEETS-READ-001
  useEffect(() => {
    let isActive = true

    const loadSheet = async () => {
      if (!sheet) {
        setRenderedSheet(null)
        setSheetError(null)
        return
      }

      setSheetLoading(true)
      setSheetError(null)

      try {
        const response = await fetch(sheet.filePath)
        if (!response.ok) {
          throw new Error('Unable to load the selected sheet.')
        }

        const rawContent = await response.text()
        const rendered = await renderSheet(
          rawContent,
          sheet.format,
          sheet.preferredDirection,
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
  }, [sheet])

  if (catalogLoading) {
    return (
      <div className="app-shell">
        <p className="status">Loading catalog...</p>
      </div>
    )
  }

  if (!sheet) {
    // Redirecting to Discovery via the not-found effect above.
    return null
  }

  return (
    <div className="app-shell reader-shell">
      <header className="reader-bar">
        <button type="button" className="back-button" onClick={onBack}>
          Back
        </button>
        <div className="reader-bar-title">
          <h1>{sheet.title}</h1>
          <p className="reader-meta">
            {sheet.topics.join(', ')} | {sheet.tags.join(', ')}
          </p>
        </div>
      </header>

      <main className="reader-panel">
        {sheetLoading && <p className="status">Loading sheet content...</p>}
        {sheetError && <p className="status status-error">{sheetError}</p>}

        {renderedSheet && !sheetLoading && !sheetError && (
          <article className="sheet-reader">
            <div
              className="sheet-content"
              dir={renderedSheet.direction}
              // @spec SHEETS-WEB-004, SHEETS-READ-002, SHEETS-READ-003
              dangerouslySetInnerHTML={{ __html: renderedSheet.html }}
            />
          </article>
        )}
      </main>
    </div>
  )
}