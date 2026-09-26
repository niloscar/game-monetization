export interface OrderAddress {
    id: number
    fname: string
    lname: string
    street: string
    zipcode: string
    city: string
    country: string
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

export interface CreateOrderBody {
    paymentMethodId?: number | null

    address: {
        fname: string
        lname: string
        street: string
        zipcode: string
        city: string
        country: string
    }

    items: CreateOrderItemBody[]
}

export interface UpdateOrderBody {
    paymentMethodId?: number | null
    status?: string
}