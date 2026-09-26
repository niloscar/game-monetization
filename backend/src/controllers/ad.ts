/**
 * Ad controller
 */

import * as service from '../services/ad'
import { validateField, validateId } from '../utils/validation'

import type { Request, Response } from 'express'
import type { Ad, CreateAdBody, UpdateAdBody } from '../types/ad'
import type { ApiError } from '../types/errors'

export const getAds = async (_req: Request, res: Response<Ad[]>) => {
    const ads = await service.getAds()

    res.status(200).json(ads)
}

export const getAd = async (req: Request<{ id: string }>, res: Response<Ad | ApiError>) => {
    const adId = Number(req.params.id)

    const error = validateId('id', adId)
    if (error) {
        res.status(400).json(error)
        return
    }

    const ad = await service.getAd(adId)

    if (!ad) {
        res.status(404).json({ message: 'Annonsen hittades inte.', field: 'id' })
        return
    }

    res.status(200).json(ad)
}

export const createAd = async (req: Request<{}, {}, CreateAdBody>, res: Response<Ad | ApiError>) => {
    const { type, url, is_active, title, weight } = req.body

    const typeError = validateField('type', type, 'string')
    if (typeError) {
        res.status(400).json(typeError)
        return
    }

    if (type !== 'video' && type !== 'banner') {
        res.status(400).json({ message: 'Felaktig annonstyp.', field: 'type' })
        return
    }

    const urlError = validateField('url', url, 'string')
    if (urlError) {
        res.status(400).json(urlError)
        return
    }

    if (is_active !== undefined) {
        const error = validateField('is_active', is_active, 'boolean')

        if (error) {
            res.status(400).json(error)
            return
        }
    }

    if (title !== undefined && title !== null) {
        const error = validateField('title', title, 'string')

        if (error) {
            res.status(400).json(error)
            return
        }
    }

    if (weight !== undefined && weight !== null) {
        const error = validateField('weight', weight, 'number')

        if (error) {
            res.status(400).json(error)
            return
        }

        if (!Number.isInteger(weight)) {
            res.status(400).json({ message: 'Vikt måste vara ett heltal.', field: 'weight' })
            return
        }
    }

    const ad = await service.createAd(req.body)

    res.status(201).json(ad)
}

export const updateAd = async (req: Request<{ id: string }, {}, UpdateAdBody>, res: Response<Ad | ApiError>) => {
    const adId = Number(req.params.id)

    const idError = validateId('id', adId)
    if (idError) {
        res.status(400).json(idError)
        return
    }

    const { type, url, is_active, title, weight } = req.body

    if (type !== undefined) {
        const error = validateField('type', type, 'string')

        if (error) {
            res.status(400).json(error)
            return
        }

        if (type !== 'video' && type !== 'banner') {
            res.status(400).json({ message: 'Felaktig annonstyp.', field: 'type' })
            return
        }
    }

    if (url !== undefined) {
        const error = validateField('url', url, 'string')

        if (error) {
            res.status(400).json(error)
            return
        }
    }

    if (is_active !== undefined) {
        const error = validateField('is_active', is_active, 'boolean')

        if (error) {
            res.status(400).json(error)
            return
        }
    }

    if (title !== undefined && title !== null) {
        const error = validateField('title', title, 'string')

        if (error) {
            res.status(400).json(error)
            return
        }
    }

    if (weight !== undefined && weight !== null) {
        const error = validateField('weight', weight, 'number')

        if (error) {
            res.status(400).json(error)
            return
        }

        if (!Number.isInteger(weight)) {
            res.status(400).json({ message: 'Vikt måste vara ett heltal.', field: 'weight' })
            return
        }
    }

    if (type === undefined && url === undefined && is_active === undefined && title === undefined && weight === undefined) {
        res.status(400).json({ message: 'Inga fält att uppdatera.' })
        return
    }

    const ad = await service.updateAd(adId, req.body)

    if (!ad) {
        res.status(404).json({ message: 'Annonsen hittades inte.', field: 'id' })
        return
    }

    res.status(200).json(ad)
}

export const deleteAd = async (req: Request<{ id: string }>, res: Response<Ad | ApiError>) => {
    const adId = Number(req.params.id)

    const error = validateId('id', adId)
    if (error) {
        res.status(400).json(error)
        return
    }

    const ad = await service.deleteAd(adId)

    if (!ad) {
        res.status(404).json({ message: 'Annonsen hittades inte.', field: 'id' })
        return
    }

    res.status(200).json(ad)
}