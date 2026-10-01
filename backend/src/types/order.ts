export interface OrderAddress {
    id: number
    fname: string | null
    lname: string | null
    street: string | null
    zipcode: string | null
    city: string | null
    country: string | null
}

export interface OrderItem {
    productId: number
    quantity: number
    unitPrice: number
}

export interface Order {
    id: number
    customerId: number
    paymentMethodId: number | null
    status: string
    orderedAt: Date
    paidAt: Date | null
    address: OrderAddress
    items: OrderItem[]
}

export interface CreateOrderItemBody {
    productId: number
    quantity: number
}

export interface UpdateOrderBody {
    paymentMethodId?: number | null
    status?: string
}