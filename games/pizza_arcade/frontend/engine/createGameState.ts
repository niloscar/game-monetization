import { createInitialGameState } from './gameState'
import { loadPowerUpImages, spawnPowerUp } from './powerUps'
import { createWorldObjects, spawnInitialWorldObjects } from './worldObjects'

import type { GameState } from '../types/game'
import type { PowerUp } from '@assignment/shared/types/powerUp'


export function createGameState(powerUps: PowerUp[]): GameState {
    const state = createInitialGameState(powerUps)

    loadPowerUpImages(powerUps)

    state.world.objects = createWorldObjects()
    spawnInitialWorldObjects(state)

    spawnPowerUp(state)
    console.log('Spawned power-ups:', state.world.powerUps)

    return state
}