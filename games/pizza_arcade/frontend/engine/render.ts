import { GAME_BOUNDS, SIDEWALK_WIDTH } from './gameState'
import { getWorldObjectSprite, getWorldObjectHealthDelta } from './worldObjects'

import type { GameState } from '../types/game'
import type { LoadedDisplayAd } from '../types/ad'
import type { GameAssets } from './assets'

const ROAD_MARKING_WIDTH = 8
const ROAD_MARKING_HEIGHT = 50
const ROAD_MARKING_GAP = 50

export const renderGame = (
    ctx: CanvasRenderingContext2D,
    state: GameState,
    displayAds: LoadedDisplayAd[],
    assets: GameAssets
) => {
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

    for (
        let y = -markingInterval + markingOffset;
        y < canvas.height;
        y += markingInterval
    ) {
        ctx.fillRect(
            roadCenter - ROAD_MARKING_WIDTH / 2,
            y,
            ROAD_MARKING_WIDTH,
            ROAD_MARKING_HEIGHT
        )
    }

    /* Render the world objects */
    for (const object of state.world.objects) {
        const sprite = getWorldObjectSprite(object.type)
        const healthDelta = getWorldObjectHealthDelta(object.type)

        const x = object.position.x - object.width / 2
        const y = object.position.y - object.height / 2

        if (sprite) {
            ctx.drawImage(assets[sprite], x, y, object.width, object.height)

            continue
        }

        ctx.fillStyle =
            healthDelta > 0
                ? '#27ae60'
                : healthDelta < 0
                  ? '#c0392b'
                  : '#7f8c8d'
        ctx.fillRect(x, y, object.width, object.height)
    }

    /* Render the player */
    ctx.fillStyle = '#ffffff'
    ctx.fillRect(
        player.position.x - vehicle.width / 2,
        player.position.y - vehicle.height / 2,
        vehicle.width,
        vehicle.height
    )

    /* Render the ads */
    renderAds(ctx, state, displayAds)

    /* Render the health bar */
    renderHealthBar(ctx, state)
}

function renderHealthBar(ctx: CanvasRenderingContext2D, state: GameState) {
    const { current, max } = state.player.health

    const x = 20
    const y = 20
    const width = 180
    const height = 18
    const padding = 3
    const strokeWidth = 2
    const percentage = Math.max(0, Math.min(1, current / max))

    ctx.fillStyle = '#fff'
    ctx.fillRect(
        x + padding,
        y + padding,
        (width - padding * 2) * percentage,
        height - padding * 2
    )

    ctx.lineWidth = strokeWidth
    ctx.strokeStyle = '#fff'
    ctx.strokeRect(x, y, width, height)
}

const renderAds = (
    ctx: CanvasRenderingContext2D,
    state: GameState,
    displayAds: LoadedDisplayAd[]
) => {
    for (const billboard of state.world.billboards) {
        const ad = displayAds[billboard.adIndex]
        if (!ad) continue

        renderBillboard(ctx, billboard, ad)
    }
}

const renderBillboard = (
    ctx: CanvasRenderingContext2D,
    billboard: GameState['world']['billboards'][number],
    ad: LoadedDisplayAd
) => {
    const x = billboard.position.x - billboard.width / 2
    const y = billboard.position.y - billboard.height / 2
    const roadCenter = (GAME_BOUNDS.left + GAME_BOUNDS.right) / 2
    const isLeftSide = billboard.position.x < roadCenter

    const framePadding = 8
    const poleHeight = 55
    const poleLean = 24
    const poleOffset = 80

    const poleTopX = isLeftSide
        ? x - poleOffset + billboard.width * 0.72
        : x + poleOffset + billboard.width * 0.28

    const poleTopY = y + billboard.height + 6
    const poleBaseX = isLeftSide ? poleTopX - poleLean : poleTopX + poleLean
    const poleBaseY = poleTopY + poleHeight

    /* Pole behind billboard */
    ctx.strokeStyle = '#4a4a4a'
    ctx.lineWidth = 10
    ctx.lineCap = 'round'
    ctx.beginPath()
    ctx.moveTo(poleBaseX, poleBaseY)
    ctx.lineTo(poleTopX, poleTopY)
    ctx.stroke()

    /* Billboard frame */
    ctx.fillStyle = '#4b3621'
    ctx.fillRect(
        x - framePadding,
        y - framePadding,
        billboard.width + framePadding * 2,
        billboard.height + framePadding * 2
    )

    /* Ad image */
    ctx.drawImage(ad.image, x, y, billboard.width, billboard.height)
}
