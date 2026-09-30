import heartUrl from '../assets/hud/heart.svg'
// import skateboardUrl from '../assets/player/skateboard.svg'
// import parkedCarUrl from '../assets/obstacles/parked-car.svg'
// import trashCanUrl from '../assets/obstacles/trash-can.svg'

export const ASSET_URLS = {
    heart: heartUrl,
    // skateboard: skateboardUrl,
    // parkedCar: parkedCarUrl,
    // trashCan: trashCanUrl
} as const

export type AssetName = keyof typeof ASSET_URLS
export type GameAssets = Record<AssetName, HTMLImageElement>

export async function loadGameAssets(): Promise<GameAssets> {
    const entries = await Promise.all(
        Object.entries(ASSET_URLS).map(async ([name, url]) => {
            const image = new Image()
            image.src = url

            await image.decode()

            return [name, image] as const
        })
    )

    return Object.fromEntries(entries) as GameAssets
}