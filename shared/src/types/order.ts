export type PaymentMethod = 'card' | 'swish' | 'paypal'

export interface CreateOrderBody {
    productId: number
    paymentMethod: PaymentMethod
}

export interface CreateOrderResponse {
    id: number
}