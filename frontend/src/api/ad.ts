import api from './apiClient'
import type { Ad, AdPlacement } from '@assignment/shared/types/ad'

export async function getAds(placement?: AdPlacement): Promise<Ad[]> {
    const response = await api.get<Ad[]>('/ad', {
        params: placement ? { placement } : undefined
    })

    return response.data
}