import { getSpawnSide, getSpawnX } from './worldZones'
import { WORLD_UNITS_PER_METER } from './gameState'
import type { GameState, SpawnedPowerUp } from '../types/game'
import type { PowerUp } from '@assignment/shared/types/powerUp'

const POWER_UP_MIN_GAP_METERS = 15
const POWER_UP_MAX_GAP_METERS = 150

let nextPowerUpId = 1

function getRandomPowerUp(powerUps: PowerUp[]): PowerUp | null {
    const spawnablePowerUps = powerUps.filter((powerUp) => powerUp.spawnWeight > 0)
    if (spawnablePowerUps.length === 0) return null

    const totalWeight = spawnablePowerUps.reduce(
        (sum, powerUp) => sum + powerUp.spawnWeight,
        0
    )

    let random = Math.random() * totalWeight

    for (const powerUp of spawnablePowerUps) {
        random -= powerUp.spawnWeight

        if (random < 0) return powerUp
    }

    return spawnablePowerUps[spawnablePowerUps.length - 1]
}

const powerUpImages = new Map<number, HTMLImageElement>()

export function loadPowerUpImages(powerUps: PowerUp[]) {
    for (const powerUp of powerUps) {
        if (!powerUp.imageUrl || powerUpImages.has(powerUp.id)) continue

        const image = new Image()

        image.onerror = () => {
            powerUpImages.delete(powerUp.id)
        }

        image.src = powerUp.imageUrl
        powerUpImages.set(powerUp.id, image)
    }
}

export function getPowerUpImage(powerUpId: number) {
    return powerUpImages.get(powerUpId)
}

export function spawnPowerUp(state: GameState) {
    const powerUp = getRandomPowerUp(state.availablePowerUps)
    if (!powerUp) return

    const side = getSpawnSide(state)

    state.world.powerUps.push({
        id: nextPowerUpId++,
        powerUp,
        position: {
            x: getSpawnX('lane', side, powerUp.width),
            y: getSpawnY(powerUp),
        }
    })
}

export function respawnPowerUp(state: GameState, spawnedPowerUp: SpawnedPowerUp) {
    const powerUp = getRandomPowerUp(state.availablePowerUps)
    if (!powerUp) return

    const side = getSpawnSide(state)

    spawnedPowerUp.powerUp = powerUp
    spawnedPowerUp.position.x = getSpawnX('lane', side, powerUp.width)
    spawnedPowerUp.position.y = getSpawnY(powerUp)
}

export function applyPowerUpEffects(state: GameState, powerUp: PowerUp) {
    state.powerUpNotification.name = powerUp.name
    state.powerUpNotification.startedAt = state.world.elapsedTime

    if (powerUp.speedMultiplier !== 1 && powerUp.durationSeconds > 0) {
        state.powerUpEffects.speedMultiplier = powerUp.speedMultiplier
        state.powerUpEffects.speedExpiresAt =
            state.world.elapsedTime + powerUp.durationSeconds
        state.powerUpEffects.speedName = powerUp.name
    }

    if (powerUp.scoreMultiplier !== 1 && powerUp.durationSeconds > 0) {
        state.powerUpEffects.scoreMultiplier = powerUp.scoreMultiplier
        state.powerUpEffects.scoreExpiresAt =
            state.world.elapsedTime + powerUp.durationSeconds
        state.powerUpEffects.scoreName = powerUp.name
    }
}

export function updatePowerUpEffects(state: GameState) {
    const { powerUpEffects } = state

    if (
        powerUpEffects.speedMultiplier !== 1 &&
        state.world.elapsedTime >= powerUpEffects.speedExpiresAt
    ) {
        powerUpEffects.speedMultiplier = 1
        powerUpEffects.speedExpiresAt = 0
        powerUpEffects.speedName = null
    }

    if (
        powerUpEffects.scoreMultiplier !== 1 &&
        state.world.elapsedTime >= powerUpEffects.scoreExpiresAt
    ) {
        powerUpEffects.scoreMultiplier = 1
        powerUpEffects.scoreExpiresAt = 0
        powerUpEffects.scoreName = null
    }
}

function getSpawnY(powerUp: PowerUp) {
    return -powerUp.height / 2 - getPowerUpGap()
}

function getPowerUpGap() {
    const gapMeters =
        POWER_UP_MIN_GAP_METERS +
        Math.random() * (POWER_UP_MAX_GAP_METERS - POWER_UP_MIN_GAP_METERS)

    return gapMeters * WORLD_UNITS_PER_METER
}