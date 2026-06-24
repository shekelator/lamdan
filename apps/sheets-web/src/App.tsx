import { useEffect, useMemo, useState } from 'react'
import { Navigate, Route, Routes, useLocation, useNavigate } from 'react-router-dom'
import DiscoveryView from './components/DiscoveryView'
import ReaderView from './components/ReaderView'
import { filterSheets } from './lib/filterSheets'
import { pickRandomSheet } from './lib/pickRandom'
import type { SheetSummary } from './types'

function App() {
  const [catalog, setCatalog] = useState<SheetSummary[]>([])
  const [catalogLoading, setCatalogLoading] = useState(true)
  const [catalogError, setCatalogError] = useState<string | null>(null)

  const [query, setQuery] = useState('')
  const [topic, setTopic] = useState('all')
  const [tag, setTag] = useState('all')

  const [notFoundId, setNotFoundId] = useState<string | null>(null)
  const [discoveryScroll, setDiscoveryScroll] = useState(0)

  const navigate = useNavigate()
  const location = useLocation()

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

  const topicOptions = useMemo(() => {
    return Array.from(new Set(catalog.flatMap((sheet) => sheet.topics))).sort((a, b) =>
      a.localeCompare(b),
    )
  }, [catalog])

  const tagOptions = useMemo(() => {
    return Array.from(
      new Set(catalog.flatMap((sheet) => sheet.tags)),
    ).sort((a, b) => a.localeCompare(b))
  }, [catalog])

  const filteredSheets = useMemo(() => {
    return filterSheets(catalog, { query, topic, tag })
  }, [catalog, query, topic, tag])

  // @spec SHEETS-VS-005
  // Restore the saved Discovery scroll position after returning to "/".
  useEffect(() => {
    if (location.pathname !== '/') {
      return
    }

    const saved = discoveryScroll
    const frame = requestAnimationFrame(() => window.scrollTo(0, saved))
    return () => cancelAnimationFrame(frame)
  }, [location.pathname, discoveryScroll])

  const captureScrollAndNavigate = (path: string) => {
    setDiscoveryScroll(window.scrollY)
    navigate(path)
  }

  const openSheet = (id: string) => captureScrollAndNavigate(`/s/${id}`)

  // @spec SHEETS-VS-006
  const pickRandom = () => {
    const picked = pickRandomSheet(filteredSheets)
    if (picked) {
      captureScrollAndNavigate(`/s/${picked.id}`)
    }
  }

  const goHome = () => navigate('/')

  const markNotFound = (id: string) => {
    setNotFoundId(id)
    navigate('/')
  }

  const clearNotFound = () => setNotFoundId(null)

  return (
    // @spec SHEETS-WEB-003, SHEETS-VS-001, SHEETS-VS-003
    <Routes>
      <Route
        path="/"
        element={
          <DiscoveryView
            catalog={catalog}
            filteredSheets={filteredSheets}
            query={query}
            topic={topic}
            tag={tag}
            topicOptions={topicOptions}
            tagOptions={tagOptions}
            catalogLoading={catalogLoading}
            catalogError={catalogError}
            notFoundId={notFoundId}
            onQueryChange={setQuery}
            onTopicChange={setTopic}
            onTagChange={setTag}
            onClearNotFound={clearNotFound}
            onOpen={openSheet}
            onRandom={pickRandom}
          />
        }
      />
      <Route
        path="/s/:id"
        element={
          <ReaderView
            catalog={catalog}
            catalogLoading={catalogLoading}
            onBack={goHome}
            onNotFound={markNotFound}
          />
        }
      />
      <Route path="*" element={<Navigate to="/" replace />} />
    </Routes>
  )
}

export default App