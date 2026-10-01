import { GAME_BOUNDS, SIDEWALK_WIDTH } from './gameState'
import { changeScore } from './score'
import type { GameState, WorldSide } from '../types/game'

const DELIVERY_SCORE = 500
const DELIVERY_WIDTH = 70
const DELIVERY_HEIGHT = 100
const DELIVERY_SPAWN_DISTANCE = 600

export function pickupPizza(state: GameState) {
    state.player.pizzas += 1

    if (!state.world.deliveryTarget) {
        spawnDeliveryTarget(state)
    }
}

export function deliverPizza(state: GameState) {
    if (state.player.pizzas <= 0) return

    state.player.pizzas -= 1
    state.score.pizzasDelivered += 1
    changeScore(state, DELIVERY_SCORE)

    if (state.player.pizzas > 0) {
        spawnDeliveryTarget(state)
    } else {
        state.world.deliveryTarget = null
    }
}

export function spawnDeliveryTarget(state: GameState) {
    const side: WorldSide = Math.random() < 0.5 ? 'left' : 'right'

    state.world.deliveryTarget = {
        position: {
            x: getDeliveryX(side),
            y: -DELIVERY_SPAWN_DISTANCE
        },
        width: DELIVERY_WIDTH,
        height: DELIVERY_HEIGHT,
        side
    }
}

function getDeliveryX(side: WorldSide) {
    return side === 'left'
        ? GAME_BOUNDS.left - SIDEWALK_WIDTH / 2
        : GAME_BOUNDS.right + SIDEWALK_WIDTH / 2
}