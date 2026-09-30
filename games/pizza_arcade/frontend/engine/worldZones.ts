import {
    GAME_BOUNDS,
    SIDEWALK_WIDTH,
    SIDEWALK_EDGE_WIDTH,
    PARKED_ZONE_WIDTH,
    CENTER_LINE_CLEARANCE,
    ROAD_CENTER_X
} from './gameState'

export type SpawnZone =
    | 'grass'
    | 'sidewalkEdge'
    | 'sidewalk'
    | 'parked'
    | 'lane'

export type WorldSide = 'left' | 'right'

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
        maxX: ROAD_CENTER_X - CENTER_LINE_CLEARANCE
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