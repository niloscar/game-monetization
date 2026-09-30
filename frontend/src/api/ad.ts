import api from './apiClient'
import type { Ad, AdPlacement, AdPolicy } from '@assignment/shared/types/ad'

export async function getAds(placement?: AdPlacement): Promise<Ad[]> {
    const response = await api.get<Ad[]>('/ad', {
        params: placement ? { placement } : undefined
    })

    return response.data
}

export async function getAdPolicy(): Promise<AdPolicy> {
    const response = await api.get<AdPolicy>('/game/ad-policy')

    return response.data
}