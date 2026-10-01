import { getSpawnX } from './worldZones'
import type { AssetName } from './assets'
import type {
    GameState,
    WorldObject,
    WorldObjectType,
    WorldSide
} from '../types/game'
import type { SpawnZone } from './../types/game'

const INITIAL_MIN_GAP = 140
const INITIAL_MAX_GAP = 240
const FINAL_MIN_GAP = 20
const FINAL_MAX_GAP = 60

const INITIAL_OBJECT_COUNT = 3
const FINAL_OBJECT_COUNT = 100

const DIFFICULTY_RAMP_DURATION = 300

interface SpawnRule {
    zone: SpawnZone
    weight: number
}

interface WorldObjectConfig {
    width: number
    height: number
    healthDelta: number
    spawnWeight: number
    sprite?: AssetName
    spawnRules: SpawnRule[]
}

const WORLD_OBJECT_CONFIG: Record<WorldObjectType, WorldObjectConfig> = {
    soda: {
        width: 5,
        height: 10,
        healthDelta: 5,
        spawnWeight: 1,
        spawnRules: [
            { zone: 'sidewalk', weight: 5 },
            { zone: 'parked', weight: 5 },
            { zone: 'lane', weight: 5 }
        ]
    },
    pizza: {
        width: 20,
        height: 20,
        healthDelta: 10,
        spawnWeight: 1,
        spawnRules: [
            { zone: 'sidewalk', weight: 5 },
            { zone: 'parked', weight: 5 },
            { zone: 'lane', weight: 5 }
        ]
    },
    rat: {
        width: 20,
        height: 10,
        healthDelta: -2,
        spawnWeight: 1,
        spawnRules: [
            { zone: 'sidewalk', weight: 4 },
            { zone: 'parked', weight: 4 },
            { zone: 'lane', weight: 4 }
        ]
    },
    cat: {
        width: 30,
        height: 20,
        healthDelta: -5,
        spawnWeight: 1,
        spawnRules: [
            { zone: 'sidewalk', weight: 5 },
            { zone: 'parked', weight: 3 },
            { zone: 'lane', weight: 2 }
        ]
    },
    dog: {
        width: 40,
        height: 20,
        healthDelta: -8,
        spawnWeight: 1,
        spawnRules: [
            { zone: 'sidewalk', weight: 5 },
            { zone: 'parked', weight: 2 },
            { zone: 'lane', weight: 1 }
        ]
    },
    trashCan: {
        healthDelta: -10,
        width: 30,
        height: 30,
        spawnWeight: 2,
        spawnRules: [
            { zone: 'sidewalkEdge', weight: 5 },
            { zone: 'sidewalk', weight: 2 },
            { zone: 'parked', weight: 1 },
            { zone: 'lane', weight: 1 }
        ]
    },
    mailBox: {
        healthDelta: -10,
        width: 30,
        height: 15,
        spawnWeight: 2,
        spawnRules: [
            { zone: 'sidewalkEdge', weight: 1 }
        ]
    },
    pedestrian: {
        healthDelta: -20,
        width: 40,
        height: 30,
        spawnWeight: 4,
        spawnRules: [
            { zone: 'sidewalk', weight: 5 },
            { zone: 'parked', weight: 2 },
            { zone: 'lane', weight: 1 }
        ]
    },
    cyclist: {
        healthDelta: -25,
        width: 35,
        height: 80,
        spawnWeight: 3,
        spawnRules: [
            { zone: 'sidewalk', weight: 2 },
            { zone: 'parked', weight: 2 },
            { zone: 'lane', weight: 5 }
        ]
    },
    lightPole: {
        healthDelta: -30,
        width: 20,
        height: 20,
        spawnWeight: 2,
        spawnRules: [
            { zone: 'sidewalkEdge', weight: 1 }
        ]
    },
    streetSign: {
        healthDelta: -30,
        width: 30,
        height: 10,
        spawnWeight: 2,
        spawnRules: [
            { zone: 'sidewalkEdge', weight: 1 }
        ]
    },
    car: {
        healthDelta: -40,
        width: 80,
        height: 160,
        spawnWeight: 5,
        spawnRules: [
            { zone: 'parked', weight: 4 },
            { zone: 'lane', weight: 1 }
        ]
    },
    concreteBarrier: {
        healthDelta: -40,
        width: 60,
        height: 30,
        spawnWeight: 1,
        spawnRules: [
            { zone: 'parked', weight: 1 },
            { zone: 'lane', weight: 3 }
        ]
    },
    container: {
        healthDelta: -60,
        width: 60,
        height: 120,
        spawnWeight: 1,
        spawnRules: [
            { zone: 'parked', weight: 3 },
            { zone: 'lane', weight: 1 }
        ]
    },
    schoolBus: {
        healthDelta: -60,
        width: 100,
        height: 300,
        spawnWeight: 1,
        spawnRules: [
            { zone: 'parked', weight: 2 },
            { zone: 'lane', weight: 3 }
        ]
    },
    concreteTruck: {
        healthDelta: -80,
        width: 120,
        height: 200,
        spawnWeight: 1,
        spawnRules: [
            { zone: 'lane', weight: 4 }
        ]
    },
    manhole: {
        healthDelta: -100,
        width: 30,
        height: 30,
        spawnWeight: 1,
        spawnRules: [
            { zone: 'lane', weight: 1 }
        ]
    },
    dogPoo: {
        width: 5,
        height: 5,
        healthDelta: -5,
        scoreDelta: -50,
        spawnWeight: 3,
        spawnRules: [
            { zone: 'sidewalkEdge', weight: 5 },
            { zone: 'sidewalk', weight: 5 },
            { zone: 'parked', weight: 2 },
            { zone: 'lane', weight: 1 }
        ]
    },
    tireFire: {
        width: 20,
        height: 20,
        healthDelta: -20,
        scoreDelta: -100,
        spawnWeight: 2,
        spawnRules: [
            { zone: 'sidewalkEdge', weight: 3 },
            { zone: 'sidewalk', weight: 3 },
            { zone: 'parked', weight: 1 },
            { zone: 'lane', weight: 1 }
        ]
    },
    tires: {
        width: 30,
        height: 30,
        healthDelta: -15,
        scoreDelta: -80,
        spawnWeight: 1,
        spawnRules: [
            { zone: 'sidewalkEdge', weight: 2 },
            { zone: 'sidewalk', weight: 2 },
            { zone: 'parked', weight: 1 },
            { zone: 'lane', weight: 1 }
        ]
    },
}

