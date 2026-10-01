import type { ComponentType, SVGProps } from 'react'
import { Gamepad, Trophy, Close, Chart, ListBox, Crown } from 'pixelarticons/react'
import type { Product } from '../../types/product'
import type { Tier } from './storeTypes'

const featureIcons: Record<string, ComponentType<SVGProps<SVGSVGElement>>> = {
    show_current_score: Gamepad,
    show_personal_high_score: Trophy,
    scoreboard_full: ListBox,
    scoreboard_top_3: Chart,
    disable_pre_game_ads: Close,
    disable_display_ads: Close,
    show_own_ranking: Crown
}

export function productToTier(product: Product): Tier {
    return {
        id: Number(product.id),
        name: product.name,
        price: product.price ?? 0,
        period: 'mån',
        mostPopular: product.isMostPopular,
        features: product.features.map((feature) => ({
            key: feature.key,
            name: feature.name,
            icon: featureIcons[feature.key] ?? null
        }))
    }
}