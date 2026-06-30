import { describe, expect, it, vi } from 'vitest'
import type { SheetSummary } from '../types'
import { pickRandomSheet } from './pickRandom'

const sheet = (id: string): SheetSummary => ({
  id,
  title: id,
  summary: '',
  topics: [],
  tags: [],
  languageSupport: ['english'],
  format: 'markdown',
  filePath: `/data/sheets/${id}.md`,
})

const sheets = [sheet('alpha'), sheet('beta'), sheet('gamma')]

describe('pickRandomSheet', () => {
  // @spec SHEETS-VS-006
  it('returns null when the filtered list is empty', () => {
    expect(pickRandomSheet([])).toBeNull()
  })

  // @spec SHEETS-VS-006
  it('returns the sole sheet when the filtered list has one entry', () => {
    expect(pickRandomSheet([sheet('only')])).toEqual(sheet('only'))
  })

  // @spec SHEETS-VS-006
  it('selects uniformly by drawing an index from the injected rng', () => {
    expect(pickRandomSheet(sheets, () => 0)!.id).toBe('alpha')
    expect(pickRandomSheet(sheets, () => 0.5)!.id).toBe('beta')
    expect(pickRandomSheet(sheets, () => 0.99)!.id).toBe('gamma')
  })

  // @spec SHEETS-VS-006
  it('always returns a member of the list regardless of the rng draw', () => {
    const ids = new Set(sheets.map((s) => s.id))
    for (const r of [0, 0.25, 0.5, 0.75, 0.999]) {
      const picked = pickRandomSheet(sheets, () => r)
      expect(picked).not.toBeNull()
      expect(ids.has(picked!.id)).toBe(true)
    }
  })

  // @spec SHEETS-VS-006
  it('uses Math.random by default and stays within the list', () => {
    vi.spyOn(Math, 'random').mockReturnValue(0)
    expect(pickRandomSheet(sheets)?.id).toBe('alpha')
    vi.spyOn(Math, 'random').mockReturnValue(0.99)
    expect(pickRandomSheet(sheets)?.id).toBe('gamma')
    vi.restoreAllMocks()
  })
})