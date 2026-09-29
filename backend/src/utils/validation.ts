import type { ApiError } from '../types/errors'

export function validateField(field: string, value: unknown, type: 'string' | 'number' | 'boolean'): ApiError | null {
    if (value === undefined || value === null) {
        return { message: `Fältet ${field} är obligatoriskt.`, field }
    }

    if (typeof value !== type) {
        return { message: `Fältet ${field} måste innehålla ett värde av typen ${type}.`, field }
    }

    if (typeof value === 'string' && !value.trim()) {
        return { message: `Fältet ${field} är obligatoriskt.`, field }
    }

    if (typeof value === 'number' && !Number.isFinite(value)) {
        return { message: `Fältet ${field} måste innehålla ett giltigt nummer.`, field }
    }

    return null
}

export function validateId(field: string, value: unknown): ApiError | null {
    const error = validateField(field, value, 'number')

    if (error) return error

    if (typeof value !== 'number' || !Number.isSafeInteger(value) || value <= 0) {
        return { message: `Fältet ${field} måste innehålla ett positivt heltal.`, field }
    }

    return null
}