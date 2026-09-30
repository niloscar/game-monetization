export type GamePhase = 'start' | 'playing' | 'gameOver'

export interface GameState {
    phase: GamePhase
    player: Player
    world: World
}

export interface Player {
    position: Position
    speed: number
    health: number
    vehicle: Vehicle
}

export interface Position {
    x: number
    y: number
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
    objects: WorldObject[]
    billboards: Billboard[]
}

export type WorldObjectType = 'parkedCar' | 'trashCan' | 'pedestrian'

export interface WorldObject {
    id: number
    type: WorldObjectType
    position: Position
    width: number
    height: number
}

export interface Billboard {
    id: number
    position: Position
    width: number
    height: number
    adIndex: number
}