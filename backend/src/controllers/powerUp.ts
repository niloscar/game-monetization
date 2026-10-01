/**
 * Power-up controller
 */

import * as service from '../services/powerUp'
import { validateField, validateId } from '../utils/validation'
import type { Request, Response } from 'express'
import type { ApiError } from '../types/errors'
import type { CreatePowerUpBody, PowerUp, UpdatePowerUpBody } from '../types/powerUp'

export const getPowerUps = async (
    _req: Request,
    res: Response<PowerUp[]>
) => {
    const powerUps = await service.getPowerUps()

    res.status(200).json(powerUps)
}

export const getPowerUp = async (
    req: Request<{ id: string }>,
    res: Response<PowerUp | ApiError>
) => {
    const id = Number(req.params.id)

    const error = validateId('id', id)
    if (error) {
        res.status(400).json(error)
        return
    }

    const powerUp = await service.getPowerUp(id)

    if (!powerUp) {
        res.status(404).json({
            message: 'Power-up hittades inte.',
            field: 'id'
        })
        return
    }

    res.status(200).json(powerUp)
}

export const createPowerUp = async (
    req: Request<{}, {}, CreatePowerUpBody>,
    res: Response<PowerUp | ApiError>
) => {
    const {
        key,
        name,
        description,
        imageUrl,
        isActive,
        width,
        height,
        healthDelta,
        scoreDelta,
        speedMultiplier,
        scoreMultiplier,
        durationSeconds,
        spawnWeight
    } = req.body ?? {}

    const keyError = validateField('key', key, 'string')
    if (keyError) {
        res.status(400).json(keyError)
        return
    }

    if (!/^[a-z0-9_]+$/.test(key)) {
        res.status(400).json({
            message: 'Key får endast innehålla små bokstäver, siffror och understreck.',
            field: 'key'
        })
        return
    }

    const nameError = validateField('name', name, 'string')
    if (nameError) {
        res.status(400).json(nameError)
        return
    }

    if (description !== undefined && description !== null) {
        const error = validateField('description', description, 'string')
        if (error) {
            res.status(400).json(error)
            return
        }
    }

    if (imageUrl !== undefined && imageUrl !== null) {
        const error = validateField('imageUrl', imageUrl, 'string')
        if (error) {
            res.status(400).json(error)
            return
        }
    }

    if (isActive !== undefined) {
        const error = validateField('isActive', isActive, 'boolean')
        if (error) {
            res.status(400).json(error)
            return
        }
    }

    if (width !== undefined) {
        const error = validateField('width', width, 'number')
        if (error) {
            res.status(400).json(error)
            return
        }

        if (!Number.isInteger(width) || width <= 0) {
            res.status(400).json({
                message: 'Bredd måste vara ett positivt heltal.',
                field: 'width'
            })
            return
        }
    }

    if (height !== undefined) {
        const error = validateField('height', height, 'number')
        if (error) {
            res.status(400).json(error)
            return
        }

        if (!Number.isInteger(height) || height <= 0) {
            res.status(400).json({
                message: 'Höjd måste vara ett positivt heltal.',
                field: 'height'
            })
            return
        }
    }

    if (healthDelta !== undefined) {
        const error = validateField('healthDelta', healthDelta, 'number')
        if (error) {
            res.status(400).json(error)
            return
        }

        if (!Number.isInteger(healthDelta)) {
            res.status(400).json({
                message: 'Förändring av hälsa måste vara ett heltal.',
                field: 'healthDelta'
            })
            return
        }
    }

    if (scoreDelta !== undefined) {
        const error = validateField('scoreDelta', scoreDelta, 'number')
        if (error) {
            res.status(400).json(error)
            return
        }

        if (!Number.isInteger(scoreDelta)) {
            res.status(400).json({
                message: 'Poängförändring måste vara ett heltal.',
                field: 'scoreDelta'
            })
            return
        }
    }

    if (speedMultiplier !== undefined) {
        const error = validateField('speedMultiplier', speedMultiplier, 'number')
        if (error) {
            res.status(400).json(error)
            return
        }

        if (speedMultiplier <= 0) {
            res.status(400).json({
                message: 'Hastighetsmultiplikator måste vara större än 0.',
                field: 'speedMultiplier'
            })
            return
        }
    }

    if (scoreMultiplier !== undefined) {
        const error = validateField('scoreMultiplier', scoreMultiplier, 'number')
        if (error) {
            res.status(400).json(error)
            return
        }

        if (scoreMultiplier < 0) {
            res.status(400).json({
                message: 'Poängmultiplikator får inte vara negativ.',
                field: 'scoreMultiplier'
            })
            return
        }
    }

    if (durationSeconds !== undefined) {
        const error = validateField('durationSeconds', durationSeconds, 'number')
        if (error) {
            res.status(400).json(error)
            return
        }

        if (!Number.isInteger(durationSeconds) || durationSeconds < 0) {
            res.status(400).json({
                message: 'Varaktighet måste vara ett heltal som är 0 eller större.',
                field: 'durationSeconds'
            })
            return
        }
    }

    if (spawnWeight !== undefined) {
        const error = validateField('spawnWeight', spawnWeight, 'number')
        if (error) {
            res.status(400).json(error)
            return
        }

        if (!Number.isInteger(spawnWeight) || spawnWeight <= 0) {
            res.status(400).json({
                message: 'Spawn-vikt måste vara ett positivt heltal.',
                field: 'spawnWeight'
            })
            return
        }
    }

    const powerUp = await service.createPowerUp(req.body)

    res.status(201).json(powerUp)
}

