import { useCallback, useEffect, useState } from 'react'
import GameCanvas from './components/GameCanvas'
import StartScreen from './components/StartScreen'
import GameOverScreen from './components/GameOverScreen'
import type { GamePhase } from './types/game'
import type { DisplayAd } from './types/ad'
import styles from './pizza-arcade.module.css'

interface PizzaArcadeProps {
    displayAds: DisplayAd[]
    canStart: boolean
    onStartRequest: () => void
    onRestartRequest: () => void
}

export default function PizzaArcade({
    displayAds,
    canStart,
    onStartRequest,
    onRestartRequest
}: PizzaArcadeProps) {
    const [gamePhase, setGamePhase] = useState<GamePhase>('start')
    const [isHovered, setIsHovered] = useState(false)
    const [startToken, setStartToken] = useState(0)
    const [restartToken, setRestartToken] = useState(0)

    const handleGamePhaseChange = useCallback((phase: GamePhase) => {
        setGamePhase(phase)
    }, [])

    const handleStart = useCallback(() => {
        setStartToken((token) => token + 1)
    }, [])

    const handleRestart = useCallback(() => {
        onRestartRequest()
        setRestartToken((token) => token + 1)
    }, [onRestartRequest])

    useEffect(() => {
        const handleKeyDown = (event: KeyboardEvent) => {
            if (event.code !== 'Space' || !isHovered || event.repeat) return

            if (gamePhase === 'start') {
                event.preventDefault()
                handleStart()
            }

            if (gamePhase === 'gameOver') {
                event.preventDefault()
                handleRestart()
            }
        }

        window.addEventListener('keydown', handleKeyDown)

        return () => {
            window.removeEventListener('keydown', handleKeyDown)
        }
    }, [gamePhase, isHovered, handleStart, handleRestart])

    return (
        <div
            className={styles.game}
            onMouseEnter={() => setIsHovered(true)}
            onMouseLeave={() => setIsHovered(false)}
        >
            <GameCanvas
                onPhaseChange={handleGamePhaseChange}
                displayAds={displayAds}
                canStart={canStart}
                startToken={startToken}
                restartToken={restartToken}
                onStartRequest={onStartRequest}
            />

            {gamePhase === 'start' && <StartScreen />}

            {gamePhase === 'gameOver' && (
                <GameOverScreen />
            )}
        </div>
    )
}