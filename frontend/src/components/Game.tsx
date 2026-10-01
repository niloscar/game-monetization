import { useEffect, useState } from 'react'
import PizzaArcade from '../../../games/pizza_arcade/frontend/PizzaArcade'
import PreGameAd from './Ads/PreGameAd'
import { getAds } from '../api/ad'
import { getGameAccess, saveScore } from '../api/game'
import { selectWeightedAds } from '../utils/selectWeightedAds'
import type { GameAccess } from '../types/gameAccess'
import type { Ad } from '@assignment/shared/types/ad'
import styles from './game.module.css'


export default function Game() {
    const [gameAccess, setGameAccess] = useState<GameAccess | null>(null)
    const [displayAds, setDisplayAds] = useState<Ad[]>([])
    const [preGameAd, setPreGameAd] = useState<Ad | null>(null)
    const [showPreGameAd, setShowPreGameAd] = useState(false)
    const [canStart, setCanStart] = useState(false)

    useEffect(() => {
        const loadGameData = async () => {
            try {
                const access = await getGameAccess()
                setGameAccess(access)

                if (access.ads.display) {
                    const ads = await getAds('display')
                    setDisplayAds(ads)
                }

                if (access.ads.preGame) {
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
        if (!gameAccess?.ads.preGame || !preGameAd) {
            setCanStart(true)
            return
        }

        setShowPreGameAd(true)
    }

    const handleRestartRequest = () => {
        setShowPreGameAd(false)
        setCanStart(!gameAccess?.ads.preGame || !preGameAd)
    }

    const handlePreGameAdComplete = () => {
        setShowPreGameAd(false)
        setCanStart(true)
    }

    const handleGameOver = async (score: number) => {
        if (!gameAccess?.canSaveScore) return

        try {
            await saveScore(score)
            console.log('Score saved:', score)
        } catch (error) {
            console.error('Failed to save score:', error)
        }
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
                showScore={gameAccess?.showCurrentScore ?? false}
                onStartRequest={handleStartRequest}
                onRestartRequest={handleRestartRequest}
                onGameOver={handleGameOver}
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