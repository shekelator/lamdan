import DOMPurify from 'dompurify'
import { marked } from 'marked'
import type { RenderedSheet, SheetDirection, SheetFormat } from '../types'

marked.setOptions({
  gfm: true,
  breaks: true,
})

const hebrewRegex = /[\u0590-\u05FF]/

const resolveDirection = (preferredDirection: SheetDirection | undefined, source: string): 'ltr' | 'rtl' => {
  if (preferredDirection === 'rtl') {
    return 'rtl'
  }

  if (preferredDirection === 'ltr') {
    return 'ltr'
  }

  return hebrewRegex.test(source) ? 'rtl' : 'ltr'
}

// @spec SHEETS-READ-002, SHEETS-READ-003
export const renderSheet = async (
  rawContent: string,
  format: SheetFormat,
  preferredDirection?: SheetDirection,
): Promise<RenderedSheet> => {
  const html = format === 'markdown' ? await marked.parse(rawContent) : rawContent

  return {
    html: DOMPurify.sanitize(html),
    direction: resolveDirection(preferredDirection, rawContent),
  }
}
