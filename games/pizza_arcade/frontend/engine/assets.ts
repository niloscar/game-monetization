import heartUrl from '../assets/hud/heart.svg'
import catsUrl from '../assets/animals/cats_sheet.png'
import dogsUrl from '../assets/animals/dogs_sheet.png'
import ratsUrl from '../assets/animals/rats_sheet.png'
import houseUrl from '../assets/buildings/house_sheet.png'
import pizzaHouseUrl from '../assets/buildings/pizzahouse_sheet.png'
import concerteBarrierUrl from '../assets/obstacles/concretebarrier.png'
import dogPooUrl from '../assets/obstacles/dogpoo_sheet.png'
import tireFireUrl from '../assets/obstacles/tirefire_sheet.png'
import tiresUrl from '../assets/obstacles/tires.png'
import kidsUrl from '../assets/people/kid_sheet.png'
import pedestriansUrl from '../assets/people/pedestrian_sheet.png'
import cyclistUrl from '../assets/people/cyclist_sheet.png'
import pizzaUrl from '../assets/pizza/pizza.png'
import pizzaBoxUrl from '../assets/pizza/pizzabox.png'
import pizzaBoxOpenUrl from '../assets/pizza/pizzabox_open.png'
import playerUrl from '../assets/player/player.png'
import skateboardUrl from '../assets/player/skateboard.png'
import bicycleUrl from '../assets/player/bicycle.png'
import motorcycleUrl from '../assets/player/motorcycle.png'
import sodaSmallUrl from '../assets/powerups/soda_small.png'
import sodaMediumUrl from '../assets/powerups/soda_medium.png'
import sodaLargeUrl from '../assets/powerups/soda_large.png'
import adSignUrl from '../assets/roadside/adsign.png'
import containerUrl from '../assets/roadside/container.png'
import grassUrl from '../assets/roadside/grass_sheet.png'
import mailboxUrl from '../assets/roadside/mailbox_sheet.png'
import trashcanUrl from '../assets/roadside/trashcan.png'
import lamppostUrl from '../assets/street/lamppost.png'
import manholeUrl from '../assets/street/manhole.png'
import pedestrianCrossingUrl from '../assets/street/pedestrian_crossing.png'
import sidewalkDrivewayUrl from '../assets/street/sidewalk_driveway.png'
import sidewalkUrl from '../assets/street/sidewalk.png'
import carsUrl from '../assets/vehicles/cars_sheet.png'
import concreteTruckUrl from '../assets/vehicles/concrete_truck.png'
import schoolbusUrl from '../assets/vehicles/schoolbus.png'

export const ASSET_URLS = {
    heart: heartUrl,
    cats: catsUrl,
    dogs: dogsUrl,
    rats: ratsUrl,
    house: houseUrl,
    pizzaHouse: pizzaHouseUrl,
    concerteBarrier: concerteBarrierUrl,
    tireFire: tireFireUrl,
    dogPoo: dogPooUrl,
    tires: tiresUrl,
    kids: kidsUrl,
    pedestrians: pedestriansUrl,
    cyclist: cyclistUrl,
    pizza: pizzaUrl,
    pizzaBox: pizzaBoxUrl,
    pizzaBoxOpen: pizzaBoxOpenUrl,
    player: playerUrl,
    skateboard: skateboardUrl,
    bicycle: bicycleUrl,
    motorcycle: motorcycleUrl,
    sodaSmall: sodaSmallUrl,
    sodaMedium: sodaMediumUrl,
    sodaLarge: sodaLargeUrl,
    adSign: adSignUrl,
    container: containerUrl,
    grass: grassUrl,
    mailbox: mailboxUrl,
    trashcan: trashcanUrl,
    lamppost: lamppostUrl,
    manhole: manholeUrl,
    pedestrianCrossing: pedestrianCrossingUrl,
    sidewalkDriveway: sidewalkDrivewayUrl,
    sidewalk: sidewalkUrl,
    cars: carsUrl,
    concreteTruck: concreteTruckUrl,
    schoolbus: schoolbusUrl,
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