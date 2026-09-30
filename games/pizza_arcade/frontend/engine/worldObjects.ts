import type { GameState, WorldObject, WorldObjectType } from '../types/game'
import { GAME_BOUNDS } from './gameState'

export const WORLD_OBJECT_DAMAGE: Record<WorldObjectType, number> = {
    rat: 2,
    cat: 5,
    dog: 8,
    trashCan: 10,
    mailBox: 10,
    pedestrian: 20,
    cyclist: 25,
    lightPole: 30,
    streetSign: 30,
    car: 40,
    concreteBarrier: 40,
    container: 60,
    schoolBus: 60,
    concreteTruck: 80,
    manhole: 100
}

const OBJECT_GAP = 150

export function respawnWorldObject(state: GameState, object: WorldObject) {
    const objectsAhead = state.world.objects.filter(
        (worldObject) => worldObject.id !== object.id
    )

    const frontObject = objectsAhead.reduce((front, current) =>
        current.position.y < front.position.y ? current : front
    )

    object.position.y =
        frontObject.position.y -
        frontObject.height / 2 -
        OBJECT_GAP -
        object.height / 2

    object.position.x = getObjectX(object)
}

function getObjectX(object: WorldObject) {
    switch (object.type) {
        case 'car':
            return getRandomXParked(object.width)

        default:
            return getRandomXRoad(object.width)
    }
}

function getRandomXParked(width: number) {
    const margin = 10
    const leftX = GAME_BOUNDS.left + width / 2 + margin
    const rightX = GAME_BOUNDS.right - width / 2 - margin

    return Math.random() < 0.5 ? leftX : rightX
}

function getRandomXRoad(width: number) {
    const minX = GAME_BOUNDS.left + width / 2
    const maxX = GAME_BOUNDS.right - width / 2

    return Math.random() * (maxX - minX) + minX
}

function getRandomXSidewalk(width: number) {
    const minX = GAME_BOUNDS.left + width / 2
    const maxX = GAME_BOUNDS.right - width / 2

    return Math.random() * (maxX - minX) + minX
}