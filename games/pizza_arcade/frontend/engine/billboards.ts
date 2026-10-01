import { CANVAS_HEIGHT, WORLD_STEP, WORLD_X } from './gameState'

import type { Billboard, GameState } from '../types/game'

const BILLBOARD_MIN_GAP_STEPS = 3
const BILLBOARD_MAX_GAP_STEPS = 5
const BILLBOARD_BOTTOM_MARGIN = 100

export function updateBillboardPositions(
    state: GameState,
    distance: number
): number[] {
    const respawnedBillboardIds: number[] = []

    for (const billboard of state.world.billboards) {
        billboard.position.y += distance

        if (
            billboard.position.y - billboard.height / 2 >
            CANVAS_HEIGHT + BILLBOARD_BOTTOM_MARGIN
        ) {
            respawnBillboard(state, billboard)
            respawnedBillboardIds.push(billboard.id)
        }
    }

    return respawnedBillboardIds
}

export function updateBillboards(
    state: GameState,
    respawnedBillboardIds: number[],
    adCount: number
) {
    if (adCount === 0) return

    for (const billboardId of respawnedBillboardIds) {
        const billboard = state.world.billboards.find(
            (billboard) => billboard.id === billboardId
        )
        if (!billboard) continue

        billboard.adIndex = getNextAdIndex(billboard.adIndex, adCount)
    }
}

function respawnBillboard(state: GameState, billboard: Billboard) {
    const topmostY = Math.min(
        ...state.world.billboards.map((billboard) => billboard.position.y)
    )

    const gapSteps = randomInteger(
        BILLBOARD_MIN_GAP_STEPS,
        BILLBOARD_MAX_GAP_STEPS
    )

    billboard.position.y = topmostY - gapSteps * WORLD_STEP
    billboard.position.x =
        Math.random() < 0.5
            ? WORLD_X.leftScenery
            : WORLD_X.rightScenery
}

function getNextAdIndex(currentIndex: number, adCount: number) {
    if (adCount <= 1) return 0

    let nextIndex = currentIndex

    while (nextIndex === currentIndex) {
        nextIndex = Math.floor(Math.random() * adCount)
    }

    return nextIndex
}

function randomInteger(min: number, max: number) {
    return Math.floor(Math.random() * (max - min + 1)) + min
}