import type { Player, WorldObject, GameState } from '../types/game'
import {
    respawnWorldObject,
    getWorldObjectHealthDelta,
    getWorldObjectScoreDelta
} from './worldObjects'
import { changePlayerHealth } from './health'
import { changeScore, registerHealthPickup } from './score'
import { deliverPizza, pickupPizza } from './pizza'

export function collidesWithObject(player: Player, object: WorldObject) {
    const playerLeft = player.position.x - player.vehicle.width / 2
    const playerRight = player.position.x + player.vehicle.width / 2
    const playerTop = player.position.y - player.vehicle.height / 2
    const playerBottom = player.position.y + player.vehicle.height / 2

    const objectLeft = object.position.x - object.width / 2
    const objectRight = object.position.x + object.width / 2
    const objectTop = object.position.y - object.height / 2
    const objectBottom = object.position.y + object.height / 2

    return (
        playerLeft < objectRight &&
        playerRight > objectLeft &&
        playerTop < objectBottom &&
        playerBottom > objectTop
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

    if (collidesWithDeliveryTarget(state)) {
        deliverPizza(state)
    }
}

function collidesWithDeliveryTarget(state: GameState) {
    const target = state.world.deliveryTarget
    if (!target) return false

    const player = state.player

    const playerLeft = player.position.x - player.vehicle.width / 2
    const playerRight = player.position.x + player.vehicle.width / 2
    const playerTop = player.position.y - player.vehicle.height / 2
    const playerBottom = player.position.y + player.vehicle.height / 2

    const targetLeft = target.position.x - target.width / 2
    const targetRight = target.position.x + target.width / 2
    const targetTop = target.position.y - target.height / 2
    const targetBottom = target.position.y + target.height / 2

    return (
        playerLeft < targetRight &&
        playerRight > targetLeft &&
        playerTop < targetBottom &&
        playerBottom > targetTop
    )
}