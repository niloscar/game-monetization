import api from './apiClient'
import type { Product } from './../types/product'

export async function getProducts(): Promise<Product[]> {
    const response = await api.get<Product[]>('/products')

    return response.data
}