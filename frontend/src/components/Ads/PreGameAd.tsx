import { useEffect, useRef, useState } from 'react'
import type { Ad } from '@assignment/shared/types/ad'
import styles from './pre-game-ad.module.css'

interface PreGameAdProps {
    ad: Ad
    onComplete: () => void
}

export default function PreGameAd({ ad, onComplete }: PreGameAdProps) {
    const duration = ad.duration_seconds ?? 5
    const [remaining, setRemaining] = useState(duration)
    const onCompleteRef = useRef(onComplete)

    useEffect(() => {
        onCompleteRef.current = onComplete
    }, [onComplete])

    useEffect(() => {
        const startedAt = Date.now()

        const interval = window.setInterval(() => {
            const elapsed = (Date.now() - startedAt) / 1000
            const nextRemaining = Math.max(0, Math.ceil(duration - elapsed))

            setRemaining(nextRemaining)

            if (elapsed >= duration) {
                window.clearInterval(interval)
                onCompleteRef.current()
            }
        }, 250)

        return () => window.clearInterval(interval)
    }, [duration])

    return (
        <div className={styles['pre-game-ad']}>
            {ad.media_type === 'image' && (
                <img src={ad.media_url} alt={ad.title ?? 'Annons'} />
            )}

            {ad.media_type === 'video' && (
                <video src={ad.media_url} autoPlay muted playsInline />
            )}

            <div className={styles['countdown']}>
                Spelet startar om {remaining}
            </div>
        </div>
    )
}