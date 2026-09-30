import { createGameState } from './createGameState'
import { renderGame } from './render'
import { handleCollisions } from './collision'
import { updateBillboards } from './billboards'
import { updateMovement } from './movement'
import { updateSurvivalScore } from './score'
import { updateWorld } from './world'
import { updateWorldObjectCount } from './worldObjects'

import type { GameAssets } from './assets'
import type { GameState } from '../types/game'
import type { LoadedDisplayAd } from '../types/ad'
import type { InputState } from './input'

export const createGameLoop = (
    ctx: CanvasRenderingContext2D,
    state: GameState,
    input: InputState,
    assets: GameAssets,
    onPhaseChange: (phase: GameState['phase']) => void,
    getDisplayAds: () => LoadedDisplayAd[],
    canStart: () => boolean,
    onStartRequest: () => void,
    showScore: () => boolean
) => {
    let animationFrameId: number
    let previousTime = 0
    let startRequested = false

    const loop = (time: number) => {
        const deltaTime = previousTime ? (time - previousTime) / 1000 : 0
        previousTime = time

        if (state.phase === 'start' && startRequested && canStart()) {
            state.phase = 'playing'
            onPhaseChange(state.phase)
        }

        if (state.phase === 'playing') {
            updateSurvivalScore(state, deltaTime)

            updateMovement(state, input, deltaTime)

            const respawnedBillboardIds = updateWorld(state, deltaTime)

            updateWorldObjectCount(state)
            updateBillboards(state, respawnedBillboardIds, getDisplayAds().length)
            handleCollisions(state)

            if (state.player.health.current === 0) {
                state.phase = 'gameOver'
                onPhaseChange(state.phase)
                console.log('Game Over: Player health reached 0')
            }
        }

        renderGame(ctx, state, getDisplayAds(), assets, showScore())

        animationFrameId = requestAnimationFrame(loop)
    }

    const requestStart = () => {
        if (state.phase !== 'start') return

        if (canStart()) {
            state.phase = 'playing'
            onPhaseChange(state.phase)
        } else if (!startRequested) {
            startRequested = true
            onStartRequest()
        }
    }

    const start = () => {
        animationFrameId = requestAnimationFrame(loop)
    }

    const stop = () => {
        cancelAnimationFrame(animationFrameId)
    }

    const restart = () => {
        const initialState = createGameState()

        state.score = initialState.score
        state.phase = initialState.phase
        state.player = initialState.player
        state.world = initialState.world
        
        startRequested = false

        onPhaseChange(state.phase)
        requestStart()
    }

    return {
        start,
        stop,
        requestStart,
        restart
    }
}