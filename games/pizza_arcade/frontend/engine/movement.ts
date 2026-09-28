import type { GameState } from '../types/game'
import type { InputState } from './input'
import { GAME_BOUNDS } from './gameState'

const MIN_MOVING_SPEED = 30

export const updateMovement = (
    state: GameState,
    input: InputState,
    deltaTime: number
) => {
    const { player } = state

    if (input.accelerate) {
        player.speed += player.acceleration * deltaTime
        player.position.y -= player.forwardSpeed * deltaTime
    }

    if (input.brake) {
        player.speed -= player.braking * deltaTime
        player.position.y += player.forwardSpeed * deltaTime

        const bottom = GAME_BOUNDS.bottom - player.height / 2
        if (player.position.y < bottom)
            player.speed = Math.max(player.speed, MIN_MOVING_SPEED)
    }

    player.speed = Math.max(0, Math.min(player.speed, player.maxSpeed))

    const steeringFactor = player.speed === 0 ? 0 : 0.6 + 0.4 * (player.speed / player.maxSpeed) // Make steering a bit more responsive than if linear.

    if (input.left)
        player.position.x -= player.steeringSpeed * steeringFactor * deltaTime
    if (input.right)
        player.position.x += player.steeringSpeed * steeringFactor * deltaTime

    const halfPlayerWidth = player.width / 2
    const halfPlayerHeight = player.height / 2

    player.position.x = Math.max(
        GAME_BOUNDS.left + halfPlayerWidth,
        Math.min(player.position.x, GAME_BOUNDS.right - halfPlayerWidth)
    )
    player.position.y = Math.max(
        GAME_BOUNDS.top + halfPlayerHeight,
        Math.min(player.position.y, GAME_BOUNDS.bottom - halfPlayerHeight)
    )
}
