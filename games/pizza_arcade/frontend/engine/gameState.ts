import type { GameBounds, GameState, Vehicle } from '../types/game'

export const CANVAS_WIDTH = 800
export const CANVAS_HEIGHT = 600

export const WORLD_STEP = 100

export const WORLD_X = {
    leftScenery: 110,
    rightScenery: 690
} as const

export const SIDEWALK_WIDTH = 90
export const SIDEWALK_EDGE_WIDTH = 30
export const PARKED_ZONE_WIDTH = 100
export const CENTER_LINE_OVERLAP = 20

export const GAME_BOUNDS: GameBounds = {
    left: 150,
    right: 650,
    top: 80,
    bottom: 550
}

export const ROAD_CENTER_X = (GAME_BOUNDS.left + GAME_BOUNDS.right) / 2

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

export const createInitialGameState = (): GameState => ({
    phase: 'start',
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
        ]
    }
})