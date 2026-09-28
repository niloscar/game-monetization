import type { GameState } from '../types/game'
import type { InputState } from './input'
import { updateMovement } from './movement'
import { renderGame } from './render'

export const createGameLoop = (ctx: CanvasRenderingContext2D, state: GameState, input: InputState) => {
  let animationFrameId: number
  let previousTime = 0

  const loop = (time: number) => {
    const deltaTime = previousTime ? (time - previousTime) / 1000 : 0
    previousTime = time

    updateMovement(state, input, deltaTime)
    renderGame(ctx, state)

    animationFrameId = requestAnimationFrame(loop)
  }

  const start = () => {
    animationFrameId = requestAnimationFrame(loop)
  }

  const stop = () => {
    cancelAnimationFrame(animationFrameId)
  }

  return {
    start,
    stop,
  }
}