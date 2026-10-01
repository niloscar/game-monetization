import type { Player, Position, WorldObject, GameState, SpawnedPowerUp } from '../types/game'
import { respawnWorldObject, getWorldObjectHealthDelta, getWorldObjectScoreDelta } from './worldObjects'
import { changePlayerHealth } from './health'
import { changeScore, registerHealthPickup } from './score'
import { deliverPizza, pickupPizza } from './pizza'
import { applyPowerUpEffects, respawnPowerUp } from './powerUps'

function collidesWithRect(
    player: Player,
    position: Position,
    width: number,
    height: number
) {
    const playerLeft = player.position.x - player.vehicle.width / 2
    const playerRight = player.position.x + player.vehicle.width / 2
    const playerTop = player.position.y - player.vehicle.height / 2
    const playerBottom = player.position.y + player.vehicle.height / 2

    const objectLeft = position.x - width / 2
    const objectRight = position.x + width / 2
    const objectTop = position.y - height / 2
    const objectBottom = position.y + height / 2

    return (
        playerLeft < objectRight &&
        playerRight > objectLeft &&
        playerTop < objectBottom &&
        playerBottom > objectTop
    )
}

export function collidesWithObject(player: Player, object: WorldObject) {
    return collidesWithRect(
        player,
        object.position,
        object.width,
        object.height
    )
}

export function collidesWithPowerUp(
    player: Player,
    spawnedPowerUp: SpawnedPowerUp
) {
    return collidesWithRect(
        player,
        spawnedPowerUp.position,
        spawnedPowerUp.powerUp.width,
        spawnedPowerUp.powerUp.height
    )
}

export function handleCollisions(state: GameState) {
    for (const object of state.world.objects) {
        if (!collidesWithObject(state.player, object)) continue

        const healthDelta = getWorldObjectHealthDelta(object.type)
        const scoreDelta = getWorldObjectScoreDelta(object.type)

        changePlayerHealth(state.player, healthDelta)

        if (object.type === 'pizza') pickupPizza(state)

        if (healthDelta > 0) {
            registerHealthPickup(state, scoreDelta)
        } else if (scoreDelta !== 0) {
            changeScore(state, scoreDelta)
        }

        respawnWorldObject(state, object)
    }

    for (const spawnedPowerUp of state.world.powerUps) {
        if (!collidesWithPowerUp(state.player, spawnedPowerUp)) continue

        const { powerUp } = spawnedPowerUp

        if (powerUp.healthDelta !== 0) {
            changePlayerHealth(state.player, powerUp.healthDelta)
        }

        if (powerUp.scoreDelta !== 0) {
            changeScore(state, powerUp.scoreDelta)
        }

        applyPowerUpEffects(state, powerUp)
        respawnPowerUp(state, spawnedPowerUp)
    }

    if (collidesWithDeliveryTarget(state)) {
        deliverPizza(state)
    }
}

function collidesWithDeliveryTarget(state: GameState) {
    const target = state.world.deliveryTarget
    if (!target) return false

    return collidesWithRect(
        state.player,
        target.position,
        target.width,
        target.height
    )
}