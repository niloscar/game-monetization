import { useCallback, useState } from 'react'
import GameCanvas from './components/GameCanvas'
import StartScreen from './components/StartScreen'
import type { GamePhase } from './types/game'
import type { DisplayAd } from './types/ad'
import styles from './pizza-arcade.module.css'

interface PizzaArcadeProps {
    displayAds: DisplayAd[]
}

export default function PizzaArcade({ displayAds }: PizzaArcadeProps) {
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
            />

            {gamePhase === 'start' && <StartScreen />}
        </div>
    )
}
