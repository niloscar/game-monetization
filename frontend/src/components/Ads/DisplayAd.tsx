import type { Ad } from '@assignment/shared/types/ad'

export default function DisplayAd({ ad }: { ad: Ad }) {
  if (ad.media_type !== 'image') return null

  const image = <img src={ad.media_url} alt={ad.title ?? 'Annons'} />

  if (!ad.target_url) return image

  return (
    <a href={ad.target_url} target="_blank" rel="noreferrer">
      {image}
    </a>
  )
}