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

// @spec SHEETS-SS-001, SHEETS-SS-007
// Strip Google Docs-style inline classes and styles from HTML sheets
const cleanupHtmlStyles = (html: string): string => {
  // Remove <head> section entirely (contains Google Docs CSS)
  const withoutHead = html.replace(/<head[\s\S]*?<\/head>/gi, '')

  // Remove class attributes from Google Docs
  const withoutClasses = withoutHead.replace(/\sclass="[^"]*"/gi, '')

  // Remove style attributes from Google Docs
  const withoutInlineStyles = withoutClasses.replace(/\sstyle="[^"]*"/gi, '')

  // Remove empty paragraphs
  const withoutEmptyPs = withoutInlineStyles.replace(/<p[^>]*>\s*<\/p>/gi, '')

  return withoutEmptyPs
}

// @spec SHEETS-READ-002, SHEETS-READ-003
export const renderSheet = async (
  rawContent: string,
  format: SheetFormat,
  preferredDirection?: SheetDirection,
): Promise<RenderedSheet> => {
  let html = format === 'markdown' ? await marked.parse(rawContent) : rawContent

  // Clean up Google Docs-style inline classes and styles for HTML sheets
  if (format === 'html') {
    html = cleanupHtmlStyles(html)
  }

  return {
    html: DOMPurify.sanitize(html),
    direction: resolveDirection(preferredDirection, rawContent),
  }
}
