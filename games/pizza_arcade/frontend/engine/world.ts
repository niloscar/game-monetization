import { CANVAS_HEIGHT, WORLD_STEP, WORLD_X } from './gameState'
import { respawnWorldObject } from './worldObjects'

import type { Billboard, GameState } from '../types/game'

const WORLD_SPEED_MULTIPLIER = 2
const BILLBOARD_MIN_GAP_STEPS = 3
const BILLBOARD_MAX_GAP_STEPS = 5
const BILLBOARD_BOTTOM_MARGIN = 100

export const updateWorld = (state: GameState, deltaTime: number): number[] => {
    const distance = state.player.speed * WORLD_SPEED_MULTIPLIER * deltaTime
    const respawnedBillboardIds: number[] = []

    state.world.scrollOffset += distance
    state.world.elapsedTime += deltaTime

    for (const object of state.world.objects) {
        object.position.y += distance

        if (object.position.y - object.height / 2 > CANVAS_HEIGHT) {
            respawnWorldObject(state, object)
        }
    }

    for (const billboard of state.world.billboards) {
        billboard.position.y += distance

        if (billboard.position.y - billboard.height / 2 > CANVAS_HEIGHT + BILLBOARD_BOTTOM_MARGIN) {
            respawnBillboard(state, billboard)
            respawnedBillboardIds.push(billboard.id)
        }
    }

    return respawnedBillboardIds
}

const respawnBillboard = (state: GameState, billboard: Billboard) => {
    const topmostY = Math.min(...state.world.billboards.map((billboard) => billboard.position.y))
    const gapSteps = randomInteger(BILLBOARD_MIN_GAP_STEPS, BILLBOARD_MAX_GAP_STEPS)

    billboard.position.y = topmostY - gapSteps * WORLD_STEP
    billboard.position.x = Math.random() < 0.5
        ? WORLD_X.leftScenery
        : WORLD_X.rightScenery
}

const randomInteger = (min: number, max: number) => {
    return Math.floor(Math.random() * (max - min + 1)) + min
}