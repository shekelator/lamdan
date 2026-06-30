import type { SheetSummary } from '../types'

export interface FilterInput {
  query: string
  topic: string
  tag: string
}

const includesText = (value: string, search: string): boolean => value.toLowerCase().includes(search)

// @spec SHEETS-CAT-001, SHEETS-CAT-002, SHEETS-CAT-003
export const filterSheets = (sheets: SheetSummary[], filters: FilterInput): SheetSummary[] => {
  const search = filters.query.trim().toLowerCase()

  return sheets
    .filter((sheet) => {
      if (filters.topic !== 'all' && !sheet.topics.includes(filters.topic)) {
        return false
      }

      if (filters.tag !== 'all' && !sheet.tags.includes(filters.tag)) {
        return false
      }

      if (!search) {
        return true
      }

      return (
        includesText(sheet.title, search) ||
        includesText(sheet.summary, search) ||
        sheet.topics.some((topic) => includesText(topic, search)) ||
        sheet.tags.some((tag) => includesText(tag, search))
      )
    })
    .sort((a, b) => a.title.localeCompare(b.title))
}
