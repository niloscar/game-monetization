import type { GameState } from '../types/game'
import { GAME_BOUNDS, SIDEWALK_WIDTH } from './gameState'

const ROAD_MARKING_WIDTH = 8
const ROAD_MARKING_HEIGHT = 50
const ROAD_MARKING_GAP = 50

export const renderGame = (ctx: CanvasRenderingContext2D, state: GameState) => {
    const { canvas } = ctx
    const { player } = state
    const { vehicle } = player

    ctx.clearRect(0, 0, canvas.width, canvas.height)

    /* Render the background */
    ctx.fillStyle = '#4f7d3a'
    ctx.fillRect(0, 0, canvas.width, canvas.height)

    /* Render the sidewalks */
    ctx.fillStyle = '#b5b5b5'
    ctx.fillRect(
        GAME_BOUNDS.left - SIDEWALK_WIDTH,
        0,
        SIDEWALK_WIDTH,
        canvas.height
    )
    ctx.fillRect(GAME_BOUNDS.right, 0, SIDEWALK_WIDTH, canvas.height)

    /* Render the road */
    ctx.fillStyle = '#2f2f2f'
    ctx.fillRect(
        GAME_BOUNDS.left,
        0,
        GAME_BOUNDS.right - GAME_BOUNDS.left,
        canvas.height
    )

    /* Render the road markings */
    const roadCenter = (GAME_BOUNDS.left + GAME_BOUNDS.right) / 2
    const markingInterval = ROAD_MARKING_HEIGHT + ROAD_MARKING_GAP
    const markingOffset = state.world.scrollOffset % markingInterval

    ctx.fillStyle = '#ffffff'

    for (let y = -markingInterval + markingOffset; y < canvas.height; y += markingInterval) {
        ctx.fillRect(
            roadCenter - ROAD_MARKING_WIDTH / 2,
            y,
            ROAD_MARKING_WIDTH,
            ROAD_MARKING_HEIGHT
        )
    }

    /* Render the world objects */
    for (const object of state.world.objects) {
        ctx.fillStyle = '#c0392b'

        ctx.fillRect(
            object.position.x - object.width / 2,
            object.position.y - object.height / 2,
            object.width,
            object.height
        )
    }

    /* Render the player */
    ctx.fillStyle = '#ffffff'
    ctx.fillRect(
        player.position.x - vehicle.width / 2,
        player.position.y - vehicle.height / 2,
        vehicle.width,
        vehicle.height
    )
}
