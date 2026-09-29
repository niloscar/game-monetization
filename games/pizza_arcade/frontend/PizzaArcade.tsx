import { useCallback, useState } from 'react'
import GameCanvas from './components/GameCanvas'
import StartScreen from './components/StartScreen'
import type { GamePhase } from './types/game'
import styles from './pizza-arcade.module.css'

export default function PizzaArcade() {
    const [phase, setPhase] = useState<GamePhase>('start')
    const [isHovered, setIsHovered] = useState(false)

    const handlePhaseChange = useCallback((phase: GamePhase) => {
        setPhase(phase)
    }, [])

    return (
        <div
            className={styles.game}
            onMouseEnter={() => setIsHovered(true)}
            onMouseLeave={() => setIsHovered(false)}
        >
            <GameCanvas
                onPhaseChange={handlePhaseChange}
                isHovered={isHovered}
            />

            {phase === 'start' && <StartScreen />}
        </div>
    )
}