import apiClient from './apiClient'
import type { GameAccess } from '../types/gameAccess'

export async function getGameAccess(): Promise<GameAccess> {
    const { data } = await apiClient.get<GameAccess>('/game/access')

    return data
}

export async function saveScore(score: number): Promise<void> {
    await apiClient.post('/game/score', { score })
}