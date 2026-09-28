import type { ChangeEvent, ComponentType, SVGProps } from 'react'

export interface TierFeature {
    name: string
    included: boolean
    icon: ComponentType<SVGProps<SVGSVGElement>> | null
}

export interface Tier {
    id: number
    name: string
    price: number
    period: string
    features: TierFeature[]
    mostPopular: boolean
}

export interface TierCardProps {
    tier: Tier
    selected: boolean
    onChange: (tier: Tier) => void
}

export interface CartItem {
    id: number
    name: string
    price: number
}

export interface Cart {
    items: CartItem[]
}

export interface PaymentFormData {
    cardNumber: string
    cardName: string
    expiryDate: string
    cvc: string
    swishNumber: string
    paypalEmail: string
    paypalPassword: string
}

export interface FormBodyProps {
    formData: PaymentFormData
    errors: Record<string, string>
    handleChange: (e: ChangeEvent<HTMLInputElement>) => void
}