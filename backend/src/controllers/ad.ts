/**
 * Ad controller
 */

import * as service from '../services/ad'
import { validateField, validateId } from '../utils/validation'

import type { Request, Response } from 'express'
import type { Ad, CreateAdBody, UpdateAdBody, AdPlacement } from '../types/ad'
import type { ApiError } from '../types/errors'
import { put } from '@vercel/blob'

export const getAds = async (
    req: Request<{}, {}, {}, { placement?: string }>,
    res: Response<Ad[] | ApiError>
) => {
    const { placement } = req.query

    let adPlacement: AdPlacement | undefined

    if (placement !== undefined) {
        if (placement !== 'pre_game' && placement !== 'display') {
            res.status(400).json({
                message: 'Felaktig annonsplacering.',
                field: 'placement'
            })
            return
        }

        adPlacement = placement
    }

    const ads = await service.getAds(adPlacement)

    res.status(200).json(ads)
}

export const getAd = async (
    req: Request<{ id: string }>,
    res: Response<Ad | ApiError>
) => {
    const adId = Number(req.params.id)

    const error = validateId('id', adId)
    if (error) {
        res.status(400).json(error)
        return
    }

    const ad = await service.getAd(adId)

    if (!ad) {
        res.status(404).json({
            message: 'Annonsen hittades inte.',
            field: 'id'
        })
        return
    }

    res.status(200).json(ad)
}

export const getAdminAds = async (
    req: Request<{}, {}, {}, { placement?: string }>,
    res: Response<Ad[] | ApiError>
) => {
    const { placement } = req.query

    let adPlacement: AdPlacement | undefined

    if (placement !== undefined) {
        if (placement !== 'pre_game' && placement !== 'display') {
            res.status(400).json({
                message: 'Felaktig annonsplacering.',
                field: 'placement'
            })
            return
        }

        adPlacement = placement
    }

    const ads = await service.getAds(adPlacement, false)

    res.status(200).json(ads)
}

export const getAdminAd = async (
    req: Request<{ id: string }>,
    res: Response<Ad | ApiError>
) => {
    const adId = Number(req.params.id)

    const error = validateId('id', adId)
    if (error) {
        res.status(400).json(error)
        return
    }

    const ad = await service.getAd(adId, false)

    if (!ad) {
        res.status(404).json({
            message: 'Annonsen hittades inte.',
            field: 'id'
        })
        return
    }

    res.status(200).json(ad)
}

