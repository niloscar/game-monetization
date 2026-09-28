import type { GameState } from '../types/game'

const WORLD_SPEED_MULTIPLIER = 2

export const updateWorld = (state: GameState, deltaTime: number) => {
    state.world.scrollOffset += state.player.speed * WORLD_SPEED_MULTIPLIER * deltaTime
}