export function createWorldObjects(): WorldObject[] {
    return Array.from(
        { length: INITIAL_OBJECT_COUNT },
        (_, index) => createWorldObject(index + 1)
    )
}

export function getWorldObjectHealthDelta(type: WorldObjectType) {
    return WORLD_OBJECT_CONFIG[type].healthDelta
}

function getSpawnZone(type: WorldObjectType): SpawnZone {
    const rules = WORLD_OBJECT_CONFIG[type].spawnRules
    const totalWeight = rules.reduce((sum, rule) => sum + rule.weight, 0)
    let random = Math.random() * totalWeight

    for (const rule of rules) {
        random -= rule.weight
        if (random < 0) return rule.zone
    }

    return rules[rules.length - 1].zone
}

function getSpawnSide(state: GameState): WorldSide {
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

function setObjectSpawnPosition(state: GameState, object: WorldObject) {
    const zone = getSpawnZone(object.type)
    const side = getSpawnSide(state)

    object.spawnZone = zone
    object.spawnSide = side
    object.position.x = getSpawnX(zone, side, object.width)
}

export function spawnInitialWorldObjects(state: GameState) {
    for (const object of state.world.objects) {
        placeWorldObject(state, object)
    }
}

export function respawnWorldObject(state: GameState, object: WorldObject) {
    randomizeWorldObject(object)
    placeWorldObject(state, object)
}

export function getWorldObjectSprite(type: WorldObjectType) {
    return WORLD_OBJECT_CONFIG[type].sprite
}

function getObjectGap(state: GameState) {
    const progress = getDifficultyProgress(state)

    const minGap =
        INITIAL_MIN_GAP +
        (FINAL_MIN_GAP - INITIAL_MIN_GAP) * progress

    const maxGap =
        INITIAL_MAX_GAP +
        (FINAL_MAX_GAP - INITIAL_MAX_GAP) * progress

    return minGap + Math.random() * (maxGap - minGap)
}

function getRandomWorldObjectType(): WorldObjectType {
    const entries = Object.entries(WORLD_OBJECT_CONFIG) as [
        WorldObjectType,
        WorldObjectConfig
    ][]

    const totalWeight = entries.reduce(
        (sum, [, config]) => sum + config.spawnWeight,
        0
    )

    let random = Math.random() * totalWeight

    for (const [type, config] of entries) {
        random -= config.spawnWeight

        if (random < 0) return type
    }

    return entries[entries.length - 1][0]
}

function randomizeWorldObject(object: WorldObject) {
    const type = getRandomWorldObjectType()
    const config = WORLD_OBJECT_CONFIG[type]

    object.type = type
    object.width = config.width
    object.height = config.height
}

function getTargetObjectCount(state: GameState) {
    const progress = getDifficultyProgress(state)

    return Math.round(
        INITIAL_OBJECT_COUNT +
        (FINAL_OBJECT_COUNT - INITIAL_OBJECT_COUNT) * progress
    )
}

function placeWorldObject(state: GameState, object: WorldObject) {
    setObjectSpawnPosition(state, object)

    const objectsInSameZone = state.world.objects.filter(
        (worldObject) =>
            worldObject.id !== object.id &&
            worldObject.spawnZone === object.spawnZone &&
            worldObject.spawnSide === object.spawnSide
    )

    const objectTops = objectsInSameZone.map(
        (worldObject) =>
            worldObject.position.y - worldObject.height / 2
    )

    const frontEdge = Math.min(0, ...objectTops)

    object.position.y =
        frontEdge - getObjectGap(state) - object.height / 2
}

function createWorldObject(id: number): WorldObject {
    const type = getRandomWorldObjectType()
    const config = WORLD_OBJECT_CONFIG[type]

    return {
        id,
        type,
        position: {
            x: 0,
            y: 0
        },
        width: config.width,
        height: config.height
    }
}

export function updateWorldObjectCount(state: GameState) {
    const targetCount = getTargetObjectCount(state)

    while (state.world.objects.length < targetCount) {
        const nextId =
            Math.max(0, ...state.world.objects.map((object) => object.id)) + 1

        const object = createWorldObject(nextId)

        state.world.objects.push(object)
        placeWorldObject(state, object)
    }
}

function getDifficultyProgress(state: GameState) {
    return Math.min(state.world.elapsedTime / DIFFICULTY_RAMP_DURATION, 1)
}