export const updatePowerUp = async (
    req: Request<{ id: string }, {}, UpdatePowerUpBody>,
    res: Response<PowerUp | ApiError>
) => {
    const id = Number(req.params.id)

    const idError = validateId('id', id)
    if (idError) {
        res.status(400).json(idError)
        return
    }

    const {
        key,
        name,
        description,
        imageUrl,
        isActive,
        width,
        height,
        healthDelta,
        scoreDelta,
        speedMultiplier,
        scoreMultiplier,
        durationSeconds,
        spawnWeight
    } = req.body ?? {}

    if (
        [
            key,
            name,
            description,
            imageUrl,
            isActive,
            width,
            height,
            healthDelta,
            scoreDelta,
            speedMultiplier,
            scoreMultiplier,
            durationSeconds,
            spawnWeight
        ].every((value) => value === undefined)
    ) {
        res.status(400).json({
            message: 'Minst ett fält måste anges.'
        })
        return
    }

    if (key !== undefined) {
        const error = validateField('key', key, 'string')
        if (error) {
            res.status(400).json(error)
            return
        }

        if (!/^[a-z0-9_]+$/.test(key)) {
            res.status(400).json({
                message: 'Key får endast innehålla små bokstäver, siffror och understreck.',
                field: 'key'
            })
            return
        }
    }

    if (name !== undefined) {
        const error = validateField('name', name, 'string')
        if (error) {
            res.status(400).json(error)
            return
        }
    }

    if (description !== undefined && description !== null) {
        const error = validateField('description', description, 'string')
        if (error) {
            res.status(400).json(error)
            return
        }
    }

    if (imageUrl !== undefined && imageUrl !== null) {
        const error = validateField('imageUrl', imageUrl, 'string')
        if (error) {
            res.status(400).json(error)
            return
        }
    }

    if (isActive !== undefined) {
        const error = validateField('isActive', isActive, 'boolean')
        if (error) {
            res.status(400).json(error)
            return
        }
    }

    if (width !== undefined) {
        const error = validateField('width', width, 'number')
        if (error) {
            res.status(400).json(error)
            return
        }

        if (!Number.isInteger(width) || width <= 0) {
            res.status(400).json({
                message: 'Bredd måste vara ett positivt heltal.',
                field: 'width'
            })
            return
        }
    }

    if (height !== undefined) {
        const error = validateField('height', height, 'number')
        if (error) {
            res.status(400).json(error)
            return
        }

        if (!Number.isInteger(height) || height <= 0) {
            res.status(400).json({
                message: 'Höjd måste vara ett positivt heltal.',
                field: 'height'
            })
            return
        }
    }

    if (healthDelta !== undefined) {
        const error = validateField('healthDelta', healthDelta, 'number')
        if (error) {
            res.status(400).json(error)
            return
        }

        if (!Number.isInteger(healthDelta)) {
            res.status(400).json({
                message: 'Förändring av hälsa måste vara ett heltal.',
                field: 'healthDelta'
            })
            return
        }
    }

    if (scoreDelta !== undefined) {
        const error = validateField('scoreDelta', scoreDelta, 'number')
        if (error) {
            res.status(400).json(error)
            return
        }

        if (!Number.isInteger(scoreDelta)) {
            res.status(400).json({
                message: 'Poängförändring måste vara ett heltal.',
                field: 'scoreDelta'
            })
            return
        }
    }

    if (speedMultiplier !== undefined) {
        const error = validateField('speedMultiplier', speedMultiplier, 'number')
        if (error) {
            res.status(400).json(error)
            return
        }

        if (speedMultiplier <= 0) {
            res.status(400).json({
                message: 'Hastighetsmultiplikator måste vara större än 0.',
                field: 'speedMultiplier'
            })
            return
        }
    }

    if (scoreMultiplier !== undefined) {
        const error = validateField('scoreMultiplier', scoreMultiplier, 'number')
        if (error) {
            res.status(400).json(error)
            return
        }

        if (scoreMultiplier < 0) {
            res.status(400).json({
                message: 'Poängmultiplikator får inte vara negativ.',
                field: 'scoreMultiplier'
            })
            return
        }
    }

    if (durationSeconds !== undefined) {
        const error = validateField('durationSeconds', durationSeconds, 'number')
        if (error) {
            res.status(400).json(error)
            return
        }

        if (!Number.isInteger(durationSeconds) || durationSeconds < 0) {
            res.status(400).json({
                message: 'Varaktighet måste vara ett heltal som är 0 eller större.',
                field: 'durationSeconds'
            })
            return
        }
    }

    if (spawnWeight !== undefined) {
        const error = validateField('spawnWeight', spawnWeight, 'number')
        if (error) {
            res.status(400).json(error)
            return
        }

        if (!Number.isInteger(spawnWeight) || spawnWeight <= 0) {
            res.status(400).json({
                message: 'Spawn-vikt måste vara ett positivt heltal.',
                field: 'spawnWeight'
            })
            return
        }
    }

    const powerUp = await service.updatePowerUp(id, req.body)

    if (!powerUp) {
        res.status(404).json({
            message: 'Power-up hittades inte.',
            field: 'id'
        })
        return
    }

    res.status(200).json(powerUp)
}

export const deletePowerUp = async (
    req: Request<{ id: string }>,
    res: Response<ApiError>
) => {
    const id = Number(req.params.id)

    const error = validateId('id', id)
    if (error) {
        res.status(400).json(error)
        return
    }

    const deletedPowerUp = await service.deletePowerUp(id)

    if (!deletedPowerUp) {
        res.status(404).json({
            message: 'Power-up hittades inte.',
            field: 'id'
        })
        return
    }

    res.status(204).send()
}