/**
 * Ad controller
 */

import type { Request, Response } from 'express'

interface Ad {
    id: number
    type: 'video' | 'banner'
    url: string
    is_active: boolean
}

type CreateAdBody = Omit<Ad, 'id' | 'is_active'> & {
    is_active?: boolean
}

type UpdateAdBody = Partial<CreateAdBody>

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

export const getAds = (_req: Request, res: Response<Ad[]>) => {
        const ads = MOCK_ADS // TODO: Replace with actual database call

        res.status(200).json(ads)
}

export const getAd = (req: Request<{ id: string }>, res: Response<Ad | { message: string }>) => {
    const { id } = req.params

    const ad = MOCK_ADS.find((ad) => ad.id === Number(id)) // TODO: Replace with actual database call

    if (!ad) {
        res.status(404).json({ message: 'Ad not found' })
        return
    }

    res.status(200).json(ad)
}

export const createAd = (req: Request<{}, {}, CreateAdBody>, res: Response) => {
    const { type, url, is_active } = req.body ?? {}

    if (typeof type !== 'string' || !type.trim() || typeof url !== 'string' || !url.trim()) {
        res.status(400).json({ message: 'Type and URL are required' })
        return
    }

    if (type !== 'video' && type !== 'banner') {
        res.status(400).json({ message: 'Invalid ad type' })
        return
    }

    if (is_active !== undefined && typeof is_active !== 'boolean') {
        res.status(400).json({ message: 'is_active must be a boolean' })
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

export const updateAd = (req: Request<{ id: string }, {}, UpdateAdBody>, res: Response<Ad | { message: string }>) => {
    const { id } = req.params
    const { type, url, is_active } = req.body ?? {}

    // ONTODO: Validate input data (type, url, is_active) before updating

    const adIndex = MOCK_ADS.findIndex((ad) => ad.id === Number(id)) // TODO: Replace with actual database call

    if (adIndex === -1 || !MOCK_ADS[adIndex]) {
        res.status(404).json({ message: 'Ad not found' })
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

export const deleteAd = (req: Request<{ id: string }>, res: Response<Ad | { message: string }>) => {
    const { id } = req.params

    const adIndex = MOCK_ADS.findIndex((ad) => ad.id === Number(id)) // TODO: Replace with actual database call

    if (adIndex === -1 || !MOCK_ADS[adIndex]) {
        res.status(404).json({ message: 'Ad not found' })
        return
    }

    MOCK_ADS[adIndex].is_active = false

    res.status(204).send()
}
