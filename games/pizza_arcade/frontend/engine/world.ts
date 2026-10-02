import { CANVAS_HEIGHT, WORLD_SPEED_MULTIPLIER } from './gameState'
import { respawnWorldObject, isVehicle } from './worldObjects'
import { spawnDeliveryTarget } from './pizza'
import { respawnPowerUp, updatePowerUpEffects } from './powerUps'
import { updateDistanceScore } from './score'
import { updateBillboardPositions } from './billboards'

import type { GameState } from '../types/game'

const TRAFFIC_SPEED = 150

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

    const trafficDistance =
        TRAFFIC_SPEED *
        WORLD_SPEED_MULTIPLIER *
        deltaTime

    const minRightTrafficDistance =
        20 *
        WORLD_SPEED_MULTIPLIER *
        deltaTime

    for (const object of state.world.objects) {
        const isLaneVehicle =
            isVehicle(object.type) &&
            object.spawnZone === 'lane'

        const isRightLaneVehicle =
            isLaneVehicle &&
            object.spawnSide === 'right'

        if (isLaneVehicle) {
            if (object.spawnSide === 'left') {
                object.position.y += distance + trafficDistance
            } else {
                const relativeDistance = Math.max(
                    trafficDistance - distance,
                    minRightTrafficDistance
                )

                object.position.y -= relativeDistance
            }
        } else {
            object.position.y += distance
        }

        const isOffScreen = isRightLaneVehicle
            ? object.position.y + object.height / 2 < 0
            : object.position.y - object.height / 2 > CANVAS_HEIGHT

        if (isOffScreen) {
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