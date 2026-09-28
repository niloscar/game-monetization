export interface Position {
    x: number
    y: number
}

export interface Player {
    position: Position
    width: number
    height: number
    speed: number // Vehicle speed through the world
    maxSpeed: number
    acceleration: number
    braking: number
    steeringSpeed: number
    forwardSpeed: number // Player's speed of movement in the forward direction (y-axis)
    health: number
}

export interface GameState {
    player: Player
}

export interface GameBounds {
  left: number
  right: number
  top: number
  bottom: number
}