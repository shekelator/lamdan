export type SheetFormat = 'markdown' | 'html'
export type SheetDirection = 'ltr' | 'rtl' | 'mixed'

export interface SheetSummary {
  id: string
  title: string
  summary: string
  topics: string[]
  tags: string[]
  languageSupport: string[]
  format: SheetFormat
  filePath: string
  preferredDirection?: SheetDirection
}

export interface RenderedSheet {
  html: string
  direction: 'ltr' | 'rtl'
}
