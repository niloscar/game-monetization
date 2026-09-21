/**
 * Ad controller
 */

import type { Request, Response } from 'express'
import type { Ad, CreateAdBody, UpdateAdBody } from '../types/ad'
import * as service from '../services/ad'

export const getAds = async (_req: Request, res: Response<Ad[]>) => {
        const ads = await service.getAds()

        res.status(200).json(ads)
}

export const getAd = async (req: Request<{ id: string }>, res: Response<Ad | { message: string, field: string }>) => {
    const { id } = req.params
    const adId = Number(id)

    if (!Number.isSafeInteger(adId) || adId <= 0) {
        res.status(400).json({ message: 'Felaktigt annons-ID.', field: 'id' })
        return
    }

    const ad = await service.getAd(adId)

    if (ad === null) {
        res.status(404).json({ message: 'Annonsen hittades inte.', field: 'id' })
        return
    }

    res.status(200).json(ad)
}

export const createAd = (req: Request<{}, {}, CreateAdBody>, res: Response<{} | { message: string, field: string }>) => {
    const { type, url, is_active } = req.body ?? {}

    if (typeof type !== 'string' || !type.trim()) {
        res.status(400).json({ message: 'Typ och url krävs.', field: 'type' })
        return
    }

    if (typeof url !== 'string' || !url.trim()) {
        res.status(400).json({ message: 'Typ och url krävs.', field: 'url' })
        return
    }

    if (type !== 'video' && type !== 'banner') {
        res.status(400).json({ message: 'Felaktig annonstyp.', field: 'type' })
        return
    }

    if (is_active !== undefined && typeof is_active !== 'boolean') {
        res.status(400).json({ message: 'is_active måste vara en boolean', field: 'is_active' })
        return
    }

    const nextId = MOCK_ADS.length > 0
            ? Math.max(...MOCK_ADS.map((ad) => ad.id)) + 1
            : 1

    const newAd = {
        id: nextId, // ONTODO: Remove this and use database-generated ID
        type,
        url,
        is_active: is_active ?? true
    }

    MOCK_ADS.push(newAd)

    res.status(201).json(newAd)
}

export const updateAd = (req: Request<{ id: string }, {}, UpdateAdBody>, res: Response<Ad | { message: string, field: string }>) => {
    const { id } = req.params
    const { type, url, is_active } = req.body ?? {}

    // ONTODO: Validate input data (type, url, is_active) before updating

    const adIndex = MOCK_ADS.findIndex((ad) => ad.id === Number(id)) // TODO: Replace with actual database call

    if (adIndex === -1 || !MOCK_ADS[adIndex]) {
        res.status(404).json({ message: 'Ad not found', field: 'id' })
        return
    }

    const updatedAd = {
        ...MOCK_ADS[adIndex],
        type: type ?? MOCK_ADS[adIndex].type,
        url: url ?? MOCK_ADS[adIndex].url,
        is_active: is_active ?? MOCK_ADS[adIndex].is_active
    }

    MOCK_ADS[adIndex] = updatedAd

    res.status(200).json(updatedAd)
}

export const deleteAd = (req: Request<{ id: string }>, res: Response<Ad | { message: string, field: string }>) => {
    const { id } = req.params

    const adIndex = MOCK_ADS.findIndex((ad) => ad.id === Number(id)) // TODO: Replace with actual database call

    if (adIndex === -1 || !MOCK_ADS[adIndex]) {
        res.status(404).json({ message: 'Ad not found', field: 'id' })
        return
    }

    MOCK_ADS[adIndex].is_active = false

    res.status(204).send()
}


const MOCK_ADS: Ad[] = [
    {
        id: 1,
        type: 'video',
        url: 'https://www.youtube.com/watch?v=dQw4w9WgXcQ',
        is_active: true
    },
    {
        id: 2,
        type: 'banner',
        url: 'https://example.com/banner-ad.jpg',
        is_active: true
    }
]