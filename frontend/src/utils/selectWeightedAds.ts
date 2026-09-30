import type { Ad } from '@assignment/shared/types/ad'

export function selectWeightedAds(ads: Ad[], count: number): Ad[] {
  const available = [...ads]
  const selected: Ad[] = []

  while (available.length > 0 && selected.length < count) {
    const totalWeight = available.reduce((sum, ad) => sum + (ad.weight ?? 1), 0)
    let random = Math.random() * totalWeight

    const index = available.findIndex((ad) => {
      random -= ad.weight ?? 1
      return random <= 0
    })

    const selectedIndex = index >= 0 ? index : available.length - 1
    const [ad] = available.splice(selectedIndex, 1)

    if (ad) selected.push(ad)
  }

  return selected
}