import { describe, expect, it } from 'vitest'
import { filterSheets } from './filterSheets'
import type { SheetSummary } from '../types'

const sheets: SheetSummary[] = [
  {
    id: 'a',
    title: 'Justice and Mercy',
    summary: 'Balancing accountability and kindness.',
    topics: ['Ethics'],
    tags: ['middot'],
    languageSupport: ['english', 'hebrew'],
    format: 'markdown',
    filePath: '/a.md',
  },
  {
    id: 'b',
    title: 'Shabbat Lights',
    summary: 'Welcoming Shabbat with calm.',
    topics: ['Shabbat'],
    tags: ['ritual'],
    languageSupport: ['english'],
    format: 'html',
    filePath: '/b.html',
  },
]

describe('filterSheets', () => {
  // @spec SHEETS-CAT-001
  it('filters by free text across searchable metadata', () => {
    const result = filterSheets(sheets, {
      query: 'kindness',
      topic: 'all',
      tag: 'all',
    })

    expect(result).toHaveLength(1)
    expect(result[0].id).toBe('a')
  })

  // @spec SHEETS-CAT-002, SHEETS-CAT-003
  it('combines topic and tag filters with logical AND', () => {
    const result = filterSheets(sheets, {
      query: '',
      topic: 'Shabbat',
      tag: 'ritual',
    })

    expect(result).toHaveLength(1)
    expect(result[0].id).toBe('b')
  })

  // @spec SHEETS-CAT-004
  it('returns an empty set when nothing matches', () => {
    const result = filterSheets(sheets, {
      query: 'nonexistent',
      topic: 'all',
      tag: 'all',
    })

    expect(result).toHaveLength(0)
  })
})
