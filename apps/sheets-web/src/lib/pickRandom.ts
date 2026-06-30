import type { SheetSummary } from '../types'

/**
 * Select a sheet uniformly at random from a (filtered) list.
 *
 * The `rng` parameter defaults to `Math.random` but is injectable so tests can
 * assert selection deterministically without touching the global RNG.
 */
// @spec SHEETS-VS-006
export function pickRandomSheet(
  sheets: SheetSummary[],
  rng: () => number = Math.random,
): SheetSummary | null {
  if (sheets.length === 0) {
    return null
  }

  const index = Math.floor(rng() * sheets.length)
  return sheets[index]
}