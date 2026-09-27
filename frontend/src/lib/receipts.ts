import api from '../api/apiClient'

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
    orderedAt: string
    paidAt: string | null
    address: OrderAddress
    items: OrderItem[]
}

export async function fetchMyOrders(): Promise<Order[]> {
    const res = await api.get<Order[]>('/order')
    return res.data
}

const PRODUCT_NAMES: Record<number, string> = {
    1: 'Quarter Pass',
    2: 'Combo Pass',
    3: 'High Score Access'
}

export function getProductName(productId: number): string {
    return PRODUCT_NAMES[productId] ?? `Produkt #${productId}`
}

export function getOrderTotal(order: Order): number {
    return order.items.reduce(
        (sum, item) => sum + item.unitPrice * item.quantity,
        0
    )
}

export function formatPrice(amount: number): string {
    return `${amount.toLocaleString('sv-SE')} kr`
}

const STATUS_LABELS: Record<string, string> = {
    pending: 'Väntar',
    paid: 'Betald',
    cancelled: 'Avbruten',
    completed: 'Genomförd'
}

export function formatStatus(status: string): string {
    return (
        STATUS_LABELS[status] ??
        status.charAt(0).toUpperCase() + status.slice(1)
    )
}
