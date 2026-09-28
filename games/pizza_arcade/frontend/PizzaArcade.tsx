import { useCallback, useState } from 'react'
import GameCanvas from './components/GameCanvas'
import type { GamePhase } from './types/game'
import StartScreen from './components/StartScreen'
import styles from './pizza-arcade.module.css'

export default function PizzaArcade() {
    const [phase, setPhase] = useState<GamePhase>('start')

    const handlePhaseChange = useCallback((phase: GamePhase) => {
        setPhase(phase)
    }, [])

    return (
        <div className={styles.game}>
            <GameCanvas onPhaseChange={handlePhaseChange} />
            {phase === 'start' && <StartScreen />}
        </div>
    )
}
