export type {
    TierSlug,
    UserRole,
    Tier,
    User,
    Ad,
    Score,
    OrderStatus,
    Order,
    Receipt,
    Product
} from './types'
export { tiers } from './tiers'
export { users } from './users'
export { scores } from './scores'
export { orders } from './orders'
export { receipts } from './receipts'
export { products } from './products'
export { ads } from './ads'

import { tiers } from './tiers'
import type { Tier, TierSlug } from './types'

/**
 * Avgör om en användares nivå räcker för att se innehåll som kräver requiredTierId.
 * Jämförelsen görs på tiers "order"-fält (1 = lägst, 3 = högst).
 */
export function getTierAccess(
    userTierId: string,
    requiredTierId: string
): boolean {
    const userTier = tiers.find((t) => t.id === userTierId)
    const requiredTier = tiers.find((t) => t.id === requiredTierId)
    if (!userTier || !requiredTier) return false
    return userTier.order >= requiredTier.order
}

export function getTierBySlug(slug: TierSlug): Tier | undefined {
    return tiers.find((t) => t.slug === slug)
}

export function getTierColor(tierId: string): string {
    return tiers.find((t) => t.id === tierId)?.color ?? '#6B6B78'
}
