import type { GameState } from '../types/game'

const WORLD_SPEED_MULTIPLIER = 2

export const updateWorld = (state: GameState, deltaTime: number) => {
    const distance = state.player.speed * WORLD_SPEED_MULTIPLIER * deltaTime

    state.world.scrollOffset += distance

    for (const object of state.world.objects) {
        object.position.y += distance
    }
}