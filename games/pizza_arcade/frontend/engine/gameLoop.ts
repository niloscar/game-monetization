import type { GameState } from '../types/game'
import type { LoadedDisplayAd } from '../types/ad'
import type { InputState } from './input'
import { updateMovement } from './movement'
import { updateWorld } from './world'
import { renderGame } from './render'

export const createGameLoop = (
    ctx: CanvasRenderingContext2D,
    state: GameState,
    input: InputState,
    onPhaseChange: (phase: GameState['phase']) => void,
    getDisplayAds: () => LoadedDisplayAd[]
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

            const respawnedBillboardIds = updateWorld(state, deltaTime)
            const displayAds = getDisplayAds()

            for (const billboardId of respawnedBillboardIds) {
                const billboard = state.world.billboards.find(
                    (billboard) => billboard.id === billboardId
                )
                if (!billboard || displayAds.length === 0) continue

                billboard.adIndex = getNextAdIndex(
                    billboard.adIndex,
                    displayAds.length
                )
            }
        }

        renderGame(ctx, state, getDisplayAds())

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

const getNextAdIndex = (currentIndex: number, adCount: number) => {
    if (adCount <= 1) return 0

    let nextIndex = currentIndex

    while (nextIndex === currentIndex) {
        nextIndex = Math.floor(Math.random() * adCount)
    }

    return nextIndex
}