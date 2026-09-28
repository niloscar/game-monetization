export interface Position {
  x: number
  y: number
}

export interface Player {
  position: Position
  speed: number
  maxSpeed: number
  acceleration: number
  braking: number
  steeringSpeed: number
  health: number
}

export interface GameState {
  player: Player
}