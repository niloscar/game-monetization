import { useEffect, useState } from 'react'
import PizzaArcade from '../../../games/pizza_arcade/frontend/PizzaArcade'
import PreGameAd from './Ads/PreGameAd'
import { getAds, getAdPolicy } from '../api/ad'
import { selectWeightedAds } from '../utils/selectWeightedAds'
import type { Ad, AdPolicy } from '@assignment/shared/types/ad'
import styles from './game.module.css'

export default function Game() {
    const [adPolicy, setAdPolicy] = useState<AdPolicy | null>(null)
    const [displayAds, setDisplayAds] = useState<Ad[]>([])
    const [preGameAd, setPreGameAd] = useState<Ad | null>(null)
    const [showPreGameAd, setShowPreGameAd] = useState(false)
    const [canStart, setCanStart] = useState(false)

    useEffect(() => {
        const loadGameData = async () => {
            try {
                const policy = await getAdPolicy()
                setAdPolicy(policy)

                if (policy.display) {
                    const ads = await getAds('display')
                    setDisplayAds(ads)
                }

                if (policy.preGame) {
                    const ads = await getAds('pre_game')
                    const [selectedAd] = selectWeightedAds(ads, 1)

                    if (selectedAd) {
                        setPreGameAd(selectedAd)
                    } else {
                        setCanStart(true) // No pre-game ad available, allow game to start
                    }
                } else {
                    setCanStart(true)
                }
            } catch (error) {
                console.error('Failed to load game data:', error)
            }
        }

        loadGameData()
    }, [])

    const handleStartRequest = () => {
        if (!adPolicy?.preGame || !preGameAd) {
            setCanStart(true)
            return
        }

        setShowPreGameAd(true)
    }

    const handlePreGameAdComplete = () => {
        setShowPreGameAd(false)
        setCanStart(true)
    }

    const pizzaArcadeAds = displayAds.map((ad) => ({
        id: ad.id,
        mediaUrl: ad.media_url
    }))

    return (
        <div className={styles['game-container']}>
            <PizzaArcade
                displayAds={pizzaArcadeAds}
                canStart={canStart}
                onStartRequest={handleStartRequest}
            />

            {showPreGameAd && preGameAd && (
                <PreGameAd
                    ad={preGameAd}
                    onComplete={handlePreGameAdComplete}
                />
            )}
        </div>
    )
}