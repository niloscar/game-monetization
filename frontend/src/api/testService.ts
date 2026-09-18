import api from './apiClient'

export const getApiResponse = async (): Promise<{message: string}> => {
    const response = await api.get<{message: string}>('/test')
    return response.data
}