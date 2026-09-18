import type { User } from './types'

// OBS: passwordHash är mockat för utveckling — aldrig riktiga hashar
export const users: User[] = [
    {
        id: 'user-1',
        username: 'julia_l',
        email: 'julia@example.com',
        passwordHash: 'mock$combo-pass-hash',
        role: 'user',
        tierId: 'tier-2',
        createdAt: '2026-07-03T10:12:00Z'
    },
    {
        id: 'user-2',
        username: 'pizzabudet_99',
        email: 'pizzabudet99@example.com',
        passwordHash: 'mock$high-score-hash',
        role: 'user',
        tierId: 'tier-3',
        createdAt: '2026-06-14T08:40:00Z'
    },
    {
        id: 'user-3',
        username: 'slicemaster',
        email: 'slicemaster@example.com',
        passwordHash: 'mock$combo-pass-hash',
        role: 'user',
        tierId: 'tier-2',
        createdAt: '2026-06-20T14:05:00Z'
    },
    {
        id: 'user-4',
        username: 'turbo_ove',
        email: 'turbo.ove@example.com',
        passwordHash: 'mock$quarter-pass-hash',
        role: 'user',
        tierId: 'tier-1',
        createdAt: '2026-08-01T19:22:00Z'
    },
    {
        id: 'user-5',
        username: 'nattskiftet',
        email: 'nattskiftet@example.com',
        passwordHash: 'mock$quarter-pass-hash',
        role: 'user',
        tierId: 'tier-1',
        createdAt: '2026-08-11T22:51:00Z'
    },
    {
        id: 'admin-1',
        username: 'oscar_admin',
        email: 'oscar@pizzaarcade.dev',
        passwordHash: 'mock$admin-hash',
        role: 'admin',
        tierId: 'tier-3',
        createdAt: '2026-05-01T09:00:00Z'
    }
]
