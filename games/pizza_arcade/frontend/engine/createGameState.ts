import type { GameState } from '../types/game'
import { createInitialGameState } from './gameState'
import {
    createWorldObjects,
    spawnInitialWorldObjects
} from './worldObjects'

export function createGameState(): GameState {
    const state = createInitialGameState()

    state.world.objects = createWorldObjects()
    spawnInitialWorldObjects(state)

    return state
}