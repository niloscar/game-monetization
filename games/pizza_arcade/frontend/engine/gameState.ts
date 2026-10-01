import type { GameBounds, GameState, Vehicle } from '../types/game'
import type { PowerUp } from '@assignment/shared/types/powerUp'

export const CANVAS_WIDTH = 800
export const CANVAS_HEIGHT = 600

export const WORLD_STEP = 100

export const WORLD_X = {
    leftScenery: 110,
    rightScenery: 690
} as const

export const GAME_BOUNDS: GameBounds = {
    left: 150,
    right: 650,
    top: 80,
    bottom: 550
}

export const WORLD_UNITS_PER_METER = 40
export const WORLD_SPEED_MULTIPLIER = 2

export const ROAD_CENTER_X = (GAME_BOUNDS.left + GAME_BOUNDS.right) / 2
export const SIDEWALK_WIDTH = 90
export const SIDEWALK_EDGE_WIDTH = 30
export const PARKED_ZONE_WIDTH = 100
export const CENTER_LINE_OVERLAP = 20

export const SCORE_CONFIG = {
    survivalPerSecond: 10,
    pizzaDelivered: 500,
    healthPickupSmall: 50,
    healthPickupLarge: 100,
    pedestrianKilled: -500,
    cyclistKilled: -400,
    dogKilled: -300,
    catKilled: -300
} as const

const SKATEBOARD: Vehicle = {
    type: 'skateboard',
    width: 20,
    height: 35,
    maxSpeed: 200,
    acceleration: 80,
    braking: 160,
    steeringSpeed: 350,
    forwardSpeed: 120,
    canUseSidewalk: true
}

export const createInitialGameState = (powerUps: PowerUp[] = []): GameState => ({
    phase: 'start',
    availablePowerUps: powerUps,
    powerUpEffects: {
        speedMultiplier: 1,
        speedExpiresAt: 0,
        speedName: null,
        scoreMultiplier: 1,
        scoreExpiresAt: 0,
        scoreName: null
    },
    powerUpNotification: {
        name: null,
        startedAt: 0
    },
    score: {
        total: 0,
        distanceTravelled: 0,
        pizzasDelivered: 0,
        healthPickups: 0,
        penalties: 0
    },
    player: {
        position: {
            x: 400,
            y: 500
        },
        speed: 0,
        health: {
            current: 100,
            max: 100
        },
        pizzas: 0,
        vehicle: SKATEBOARD
    },
    world: {
        scrollOffset: 0,
        elapsedTime: 0,
        spawn: {
            lastSide: null,
            sameSideCount: 0
        },
        objects: [],
        powerUps: [],
        billboards: [
            {
                id: 1,
                position: {
                    x: WORLD_X.leftScenery,
                    y: 100
                },
                width: 180,
                height: 90,
                adIndex: 0
            },
            {
                id: 2,
                position: {
                    x: WORLD_X.rightScenery,
                    y: -300
                },
                width: 180,
                height: 90,
                adIndex: 1
            },
            {
                id: 3,
                position: {
                    x: WORLD_X.leftScenery,
                    y: -700
                },
                width: 180,
                height: 90,
                adIndex: 2
            }
        ],
        deliveryTarget: null
    }
})