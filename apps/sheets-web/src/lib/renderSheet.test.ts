import { describe, expect, it } from 'vitest'
import { renderSheet } from './renderSheet'

describe('renderSheet', () => {
  // @spec SHEETS-READ-002
  it('converts markdown input into sanitized HTML', async () => {
    const result = await renderSheet('# Title\n\n<script>alert(1)</script>', 'markdown', 'ltr')

    expect(result.html).toContain('<h1>Title</h1>')
    expect(result.html).not.toContain('<script>')
    expect(result.direction).toBe('ltr')
  })

  // @spec SHEETS-READ-003
  it('chooses rtl direction when Hebrew text appears', async () => {
    const result = await renderSheet('<p>שלום עולם</p>', 'html')

    expect(result.direction).toBe('rtl')
  })
})
