import type { Tier } from './types'

export const tiers: Tier[] = [
    {
        id: 'tier-1',
        slug: 'quarter-pass',
        name: 'Quarter Pass',
        priceKr: 29,
        order: 1,
        color: '#2DE2E6',
        adFrequency: 'high',
        features: ['Full spelåtkomst', 'Mycket reklam', 'Ser maxpoäng']
    },
    {
        id: 'tier-2',
        slug: 'combo-pass',
        name: 'Combo Pass',
        priceKr: 59,
        order: 2,
        color: '#F72585',
        adFrequency: 'medium',
        features: [
            'Full spelåtkomst',
            'En del reklam',
            'Ser maxpoäng + speltid'
        ]
    },
    {
        id: 'tier-3',
        slug: 'high-score-access',
        name: 'High Score Access',
        priceKr: 99,
        order: 3,
        color: '#FFD60A',
        adFrequency: 'none',
        features: [
            'Full spelåtkomst',
            'Ingen reklam',
            'Full statistik med high score',
            'Prioriterad support'
        ]
    }
]
