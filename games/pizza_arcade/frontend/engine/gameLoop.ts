import type { GameState } from '../types/game'
import type { InputState } from './input'
import { updateMovement } from './movement'
import { updateWorld } from './world'
import { renderGame } from './render'

export const createGameLoop = (
    ctx: CanvasRenderingContext2D,
    state: GameState,
    input: InputState,
    onPhaseChange: (phase: GameState['phase']) => void
) => {
    let animationFrameId: number
    let previousTime = 0

    const loop = (time: number) => {
        const deltaTime = previousTime ? (time - previousTime) / 1000 : 0
        previousTime = time

        if (state.phase === 'start' && input.start) {
            state.phase = 'playing'
            onPhaseChange(state.phase)
        }

        if (state.phase === 'playing') {
            updateMovement(state, input, deltaTime)
            updateWorld(state, deltaTime)
        }

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
        stop
    }
}
