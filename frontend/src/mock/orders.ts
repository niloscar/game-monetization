import type { Order } from './types'

export const orders: Order[] = [
    {
        id: 'order-1',
        userId: 'user-1',
        tierId: 'tier-1',
        status: 'completed',
        amountKr: 29,
        createdAt: '2026-07-03T10:15:00Z'
    },
    {
        id: 'order-2',
        userId: 'user-1',
        tierId: 'tier-2',
        status: 'completed',
        amountKr: 59,
        createdAt: '2026-08-03T10:15:00Z'
    },
    {
        id: 'order-3',
        userId: 'user-1',
        tierId: 'tier-2',
        status: 'completed',
        amountKr: 59,
        createdAt: '2026-09-03T10:15:00Z'
    },
    {
        id: 'order-4',
        userId: 'user-2',
        tierId: 'tier-3',
        status: 'completed',
        amountKr: 99,
        createdAt: '2026-06-14T09:00:00Z'
    },
    {
        id: 'order-5',
        userId: 'user-3',
        tierId: 'tier-2',
        status: 'completed',
        amountKr: 59,
        createdAt: '2026-06-20T14:10:00Z'
    },
    {
        id: 'order-6',
        userId: 'user-4',
        tierId: 'tier-1',
        status: 'completed',
        amountKr: 29,
        createdAt: '2026-08-01T19:25:00Z'
    },
    {
        id: 'order-7',
        userId: 'user-5',
        tierId: 'tier-1',
        status: 'failed',
        amountKr: 29,
        createdAt: '2026-08-11T22:52:00Z'
    },
    {
        id: 'order-8',
        userId: 'user-5',
        tierId: 'tier-1',
        status: 'completed',
        amountKr: 29,
        createdAt: '2026-08-11T22:58:00Z'
    },

    // ---------------------------------------------------------------
    // En completed-order per ny mock-user (user-6..user-51), matchad
    // mot tierId/amountKr: tier-1 29kr, tier-2 59kr, tier-3 99kr.
    // ---------------------------------------------------------------

    {
        id: 'order-9',
        userId: 'user-6',
        tierId: 'tier-1',
        status: 'completed',
        amountKr: 29,
        createdAt: '2026-07-10T09:03:00Z'
    },
    {
        id: 'order-10',
        userId: 'user-7',
        tierId: 'tier-2',
        status: 'completed',
        amountKr: 59,
        createdAt: '2026-07-15T09:03:00Z'
    },
    {
        id: 'order-11',
        userId: 'user-8',
        tierId: 'tier-3',
        status: 'completed',
        amountKr: 99,
        createdAt: '2026-06-25T09:03:00Z'
    },
    {
        id: 'order-12',
        userId: 'user-9',
        tierId: 'tier-1',
        status: 'completed',
        amountKr: 29,
        createdAt: '2026-08-02T09:03:00Z'
    },
    {
        id: 'order-13',
        userId: 'user-10',
        tierId: 'tier-2',
        status: 'completed',
        amountKr: 59,
        createdAt: '2026-07-22T09:03:00Z'
    },
    {
        id: 'order-14',
        userId: 'user-11',
        tierId: 'tier-3',
        status: 'completed',
        amountKr: 99,
        createdAt: '2026-06-30T09:03:00Z'
    },
    {
        id: 'order-15',
        userId: 'user-12',
        tierId: 'tier-1',
        status: 'completed',
        amountKr: 29,
        createdAt: '2026-08-10T09:03:00Z'
    },
    {
        id: 'order-16',
        userId: 'user-13',
        tierId: 'tier-2',
        status: 'completed',
        amountKr: 59,
        createdAt: '2026-07-05T09:03:00Z'
    },
    {
        id: 'order-17',
        userId: 'user-14',
        tierId: 'tier-3',
        status: 'completed',
        amountKr: 99,
        createdAt: '2026-06-18T09:03:00Z'
    },
    {
        id: 'order-18',
        userId: 'user-15',
        tierId: 'tier-1',
        status: 'completed',
        amountKr: 29,
        createdAt: '2026-07-29T09:03:00Z'
    },
    {
        id: 'order-19',
        userId: 'user-16',
        tierId: 'tier-1',
        status: 'completed',
        amountKr: 29,
        createdAt: '2026-08-01T09:03:00Z'
    },
    {
        id: 'order-20',
        userId: 'user-17',
        tierId: 'tier-2',
        status: 'completed',
        amountKr: 59,
        createdAt: '2026-08-05T09:03:00Z'
    },
    {
        id: 'order-21',
        userId: 'user-18',
        tierId: 'tier-3',
        status: 'completed',
        amountKr: 99,
        createdAt: '2026-07-28T09:03:00Z'
    },
    {
        id: 'order-22',
        userId: 'user-19',
        tierId: 'tier-1',
        status: 'completed',
        amountKr: 29,
        createdAt: '2026-07-15T09:03:00Z'
    },
    {
        id: 'order-23',
        userId: 'user-20',
        tierId: 'tier-2',
        status: 'completed',
        amountKr: 59,
        createdAt: '2026-07-02T09:03:00Z'
    },
    {
        id: 'order-24',
        userId: 'user-21',
        tierId: 'tier-3',
        status: 'completed',
        amountKr: 99,
        createdAt: '2026-06-25T09:03:00Z'
    },
    {
        id: 'order-25',
        userId: 'user-22',
        tierId: 'tier-1',
        status: 'completed',
        amountKr: 29,
        createdAt: '2026-01-10T09:03:00Z'
    },
    {
        id: 'order-26',
        userId: 'user-23',
        tierId: 'tier-2',
        status: 'completed',
        amountKr: 59,
        createdAt: '2026-01-25T09:03:00Z'
    },
    {
        id: 'order-27',
        userId: 'user-24',
        tierId: 'tier-3',
        status: 'completed',
        amountKr: 99,
        createdAt: '2026-02-05T09:03:00Z'
    },
    {
        id: 'order-28',
        userId: 'user-25',
        tierId: 'tier-1',
        status: 'completed',
        amountKr: 29,
        createdAt: '2026-02-18T09:03:00Z'
    },
    {
        id: 'order-29',
        userId: 'user-26',
        tierId: 'tier-2',
        status: 'completed',
        amountKr: 59,
        createdAt: '2026-03-01T09:03:00Z'
    },
    {
        id: 'order-30',
        userId: 'user-27',
        tierId: 'tier-3',
        status: 'completed',
        amountKr: 99,
        createdAt: '2026-03-14T09:03:00Z'
    },
    {
        id: 'order-31',
        userId: 'user-28',
        tierId: 'tier-1',
        status: 'completed',
        amountKr: 29,
        createdAt: '2026-03-27T09:03:00Z'
    },
    {
        id: 'order-32',
        userId: 'user-29',
        tierId: 'tier-2',
        status: 'completed',
        amountKr: 59,
        createdAt: '2026-04-08T09:03:00Z'
    },
    {
        id: 'order-33',
        userId: 'user-30',
        tierId: 'tier-3',
        status: 'completed',
        amountKr: 99,
        createdAt: '2026-04-20T09:03:00Z'
    },
    {
        id: 'order-34',
        userId: 'user-31',
        tierId: 'tier-1',
        status: 'completed',
        amountKr: 29,
        createdAt: '2026-05-02T09:03:00Z'
    },
    {
        id: 'order-35',
        userId: 'user-32',
        tierId: 'tier-2',
        status: 'completed',
        amountKr: 59,
        createdAt: '2026-05-15T09:03:00Z'
    },
    {
        id: 'order-36',
        userId: 'user-33',
        tierId: 'tier-3',
        status: 'completed',
        amountKr: 99,
        createdAt: '2026-05-28T09:03:00Z'
    },
    {
        id: 'order-37',
        userId: 'user-34',
        tierId: 'tier-1',
        status: 'completed',
        amountKr: 29,
        createdAt: '2026-06-09T09:03:00Z'
    },
    {
        id: 'order-38',
        userId: 'user-35',
        tierId: 'tier-2',
        status: 'completed',
        amountKr: 59,
        createdAt: '2026-06-21T09:03:00Z'
    },
    {
        id: 'order-39',
        userId: 'user-36',
        tierId: 'tier-3',
        status: 'completed',
        amountKr: 99,
        createdAt: '2026-07-03T09:03:00Z'
    },
    {
        id: 'order-40',
        userId: 'user-37',
        tierId: 'tier-1',
        status: 'completed',
        amountKr: 29,
        createdAt: '2026-07-16T09:03:00Z'
    },
    {
        id: 'order-41',
        userId: 'user-38',
        tierId: 'tier-2',
        status: 'completed',
        amountKr: 59,
        createdAt: '2026-07-28T09:03:00Z'
    },
    {
        id: 'order-42',
        userId: 'user-39',
        tierId: 'tier-3',
        status: 'completed',
        amountKr: 99,
        createdAt: '2026-08-09T09:03:00Z'
    },
    {
        id: 'order-43',
        userId: 'user-40',
        tierId: 'tier-1',
        status: 'completed',
        amountKr: 29,
        createdAt: '2026-08-21T09:03:00Z'
    },
    {
        id: 'order-44',
        userId: 'user-41',
        tierId: 'tier-2',
        status: 'completed',
        amountKr: 59,
        createdAt: '2026-01-15T09:03:00Z'
    },
    {
        id: 'order-45',
        userId: 'user-42',
        tierId: 'tier-3',
        status: 'completed',
        amountKr: 99,
        createdAt: '2026-01-30T09:03:00Z'
    },
    {
        id: 'order-46',
        userId: 'user-43',
        tierId: 'tier-1',
        status: 'completed',
        amountKr: 29,
        createdAt: '2026-02-11T09:03:00Z'
    },
    {
        id: 'order-47',
        userId: 'user-44',
        tierId: 'tier-2',
        status: 'completed',
        amountKr: 59,
        createdAt: '2026-02-23T09:03:00Z'
    },
    {
        id: 'order-48',
        userId: 'user-45',
        tierId: 'tier-3',
        status: 'completed',
        amountKr: 99,
        createdAt: '2026-03-06T09:03:00Z'
    },
    {
        id: 'order-49',
        userId: 'user-46',
        tierId: 'tier-1',
        status: 'completed',
        amountKr: 29,
        createdAt: '2026-03-19T09:03:00Z'
    },
    {
        id: 'order-50',
        userId: 'user-47',
        tierId: 'tier-2',
        status: 'completed',
        amountKr: 59,
        createdAt: '2026-04-01T09:03:00Z'
    },
    {
        id: 'order-51',
        userId: 'user-48',
        tierId: 'tier-3',
        status: 'completed',
        amountKr: 99,
        createdAt: '2026-04-14T09:03:00Z'
    },
    {
        id: 'order-52',
        userId: 'user-49',
        tierId: 'tier-1',
        status: 'completed',
        amountKr: 29,
        createdAt: '2026-04-26T09:03:00Z'
    },
    {
        id: 'order-53',
        userId: 'user-50',
        tierId: 'tier-2',
        status: 'completed',
        amountKr: 59,
        createdAt: '2026-05-08T09:03:00Z'
    },
    {
        id: 'order-54',
        userId: 'user-51',
        tierId: 'tier-3',
        status: 'completed',
        amountKr: 99,
        createdAt: '2026-05-21T09:03:00Z'
    }
]
