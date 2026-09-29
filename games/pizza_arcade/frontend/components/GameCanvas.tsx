import { useEffect, useRef } from 'react'
import { createInitialGameState } from '../engine/gameState'
import { createInput } from '../engine/input'
import { createGameLoop } from '../engine/gameLoop'
import type { GamePhase } from '../types/game'

const CANVAS_WIDTH = 800
const CANVAS_HEIGHT = 600

interface GameCanvasProps {
    onPhaseChange: (phase: GamePhase) => void
    isHovered: boolean
}

export default function GameCanvas({ onPhaseChange, isHovered }: GameCanvasProps) {
    const canvasRef = useRef<HTMLCanvasElement>(null)
    const isHoveredRef = useRef(isHovered)

    useEffect(() => {
        isHoveredRef.current = isHovered
    }, [isHovered])

    useEffect(() => {
        const canvas = canvasRef.current
        if (!canvas) return

        const ctx = canvas.getContext('2d')
        if (!ctx) return

        const state = createInitialGameState()
        const input = createInput(canvas)
        const gameLoop = createGameLoop(ctx, state, input.state, onPhaseChange)

        const handleKeyDown = (event: KeyboardEvent) => {
            if (event.code !== 'Space' || !isHoveredRef.current || document.activeElement === canvas)
                return

            event.preventDefault()
            canvas.focus()
            input.state.start = true
        }

        window.addEventListener('keydown', handleKeyDown)

        input.start()
        gameLoop.start()

        return () => {
            window.removeEventListener('keydown', handleKeyDown)
            input.stop()
            gameLoop.stop()
        }
    }, [onPhaseChange])

    return (
        <canvas
            ref={canvasRef}
            width={CANVAS_WIDTH}
            height={CANVAS_HEIGHT}
            tabIndex={0}
        />
    )
}