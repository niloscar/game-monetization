import type { PowerUp } from '@assignment/shared/types/powerUp'

export type GamePhase = 'start' | 'playing' | 'gameOver'

export interface GameState {
    phase: GamePhase
    player: Player
    world: World
    score: ScoreState
    availablePowerUps: PowerUp[]
    powerUpEffects: PowerUpEffects
    pickupNotification: PickupNotification
}

export interface ScoreState {
    total: number
    distanceTravelled: number
    pizzasDelivered: number
    healthPickups: number
    penalties: number
}

export interface Player {
    position: Position
    speed: number
    health: Health
    vehicle: Vehicle
    pizzas: number
}

export interface Position {
    x: number
    y: number
}
export interface Health {
    current: number
    max: number
}
export interface Vehicle {
    type: VehicleType
    width: number
    height: number
    maxSpeed: number
    acceleration: number
    braking: number
    steeringSpeed: number
    forwardSpeed: number
    canUseSidewalk: boolean
}

export type VehicleType = 'skateboard' | 'bike' | 'moped' | 'car' | 'van'

export interface GameBounds {
    left: number
    right: number
    top: number
    bottom: number
}
export interface World {
    scrollOffset: number
    elapsedTime: number
    objects: WorldObject[]
    powerUps: SpawnedPowerUp[]
    billboards: Billboard[]
    deliveryTarget: DeliveryTarget | null
    spawn: {
        lastSide: WorldSide | null
        sameSideCount: number
    }
}

export type WorldSide = 'left' | 'right'

export type WorldObjectType = 
    'soda' |
    'pizza' |
    'dogPoo' |
    'tireFire' |
    'tires' |
    'rat' | 
    'cat' | 
    'dog' | 
    'trashCan' | 
    'mailBox' | 
    'pedestrian' | 
    'cyclist' | 
    'lightPole' | 
    'streetSign' | 
    'car' | 
    'concreteBarrier' | 
    'container' | 
    'schoolBus' | 
    'concreteTruck' | 
    'manhole'

export interface InitialWorldObject {
    type: WorldObjectType
    width: number
    height: number
    count: number
}

export interface WorldObject {
    id: number
    type: WorldObjectType
    position: Position
    width: number
    height: number
    spawnZone?: SpawnZone
    spawnSide?: WorldSide
    spriteFrame: number
}

export interface Billboard {
    id: number
    position: Position
    width: number
    height: number
    adIndex: number
}

export type SpawnZone =
    'grass' | 'sidewalkEdge' | 'sidewalk' | 'parked' | 'lane'

export interface DeliveryTarget {
    position: Position
    width: number
    height: number
    side: WorldSide
}

export interface SpawnedPowerUp {
    id: number
    powerUp: PowerUp
    position: Position
}

export interface PowerUpEffects {
    speedMultiplier: number
    speedExpiresAt: number
    speedName: string | null
    scoreMultiplier: number
    scoreExpiresAt: number
    scoreName: string | null
}

export interface PickupNotification {
    name: string | null
    startedAt: number
}