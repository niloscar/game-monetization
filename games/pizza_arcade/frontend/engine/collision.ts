import type { Player, WorldObject } from '../types/game'
import { respawnWorldObject, getWorldObjectHealthDelta } from './worldObjects'
import { changePlayerHealth } from './health'
import type { GameState } from '../types/game'

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
        
        changePlayerHealth(state.player, getWorldObjectHealthDelta(object.type))

        respawnWorldObject(state, object)
    }
}