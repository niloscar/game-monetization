import apiClient from './apiClient'
import type { CreateOrderBody, CreateOrderResponse } from '@assignment/shared/types/order'

export async function createOrder(body: CreateOrderBody): Promise<CreateOrderResponse> {
    const { data } = await apiClient.post<CreateOrderResponse>('/order', body)

    return data
}