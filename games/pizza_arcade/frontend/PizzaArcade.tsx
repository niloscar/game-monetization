import { useCallback, useState } from 'react'
import GameCanvas from './components/GameCanvas'
import StartScreen from './components/StartScreen'
import type { GamePhase } from './types/game'
import type { DisplayAd } from './types/ad'
import styles from './pizza-arcade.module.css'

interface PizzaArcadeProps {
    displayAds: DisplayAd[]
    canStart: boolean
    onStartRequest: () => void
}

export default function PizzaArcade({ displayAds, canStart, onStartRequest }: PizzaArcadeProps) {
    const [gamePhase, setGamePhase] = useState<GamePhase>('start')

    const [isHovered, setIsHovered] = useState(false)

    const handleGamePhaseChange = useCallback((phase: GamePhase) => {
        setGamePhase(phase)
    }, [])

    return (
        <div
            className={styles.game}
            onMouseEnter={() => setIsHovered(true)}
            onMouseLeave={() => setIsHovered(false)}
        >
            <GameCanvas
                onPhaseChange={handleGamePhaseChange}
                isHovered={isHovered}
                displayAds={displayAds}
                canStart={canStart}
                onStartRequest={onStartRequest}
            />

            {gamePhase === 'start' && <StartScreen />}
        </div>
    )
}