export const createAd = async (
    req: Request<{}, {}, Record<string, string>>,
    res: Response<Ad | ApiError>
) => {
    const {
        media_type,
        target_url,
        duration_seconds,
        placement,
        is_active,
        title,
        weight
    } = req.body

    const durationSeconds =
        duration_seconds !== undefined && duration_seconds !== ''
            ? Number(duration_seconds)
            : null

    const adWeight =
        weight !== undefined && weight !== '' ? Number(weight) : null

    const isActive = is_active === 'true'

    if (!req.file) {
        res.status(400).json({
            message: 'En mediafil måste laddas upp.',
            field: 'media'
        })
        return
    }

    const file = req.file

    const blob = await put(
        `ads/${Date.now()}-${file.originalname}`,
        file.buffer,
        {
            access: 'public'
        }
    )

    const mediaUrl = blob.url

    const mediaTypeError = validateField('media_type', media_type, 'string')
    if (mediaTypeError) {
        res.status(400).json(mediaTypeError)
        return
    }

    if (media_type !== 'image' && media_type !== 'video') {
        res.status(400).json({
            message: 'Felaktig mediatyp.',
            field: 'media_type'
        })
        return
    }

    if (target_url !== undefined && target_url !== null && target_url !== '') {
        const error = validateField('target_url', target_url, 'string')

        if (error) {
            res.status(400).json(error)
            return
        }
    }

    if (durationSeconds !== null) {
        const error = validateField(
            'duration_seconds',
            durationSeconds,
            'number'
        )

        if (error) {
            res.status(400).json(error)
            return
        }

        if (!Number.isInteger(durationSeconds) || durationSeconds <= 0) {
            res.status(400).json({
                message: 'Varaktighet måste vara ett positivt heltal.',
                field: 'duration_seconds'
            })
            return
        }
    }

    const placementError = validateField('placement', placement, 'string')
    if (placementError) {
        res.status(400).json(placementError)
        return
    }

    if (placement !== 'pre_game' && placement !== 'display') {
        res.status(400).json({
            message: 'Felaktig annonsplacering.',
            field: 'placement'
        })
        return
    }

    if (isActive !== undefined) {
        const error = validateField('is_active', isActive, 'boolean')

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

    if (adWeight !== null) {
        const error = validateField('weight', adWeight, 'number')

        if (error) {
            res.status(400).json(error)
            return
        }

        if (!Number.isInteger(adWeight)) {
            res.status(400).json({
                message: 'Vikt måste vara ett heltal.',
                field: 'weight'
            })
            return
        }
    }

    const ad = await service.createAd({
        media_type,
        media_url: mediaUrl,
        target_url: target_url || null,
        duration_seconds: durationSeconds,
        placement,
        is_active: isActive,
        title: title || null,
        weight: adWeight
    })

    res.status(201).json(ad)
}

export const updateAd = async (
    req: Request<{ id: string }, {}, UpdateAdBody>,
    res: Response<Ad | ApiError>
) => {
    const adId = Number(req.params.id)

    const idError = validateId('id', adId)
    if (idError) {
        res.status(400).json(idError)
        return
    }

    const {
        media_type,
        media_url,
        target_url,
        duration_seconds,
        placement,
        is_active,
        title,
        weight
    } = req.body

    if (media_type !== undefined) {
        const error = validateField('media_type', media_type, 'string')

        if (error) {
            res.status(400).json(error)
            return
        }

        if (media_type !== 'image' && media_type !== 'video') {
            res.status(400).json({
                message: 'Felaktig mediatyp.',
                field: 'media_type'
            })
            return
        }
    }

    if (media_url !== undefined) {
        const error = validateField('media_url', media_url, 'string')

        if (error) {
            res.status(400).json(error)
            return
        }
    }

    if (target_url !== undefined && target_url !== null) {
        const error = validateField('target_url', target_url, 'string')

        if (error) {
            res.status(400).json(error)
            return
        }
    }

    if (duration_seconds !== undefined && duration_seconds !== null) {
        const error = validateField(
            'duration_seconds',
            duration_seconds,
            'number'
        )

        if (error) {
            res.status(400).json(error)
            return
        }

        if (!Number.isInteger(duration_seconds) || duration_seconds <= 0) {
            res.status(400).json({
                message: 'Varaktighet måste vara ett positivt heltal.',
                field: 'duration_seconds'
            })
            return
        }
    }

    if (placement !== undefined) {
        const error = validateField('placement', placement, 'string')

        if (error) {
            res.status(400).json(error)
            return
        }

        if (placement !== 'pre_game' && placement !== 'display') {
            res.status(400).json({
                message: 'Felaktig annonsplacering.',
                field: 'placement'
            })
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
            res.status(400).json({
                message: 'Vikt måste vara ett heltal.',
                field: 'weight'
            })
            return
        }
    }

    if (
        media_type === undefined &&
        media_url === undefined &&
        target_url === undefined &&
        duration_seconds === undefined &&
        placement === undefined &&
        is_active === undefined &&
        title === undefined &&
        weight === undefined
    ) {
        res.status(400).json({ message: 'Inga fält att uppdatera.' })
        return
    }

    const ad = await service.updateAd(adId, req.body)

    if (!ad) {
        res.status(404).json({
            message: 'Annonsen hittades inte.',
            field: 'id'
        })
        return
    }

    res.status(200).json(ad)
}

export const deleteAd = async (
    req: Request<{ id: string }>,
    res: Response<Ad | ApiError>
) => {
    const adId = Number(req.params.id)

    const error = validateId('id', adId)
    if (error) {
        res.status(400).json(error)
        return
    }

    const ad = await service.deleteAd(adId)

    if (!ad) {
        res.status(404).json({
            message: 'Annonsen hittades inte.',
            field: 'id'
        })
        return
    }

    res.status(200).json(ad)
}
