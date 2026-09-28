import type { GameState } from '../types/game'
import type { InputState } from './input'

export const updateMovement = (state: GameState, input: InputState, deltaTime: number) => {
  const { player } = state

  if (input.accelerate) player.speed += player.acceleration * deltaTime
  if (input.brake) player.speed -= player.braking * deltaTime

  player.speed = Math.max(0, Math.min(player.speed, player.maxSpeed))

  const steeringFactor = player.speed / player.maxSpeed

  if (input.left) player.position.x -= player.steeringSpeed * steeringFactor * deltaTime
  if (input.right) player.position.x += player.steeringSpeed * steeringFactor * deltaTime
}