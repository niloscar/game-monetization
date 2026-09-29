import { useEffect, useState } from 'react'
import PizzaArcade from '../../../games/pizza_arcade/frontend/PizzaArcade'
import { getAds, getAdPolicy } from '../api/ad'
import type { Ad, AdPolicy } from '@assignment/shared/types/ad'
import styles from './game.module.css'

export default function Game() {
    const [adPolicy, setAdPolicy] = useState<AdPolicy | null>(null)
    const [displayAds, setDisplayAds] = useState<Ad[]>([])

    useEffect(() => {
        const loadGameData = async () => {
            try {
                const policy = await getAdPolicy()
                setAdPolicy(policy)
                console.log('Ad policy:', policy)

                if (policy.display) {
                    const ads = await getAds('display')
                    setDisplayAds(ads)
                } else {
                    setDisplayAds([])
                }
            } catch (error) {
                console.error('Failed to load game data:', error)
            }
        }

        loadGameData()
    }, [])

    const pizzaArcadeAds = displayAds.map((ad) => ({
        id: ad.id,
        mediaUrl: ad.media_url
    }))

    return (
        <div className={styles['game-container']}>
            <PizzaArcade displayAds={pizzaArcadeAds} />
        </div>
    )
}