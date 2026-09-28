import type { GameBounds, GameState } from '../types/game'

export const GAME_BOUNDS: GameBounds = {
    left: 100,
    right: 700,
    top: 80,
    bottom: 550
}

export const createInitialGameState = (): GameState => ({
    player: {
        position: {
            x: 400,
            y: 500
        },
        width: 40,
        height: 60,
        speed: 0,
        maxSpeed: 300,
        acceleration: 100,
        braking: 200,
        steeringSpeed: 350,
        forwardSpeed: 150,
        health: 100
    }
})
