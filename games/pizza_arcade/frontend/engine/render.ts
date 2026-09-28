import type { GameState } from '../types/game'

export const renderGame = (ctx: CanvasRenderingContext2D, state: GameState) => {
  const { canvas } = ctx
  const { player } = state

  ctx.clearRect(0, 0, canvas.width, canvas.height)

  ctx.fillRect(
    player.position.x - player.width / 2,
    player.position.y - player.height / 2,
    player.width,
    player.height
  )
}