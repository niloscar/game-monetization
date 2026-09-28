import type { GameState } from '../types/game'

export const createInitialGameState = (): GameState => ({
  player: {
    position: {
      x: 400,
      y: 500,
    },
    speed: 0,
    maxSpeed: 300,
    acceleration: 100,
    braking: 200,
    steeringSpeed: 250,
    health: 100,
  },
})