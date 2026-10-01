import { GAME_BOUNDS, SIDEWALK_WIDTH, SIDEWALK_EDGE_WIDTH, PARKED_ZONE_WIDTH, CENTER_LINE_OVERLAP, ROAD_CENTER_X } from './gameState'
import type { GameState, SpawnZone, WorldSide } from '../types/game'

interface ZoneBounds {
    minX: number
    maxX: number
}

const LEFT_ZONE_BOUNDS: Record<SpawnZone, ZoneBounds> = {
    grass: {
        minX: 0,
        maxX: GAME_BOUNDS.left - SIDEWALK_WIDTH
    },
    sidewalkEdge: {
        minX: GAME_BOUNDS.left - SIDEWALK_WIDTH,
        maxX: GAME_BOUNDS.left - SIDEWALK_WIDTH + SIDEWALK_EDGE_WIDTH
    },
    sidewalk: {
        minX: GAME_BOUNDS.left - SIDEWALK_WIDTH + SIDEWALK_EDGE_WIDTH,
        maxX: GAME_BOUNDS.left
    },
    parked: {
        minX: GAME_BOUNDS.left,
        maxX: GAME_BOUNDS.left + PARKED_ZONE_WIDTH
    },
    lane: {
        minX: GAME_BOUNDS.left + PARKED_ZONE_WIDTH,
        maxX: ROAD_CENTER_X + CENTER_LINE_OVERLAP
    }
}

export function getZoneBounds(zone: SpawnZone, side: WorldSide): ZoneBounds {
    const bounds = LEFT_ZONE_BOUNDS[zone]

    if (side === 'left') return bounds

    return {
        minX: ROAD_CENTER_X * 2 - bounds.maxX,
        maxX: ROAD_CENTER_X * 2 - bounds.minX
    }
}

export function getSpawnX(zone: SpawnZone, side: WorldSide, width: number) {
    const { minX, maxX } = getZoneBounds(zone, side)
    const halfWidth = width / 2
    const min = minX + halfWidth
    const max = maxX - halfWidth

    if (min > max) {
        throw new Error(`Object width ${width} does not fit in ${side} ${zone} zone`)
    }

    return Math.random() * (max - min) + min
}

export function getSpawnSide(state: GameState): WorldSide {
    const { lastSide, sameSideCount } = state.world.spawn

    if (!lastSide) {
        const side = Math.random() < 0.5 ? 'left' : 'right'
        state.world.spawn.lastSide = side
        state.world.spawn.sameSideCount = 1
        return side
    }

    const oppositeSide = lastSide === 'left' ? 'right' : 'left'

    const side =
        sameSideCount >= 3 || Math.random() < 0.65
            ? oppositeSide
            : lastSide

    state.world.spawn.lastSide = side
    state.world.spawn.sameSideCount = side === lastSide ? sameSideCount + 1 : 1

    return side
}