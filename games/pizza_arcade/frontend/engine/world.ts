import {
    CANVAS_HEIGHT,
    WORLD_SPEED_MULTIPLIER
} from './gameState'
import { respawnWorldObject } from './worldObjects'
import { spawnDeliveryTarget } from './pizza'
import { respawnPowerUp, updatePowerUpEffects } from './powerUps'
import { updateDistanceScore } from './score'
import { updateBillboardPositions } from './billboards'

import type { GameState } from '../types/game'

export const updateWorld = (state: GameState, deltaTime: number): number[] => {
    const distance =
        state.player.speed *
        state.powerUpEffects.speedMultiplier *
        WORLD_SPEED_MULTIPLIER *
        deltaTime

    updateDistanceScore(state, distance)

    state.world.scrollOffset += distance
    state.world.elapsedTime += deltaTime

    updatePowerUpEffects(state)

    for (const object of state.world.objects) {
        object.position.y += distance

        if (object.position.y - object.height / 2 > CANVAS_HEIGHT) {
            respawnWorldObject(state, object)
        }
    }

    for (const spawnedPowerUp of state.world.powerUps) {
        spawnedPowerUp.position.y += distance

        if (
            spawnedPowerUp.position.y -
            spawnedPowerUp.powerUp.height / 2 >
            CANVAS_HEIGHT
        ) {
            respawnPowerUp(state, spawnedPowerUp)
        }
    }

    if (state.world.deliveryTarget) {
        state.world.deliveryTarget.position.y += distance

        if (
            state.world.deliveryTarget.position.y -
            state.world.deliveryTarget.height / 2 >
            CANVAS_HEIGHT
        ) {
            spawnDeliveryTarget(state)
        }
    }

    return updateBillboardPositions(state, distance)
}