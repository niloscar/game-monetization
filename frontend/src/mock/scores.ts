import type { Score } from './types'

export const scores: Score[] = [
    {
        id: 'score-1',
        userId: 'user-2',
        value: 9840,
        playtimeSeconds: 151200,
        track: 'sektor 3',
        createdAt: '2026-09-14T20:10:00Z'
    },
    {
        id: 'score-2',
        userId: 'user-3',
        value: 8210,
        playtimeSeconds: 96000,
        track: 'sektor 2',
        createdAt: '2026-09-13T18:44:00Z'
    },
    {
        id: 'score-3',
        userId: 'user-4',
        value: 7655,
        playtimeSeconds: 41000,
        track: 'sektor 1',
        createdAt: '2026-09-12T21:02:00Z'
    },
    {
        id: 'score-4',
        userId: 'user-5',
        value: 6920,
        playtimeSeconds: 30500,
        track: 'sektor 2',
        createdAt: '2026-09-10T17:15:00Z'
    },
    {
        id: 'score-5',
        userId: 'user-1',
        value: 4210,
        playtimeSeconds: 24000,
        track: 'sektor 1',
        createdAt: '2026-09-08T12:30:00Z'
    },
    {
        id: 'score-6',
        userId: 'user-1',
        value: 3980,
        playtimeSeconds: 20000,
        track: 'sektor 1',
        createdAt: '2026-08-29T11:05:00Z'
    },
    {
        id: 'score-7',
        userId: 'user-2',
        value: 9500,
        playtimeSeconds: 148000,
        track: 'sektor 3',
        createdAt: '2026-09-01T19:40:00Z'
    },

    // ---------------------------------------------------------------
    // Extra mock-scores, en per ny user i users.ts. Rank 5-14 ligger
    // strax ovanför julia_l (rank 15, score-5), rank 16-51 strax under
    // — user-51/score-53 hamnar exakt på plats 51, utanför topp 50.
    // ---------------------------------------------------------------

    {
        id: 'score-8',
        userId: 'user-6',
        value: 6800,
        playtimeSeconds: 88400,
        track: 'sektor 1',
        createdAt: '2026-09-19T14:00:00Z'
    },
    {
        id: 'score-9',
        userId: 'user-7',
        value: 6450,
        playtimeSeconds: 51600,
        track: 'sektor 2',
        createdAt: '2026-09-19T11:30:00Z'
    },
    {
        id: 'score-10',
        userId: 'user-8',
        value: 6100,
        playtimeSeconds: 73200,
        track: 'sektor 3',
        createdAt: '2026-09-18T20:15:00Z'
    },
    {
        id: 'score-11',
        userId: 'user-9',
        value: 5800,
        playtimeSeconds: 46400,
        track: 'sektor 1',
        createdAt: '2026-09-17T19:05:00Z'
    },
    {
        id: 'score-12',
        userId: 'user-10',
        value: 5500,
        playtimeSeconds: 66000,
        track: 'sektor 2',
        createdAt: '2026-09-16T21:40:00Z'
    },
    {
        id: 'score-13',
        userId: 'user-11',
        value: 5200,
        playtimeSeconds: 36400,
        track: 'sektor 3',
        createdAt: '2026-09-15T18:22:00Z'
    },
    {
        id: 'score-14',
        userId: 'user-12',
        value: 4950,
        playtimeSeconds: 59400,
        track: 'sektor 1',
        createdAt: '2026-09-05T16:10:00Z'
    },
    {
        id: 'score-15',
        userId: 'user-13',
        value: 4700,
        playtimeSeconds: 28200,
        track: 'sektor 2',
        createdAt: '2026-08-28T17:45:00Z'
    },
    {
        id: 'score-16',
        userId: 'user-14',
        value: 4500,
        playtimeSeconds: 49500,
        track: 'sektor 3',
        createdAt: '2026-08-20T15:30:00Z'
    },
    {
        id: 'score-17',
        userId: 'user-15',
        value: 4300,
        playtimeSeconds: 30100,
        track: 'sektor 1',
        createdAt: '2026-08-15T13:12:00Z'
    },

    {
        id: 'score-18',
        userId: 'user-16',
        value: 4100,
        playtimeSeconds: 53300,
        track: 'sektor 1',
        createdAt: '2026-09-18T18:00:00Z'
    },
    {
        id: 'score-19',
        userId: 'user-17',
        value: 4000,
        playtimeSeconds: 36000,
        track: 'sektor 2',
        createdAt: '2026-09-17T18:00:00Z'
    },
    {
        id: 'score-20',
        userId: 'user-18',
        value: 3900,
        playtimeSeconds: 58500,
        track: 'sektor 3',
        createdAt: '2026-09-16T18:00:00Z'
    },
    {
        id: 'score-21',
        userId: 'user-19',
        value: 3800,
        playtimeSeconds: 22800,
        track: 'sektor 1',
        createdAt: '2026-09-15T18:00:00Z'
    },
    {
        id: 'score-22',
        userId: 'user-20',
        value: 3700,
        playtimeSeconds: 40700,
        track: 'sektor 2',
        createdAt: '2026-09-14T18:00:00Z'
    },
    {
        id: 'score-23',
        userId: 'user-21',
        value: 3600,
        playtimeSeconds: 28800,
        track: 'sektor 3',
        createdAt: '2026-09-13T18:00:00Z'
    },
    {
        id: 'score-24',
        userId: 'user-22',
        value: 3500,
        playtimeSeconds: 49000,
        track: 'sektor 1',
        createdAt: '2026-08-25T18:00:00Z'
    },
    {
        id: 'score-25',
        userId: 'user-23',
        value: 3400,
        playtimeSeconds: 17000,
        track: 'sektor 2',
        createdAt: '2026-08-18T18:00:00Z'
    },
    {
        id: 'score-26',
        userId: 'user-24',
        value: 3300,
        playtimeSeconds: 33000,
        track: 'sektor 3',
        createdAt: '2026-08-10T18:00:00Z'
    },
    {
        id: 'score-27',
        userId: 'user-25',
        value: 3200,
        playtimeSeconds: 22400,
        track: 'sektor 1',
        createdAt: '2026-08-02T18:00:00Z'
    },
    {
        id: 'score-28',
        userId: 'user-26',
        value: 3100,
        playtimeSeconds: 40300,
        track: 'sektor 2',
        createdAt: '2026-07-27T18:00:00Z'
    },
    {
        id: 'score-29',
        userId: 'user-27',
        value: 3000,
        playtimeSeconds: 27000,
        track: 'sektor 3',
        createdAt: '2026-07-19T18:00:00Z'
    },
    {
        id: 'score-30',
        userId: 'user-28',
        value: 2900,
        playtimeSeconds: 43500,
        track: 'sektor 1',
        createdAt: '2026-07-12T18:00:00Z'
    },
    {
        id: 'score-31',
        userId: 'user-29',
        value: 2800,
        playtimeSeconds: 16800,
        track: 'sektor 2',
        createdAt: '2026-07-05T18:00:00Z'
    },
    {
        id: 'score-32',
        userId: 'user-30',
        value: 2700,
        playtimeSeconds: 29700,
        track: 'sektor 3',
        createdAt: '2026-06-28T18:00:00Z'
    },
    {
        id: 'score-33',
        userId: 'user-31',
        value: 2600,
        playtimeSeconds: 20800,
        track: 'sektor 1',
        createdAt: '2026-06-20T18:00:00Z'
    },
    {
        id: 'score-34',
        userId: 'user-32',
        value: 2500,
        playtimeSeconds: 35000,
        track: 'sektor 2',
        createdAt: '2026-06-14T18:00:00Z'
    },
    {
        id: 'score-35',
        userId: 'user-33',
        value: 2400,
        playtimeSeconds: 12000,
        track: 'sektor 3',
        createdAt: '2026-06-05T18:00:00Z'
    },
    {
        id: 'score-36',
        userId: 'user-34',
        value: 2300,
        playtimeSeconds: 23000,
        track: 'sektor 1',
        createdAt: '2026-05-29T18:00:00Z'
    },
    {
        id: 'score-37',
        userId: 'user-35',
        value: 2200,
        playtimeSeconds: 15400,
        track: 'sektor 2',
        createdAt: '2026-05-20T18:00:00Z'
    },
    {
        id: 'score-38',
        userId: 'user-36',
        value: 2100,
        playtimeSeconds: 27300,
        track: 'sektor 3',
        createdAt: '2026-05-12T18:00:00Z'
    },
    {
        id: 'score-39',
        userId: 'user-37',
        value: 2000,
        playtimeSeconds: 18000,
        track: 'sektor 1',
        createdAt: '2026-05-04T18:00:00Z'
    },
    {
        id: 'score-40',
        userId: 'user-38',
        value: 1900,
        playtimeSeconds: 28500,
        track: 'sektor 2',
        createdAt: '2026-04-27T18:00:00Z'
    },
    {
        id: 'score-41',
        userId: 'user-39',
        value: 1800,
        playtimeSeconds: 10800,
        track: 'sektor 3',
        createdAt: '2026-04-19T18:00:00Z'
    },
    {
        id: 'score-42',
        userId: 'user-40',
        value: 1700,
        playtimeSeconds: 18700,
        track: 'sektor 1',
        createdAt: '2026-04-11T18:00:00Z'
    },
    {
        id: 'score-43',
        userId: 'user-41',
        value: 1600,
        playtimeSeconds: 12800,
        track: 'sektor 2',
        createdAt: '2026-04-03T18:00:00Z'
    },
    {
        id: 'score-44',
        userId: 'user-42',
        value: 1500,
        playtimeSeconds: 21000,
        track: 'sektor 3',
        createdAt: '2026-03-27T18:00:00Z'
    },
    {
        id: 'score-45',
        userId: 'user-43',
        value: 1400,
        playtimeSeconds: 7000,
        track: 'sektor 1',
        createdAt: '2026-03-19T18:00:00Z'
    },
    {
        id: 'score-46',
        userId: 'user-44',
        value: 1300,
        playtimeSeconds: 13000,
        track: 'sektor 2',
        createdAt: '2026-03-11T18:00:00Z'
    },
    {
        id: 'score-47',
        userId: 'user-45',
        value: 1200,
        playtimeSeconds: 8400,
        track: 'sektor 3',
        createdAt: '2026-03-03T18:00:00Z'
    },
    {
        id: 'score-48',
        userId: 'user-46',
        value: 1100,
        playtimeSeconds: 14300,
        track: 'sektor 1',
        createdAt: '2026-02-24T18:00:00Z'
    },
    {
        id: 'score-49',
        userId: 'user-47',
        value: 1000,
        playtimeSeconds: 9000,
        track: 'sektor 2',
        createdAt: '2026-02-16T18:00:00Z'
    },
    {
        id: 'score-50',
        userId: 'user-48',
        value: 900,
        playtimeSeconds: 13500,
        track: 'sektor 3',
        createdAt: '2026-02-08T18:00:00Z'
    },
    {
        id: 'score-51',
        userId: 'user-49',
        value: 800,
        playtimeSeconds: 4800,
        track: 'sektor 1',
        createdAt: '2026-01-30T18:00:00Z'
    },
    {
        id: 'score-52',
        userId: 'user-50',
        value: 700,
        playtimeSeconds: 7700,
        track: 'sektor 2',
        createdAt: '2026-01-22T18:00:00Z'
    },
    {
        id: 'score-53',
        userId: 'user-51',
        value: 600,
        playtimeSeconds: 4800,
        track: 'sektor 3',
        createdAt: '2026-01-14T18:00:00Z'
    }
]
