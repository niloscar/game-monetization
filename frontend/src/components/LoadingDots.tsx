import { useEffect, useState } from 'react'
import styles from './loading-dots.module.css'

export default function LoadingDots() {

    const [loadingDots, setLoadingDots] = useState(0)

    useEffect(() => {
        const interval = setInterval(() => {
            setLoadingDots((dots) => dots >= 3 ? 0 : dots + 1)
        }, 300)

        return () => clearInterval(interval)
    }, [])

    return (
        <span className={styles['loading-dots']}>
            {[1, 2, 3].map((dot) => (
                <span
                    key={dot}
                    className={dot <= loadingDots ? '' : styles['hidden']}
                >
                    .
                </span>
            ))}
        </span>
    )
}
