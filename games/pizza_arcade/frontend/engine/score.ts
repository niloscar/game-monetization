import type { GameState } from '../types/game'
import { WORLD_UNITS_PER_METER } from './gameState'

const POINTS_PER_METER = 1
const PIZZA_DELIVERY_SCORE = 500

export function changeScore(state: GameState, delta: number) {
    const adjustedDelta =
        delta > 0
            ? Math.round(delta * state.powerUpEffects.scoreMultiplier)
            : delta

    state.score.total = Math.max(0, state.score.total + adjustedDelta)

    if (delta < 0) {
        state.score.penalties += Math.abs(delta)
    }
}

export function registerHealthPickup(state: GameState, scoreDelta: number) {
    state.score.healthPickups += 1
    changeScore(state, scoreDelta)
}

export function registerPizzaDelivery(state: GameState) {
    state.score.pizzasDelivered += 1
    changeScore(state, PIZZA_DELIVERY_SCORE)
}

export function updateDistanceScore(state: GameState, distance: number) {
    const previousMeters = Math.floor(
        state.score.distanceTravelled / WORLD_UNITS_PER_METER
    )

    state.score.distanceTravelled += distance

    const currentMeters = Math.floor(
        state.score.distanceTravelled / WORLD_UNITS_PER_METER
    )

    const travelledMeters = currentMeters - previousMeters

    if (travelledMeters > 0) {
        changeScore(state, travelledMeters * POINTS_PER_METER)
    }
}

export function getScore(state: GameState) {
    return Math.max(0, state.score.total)
}