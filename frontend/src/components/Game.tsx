import { useEffect, useState } from 'react'
import PizzaArcade from '../../../games/pizza_arcade/frontend/PizzaArcade'
import PreGameAd from './Ads/PreGameAd'
import { getAds } from '../api/ad'
import { getGameAccess, saveScore } from '../api/game'
import { selectWeightedAds } from '../utils/selectWeightedAds'
import type { GameAccess } from '../types/gameAccess'
import type { Ad } from '@assignment/shared/types/ad'
import styles from './game.module.css'
import UpgradeAlert from './UpgradeAlert'


export default function Game() {
    const [gameAccess, setGameAccess] = useState<GameAccess | null>(null)
    const [displayAds, setDisplayAds] = useState<Ad[]>([])
    const [preGameAds, setPreGameAds] = useState<Ad[]>([])
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
                    setPreGameAds(ads)

                    if (ads.length === 0) {
                        setCanStart(true)
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
        if (!gameAccess?.ads.preGame || preGameAds.length === 0) {
            setCanStart(true)
            return
        }

        const [selectedAd] = selectWeightedAds(preGameAds, 1)

        if (!selectedAd) {
            setCanStart(true)
            return
        }

        setPreGameAd(selectedAd)
        setShowPreGameAd(true)
    }

    const handleRestartRequest = () => {
        setPreGameAd(null)
        setShowPreGameAd(false)
        setCanStart(!gameAccess?.ads.preGame || preGameAds.length === 0)
    }

    const handlePreGameAdComplete = () => {
        setShowPreGameAd(false)
        setPreGameAd(null)
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
            {gameAccess && (
                <PizzaArcade
                    displayAds={pizzaArcadeAds}
                    canStart={canStart}
                    showScore={gameAccess.showCurrentScore}
                    powerUps={gameAccess.powerUps}
                    onStartRequest={handleStartRequest}
                    onRestartRequest={handleRestartRequest}
                    onGameOver={handleGameOver}
                />
            )}

            {gameAccess && showPreGameAd && preGameAd && (
                <PreGameAd
                    ad={preGameAd}
                    onComplete={handlePreGameAdComplete}
                />
            )}

            {gameAccess && <UpgradeAlert showPreGameAd={showPreGameAd} />}
        </div>
    )
}