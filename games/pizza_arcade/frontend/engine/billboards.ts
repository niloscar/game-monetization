import type { GameState } from '../types/game'

export function updateBillboards(
    state: GameState,
    respawnedBillboardIds: number[],
    adCount: number
) {
    if (adCount === 0) return

    for (const billboardId of respawnedBillboardIds) {
        const billboard = state.world.billboards.find(
            (billboard) => billboard.id === billboardId
        )
        if (!billboard) continue

        billboard.adIndex = getNextAdIndex(billboard.adIndex, adCount)
    }
}

function getNextAdIndex(currentIndex: number, adCount: number) {
    if (adCount <= 1) return 0

    let nextIndex = currentIndex

    while (nextIndex === currentIndex) {
        nextIndex = Math.floor(Math.random() * adCount)
    }

    return nextIndex
}