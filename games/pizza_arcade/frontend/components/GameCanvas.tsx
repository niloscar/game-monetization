import { useEffect, useRef } from 'react'
import { createInitialGameState } from '../engine/gameState'
import { createInput } from '../engine/input'
import { createGameLoop } from '../engine/gameLoop'

const CANVAS_WIDTH = 800
const CANVAS_HEIGHT = 600

export default function GameCanvas() {
  const canvasRef = useRef<HTMLCanvasElement>(null)

  useEffect(() => {
    const canvas = canvasRef.current
    if (!canvas) return

    const ctx = canvas.getContext('2d')
    if (!ctx) return

    const state = createInitialGameState()
    const input = createInput()
    const gameLoop = createGameLoop(ctx, state, input.state)

    input.start()
    gameLoop.start()

    return () => {
      input.stop()
      gameLoop.stop()
    }
  }, [])

  return <canvas ref={canvasRef} width={CANVAS_WIDTH} height={CANVAS_HEIGHT} />
}