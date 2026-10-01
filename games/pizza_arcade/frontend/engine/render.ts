import { GAME_BOUNDS, SIDEWALK_WIDTH } from './gameState'
import { getWorldObjectSprite, getWorldObjectHealthDelta } from './worldObjects'
import { getPowerUpImage } from './powerUps'

import type { GameState } from '../types/game'
import type { LoadedDisplayAd } from '../types/ad'
import type { GameAssets, AssetName } from './assets'
import { SPRITE_SHEETS } from './assets'


const ROAD_MARKING_WIDTH = 8
const ROAD_MARKING_HEIGHT = 50
const ROAD_MARKING_GAP = 50

export const renderGame = (
    ctx: CanvasRenderingContext2D,
    state: GameState,
    displayAds: LoadedDisplayAd[],
    assets: GameAssets,
    showScore: boolean
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
        const x = object.position.x - object.width / 2
        const y = object.position.y - object.height / 2

        const sprite = getWorldObjectSprite(object.type)

        if (sprite) {
            drawSprite(
                ctx,
                assets,
                sprite.asset,
                object.spriteFrame,
                x,
                y,
                object.width,
                object.height
            )

            continue
        }

        const healthDelta = getWorldObjectHealthDelta(object.type)

        ctx.fillStyle =
            healthDelta > 0
                ? '#27ae60'
                : healthDelta < 0
                ? '#c0392b'
                : '#7f8c8d'

        ctx.fillRect(x, y, object.width, object.height)
    }

    /* Render the power-ups */
    for (const spawnedPowerUp of state.world.powerUps) {
        const { powerUp, position } = spawnedPowerUp
        const image = getPowerUpImage(powerUp.id)

        const x = position.x - powerUp.width / 2
        const y = position.y - powerUp.height / 2

        if (image?.complete && image.naturalWidth > 0) {
            ctx.drawImage(
                image,
                x,
                y,
                powerUp.width,
                powerUp.height
            )
        } else {
            ctx.fillStyle = '#ffd54a'
            ctx.fillRect(
                x,
                y,
                powerUp.width,
                powerUp.height
            )
        }
    }

    /* Render the delivery target */
    renderDeliveryTarget(ctx, state)

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

    /* Render the inventory */
    renderInventory(ctx, state)

    /* Render the delivered goods count */
    renderDelivered(ctx, state)

    /* Render active power-ups */
    renderPowerUpStatus(ctx, state) 

    // Render the score if showScore is true
    if (showScore) {
        renderScore(ctx, state)
    }
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

function renderScore(ctx: CanvasRenderingContext2D, state: GameState) {
    ctx.fillStyle = '#fff'
    ctx.font = '20px monospace'
    ctx.textAlign = 'right'
    ctx.fillText(`${state.score.total}`, ctx.canvas.width - 20, 34)
}

function renderDeliveryTarget(ctx: CanvasRenderingContext2D, state: GameState) {
    const target = state.world.deliveryTarget
    if (!target) return

    const x = target.position.x - target.width / 2
    const y = target.position.y - target.height / 2

    ctx.fillStyle = '#f1c40f'
    ctx.fillRect(x, y, target.width, target.height)

    ctx.fillStyle = '#000'
    ctx.font = '16px monospace'
    ctx.textAlign = 'center'
    ctx.textBaseline = 'middle'
    ctx.fillText('PIZZA', target.position.x, target.position.y)
}

function renderInventory(ctx: CanvasRenderingContext2D, state: GameState) {
    const positionY = 50
    const positionX = 20
    const lineHeight = 22
    
    const inventory = [
        { Pizza: state.player.pizzas }
    ]

    ctx.fillStyle = '#fff'
    ctx.font = 'bold 16px monospace'
    ctx.textAlign = 'left'
    ctx.textBaseline = 'top'

    ctx.fillText('I väskan', positionX, positionY)

    ctx.font = '16px monospace'
    inventory.forEach((item, index) => {
        const itemName = Object.keys(item)[0]
        const itemCount = Object.values(item)[0]

        ctx.fillText(
            `${itemName}: ${itemCount}`,
            positionX,
            positionY + lineHeight * (index + 1)
        )
    })
}

function renderDelivered(ctx: CanvasRenderingContext2D, state: GameState) {
    const positionY = 100
    const positionX = 20
    const lineHeight = 22

    const delivered = [
        { Pizza: state.score.pizzasDelivered },
    ]

    ctx.fillStyle = '#fff'
    ctx.font = 'bold 16px monospace'
    ctx.textAlign = 'left'
    ctx.textBaseline = 'top'

    ctx.fillText('Levererat', positionX, positionY)

    ctx.font = '16px monospace'
    delivered.forEach((item, index) => {
        const itemName = Object.keys(item)[0]
        const itemCount = Object.values(item)[0]

        ctx.fillText(
            `${itemName}: ${itemCount}`,
            positionX,
            positionY + lineHeight * (index + 1)
        )
    })
}

const POWER_UP_BLINK_DURATION = 1.2
const POWER_UP_BLINK_INTERVAL = 0.4

function renderPowerUpStatus(ctx: CanvasRenderingContext2D, state: GameState) {
    const { powerUpEffects, powerUpNotification } = state
    const elapsedTime = state.world.elapsedTime
    const notificationAge = elapsedTime - powerUpNotification.startedAt
    const isBlinking =
        powerUpNotification.name !== null &&
        notificationAge < POWER_UP_BLINK_DURATION

    if (isBlinking) {
        const isVisible =
            Math.floor(notificationAge / POWER_UP_BLINK_INTERVAL) % 2 === 0

        if (isVisible) {
            ctx.fillStyle = '#fff'
            ctx.font = 'bold 24px monospace'
            ctx.textAlign = 'center'
            ctx.textBaseline = 'top'
            ctx.fillText(
                powerUpNotification.name!,
                ctx.canvas.width / 2,
                ctx.canvas.height * .8
            )
        }
    }

    const activeEffects = [
        {
            name: powerUpEffects.speedName,
            expiresAt: powerUpEffects.speedExpiresAt
        },
        {
            name: powerUpEffects.scoreName,
            expiresAt: powerUpEffects.scoreExpiresAt
        }
    ].filter(
        (effect) =>
            effect.name &&
            effect.expiresAt > elapsedTime &&
            !(isBlinking && effect.name === powerUpNotification.name)
    )

    ctx.fillStyle = '#fff'
    ctx.font = '16px monospace'
    ctx.textAlign = 'left'
    ctx.textBaseline = 'top'

    activeEffects.forEach((effect, index) => {
        const secondsRemaining = Math.ceil(effect.expiresAt - elapsedTime)

        ctx.fillText(
            `${effect.name} ${secondsRemaining}s`,
            20,
            160 + index * 22
        )
    })
}

function drawSprite(
    ctx: CanvasRenderingContext2D,
    assets: GameAssets,
    asset: AssetName,
    frame: number,
    x: number,
    y: number,
    width: number,
    height: number
) {
    const image = assets[asset]

    if (!SPRITE_SHEETS.has(asset)) {
        ctx.drawImage(image, x, y, width, height)
        return
    }

    const frameCount = 3
    const sourceWidth = image.naturalWidth / frameCount
    const sourceHeight = image.naturalHeight

    ctx.drawImage(
        image,
        frame * sourceWidth,
        0,
        sourceWidth,
        sourceHeight,
        x,
        y,
        width,
        height
    )
}