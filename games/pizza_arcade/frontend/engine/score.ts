import type { GameState } from '../types/game'

const SURVIVAL_SCORE_PER_SECOND = 10
const PIZZA_DELIVERY_SCORE = 500

export function changeScore(state: GameState, delta: number) {
    state.score.total += delta

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

export function updateSurvivalScore(state: GameState, deltaTime: number) {
    const previousSeconds = Math.floor(state.score.survivalTime)

    state.score.survivalTime += deltaTime

    const currentSeconds = Math.floor(state.score.survivalTime)
    const elapsedSeconds = currentSeconds - previousSeconds

    if (elapsedSeconds > 0) {
        changeScore(state, elapsedSeconds * SURVIVAL_SCORE_PER_SECOND)
    }
}

export function getScore(state: GameState) {
    return Math.max(0, state.score.total)
}