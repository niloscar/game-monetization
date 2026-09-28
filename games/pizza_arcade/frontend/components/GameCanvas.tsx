import { useEffect, useRef } from 'react'
import { createInitialGameState } from '../engine/gameState'
import { createInput } from '../engine/input'
import { createGameLoop } from '../engine/gameLoop'
import type { GamePhase } from '../types/game'

const CANVAS_WIDTH = 800
const CANVAS_HEIGHT = 600

interface GameCanvasProps {
    onPhaseChange: (phase: GamePhase) => void
}

export default function GameCanvas({ onPhaseChange }: GameCanvasProps) {
    const canvasRef = useRef<HTMLCanvasElement>(null)

    useEffect(() => {
        const canvas = canvasRef.current
        if (!canvas) return

        const ctx = canvas.getContext('2d')
        if (!ctx) return

        const state = createInitialGameState()
        const input = createInput()
        const gameLoop = createGameLoop(ctx, state, input.state, onPhaseChange)

        input.start()
        gameLoop.start()

        return () => {
            input.stop()
            gameLoop.stop()
        }
    }, [onPhaseChange])

    return <canvas ref={canvasRef} width={CANVAS_WIDTH} height={CANVAS_HEIGHT} />
}