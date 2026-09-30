import type { GameState } from '../types/game'
import type { InputState } from './input'
import { GAME_BOUNDS, SIDEWALK_WIDTH } from './gameState'

export const updateMovement = (
    state: GameState,
    input: InputState,
    deltaTime: number
) => {
    const { player } = state
    const { vehicle } = player

    const halfPlayerWidth = vehicle.width / 2
    const halfPlayerHeight = vehicle.height / 2

    const top = GAME_BOUNDS.top + halfPlayerHeight
    const bottom = GAME_BOUNDS.bottom - halfPlayerHeight

    if (input.accelerate) player.position.y -= vehicle.acceleration * deltaTime
    if (input.brake) player.position.y += vehicle.braking * deltaTime

    player.position.y = Math.max(top, Math.min(player.position.y, bottom))

    const positionRatio = (bottom - player.position.y) / (bottom - top)
    const speedRatio = Math.sqrt(positionRatio)

    player.speed = vehicle.maxSpeed * speedRatio

    const steeringFactor =
        player.speed === 0 ? 0 : 0.2 + 0.8 * Math.sqrt(positionRatio)

    if (input.left)
        player.position.x -= vehicle.steeringSpeed * steeringFactor * deltaTime
    if (input.right)
        player.position.x += vehicle.steeringSpeed * steeringFactor * deltaTime

    const leftBoundary = vehicle.canUseSidewalk
        ? GAME_BOUNDS.left - SIDEWALK_WIDTH
        : GAME_BOUNDS.left

    const rightBoundary = vehicle.canUseSidewalk
        ? GAME_BOUNDS.right + SIDEWALK_WIDTH
        : GAME_BOUNDS.right

    player.position.x = Math.max(
        leftBoundary + halfPlayerWidth,
        Math.min(player.position.x, rightBoundary - halfPlayerWidth)
    )
}
