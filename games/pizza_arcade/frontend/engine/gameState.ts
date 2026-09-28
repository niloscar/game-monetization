import type { GameBounds, GameState, Vehicle } from '../types/game'

export const SIDEWALK_WIDTH = 90

export const GAME_BOUNDS: GameBounds = {
    left: 150,
    right: 650,
    top: 80,
    bottom: 550,
}

const SKATEBOARD: Vehicle = {
    type: 'skateboard',
    width: 20,
    height: 35,
    maxSpeed: 200,
    acceleration: 80,
    braking: 160,
    steeringSpeed: 350,
    forwardSpeed: 120,
    canUseSidewalk: true,
}

export const createInitialGameState = (): GameState => ({
    phase: 'start',
    player: {
        position: {
            x: 400,
            y: 500,
        },
        speed: 0,
        health: 100,
        vehicle: SKATEBOARD,
    },
    world: {
        scrollOffset: 0,
    },
})