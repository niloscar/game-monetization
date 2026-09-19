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
    },

    // ---------------------------------------------------------------
    // Extra mock-users för att testa scoreboardens rank-baserade UI:
    // topp 3, luckan mellan topp 3 och egen placering, topp 50-gränsen
    // och alla tre tiers gating. Se motsvarande scores i scores.ts.
    // ---------------------------------------------------------------

    // Rank 5-14: strax ovanför julia_l (rank 15)
    {
        id: 'user-6',
        username: 'mozzarella_mike',
        email: 'mozzarella.mike@example.com',
        passwordHash: 'mock$quarter-pass-hash',
        role: 'user',
        tierId: 'tier-1',
        createdAt: '2026-07-10T09:00:00Z'
    },
    {
        id: 'user-7',
        username: 'deep_dish_dan',
        email: 'deep.dish.dan@example.com',
        passwordHash: 'mock$combo-pass-hash',
        role: 'user',
        tierId: 'tier-2',
        createdAt: '2026-07-15T09:00:00Z'
    },
    {
        id: 'user-8',
        username: 'crust_crusher',
        email: 'crust.crusher@example.com',
        passwordHash: 'mock$high-score-hash',
        role: 'user',
        tierId: 'tier-3',
        createdAt: '2026-06-25T09:00:00Z'
    },
    {
        id: 'user-9',
        username: 'anchovy_ace',
        email: 'anchovy.ace@example.com',
        passwordHash: 'mock$quarter-pass-hash',
        role: 'user',
        tierId: 'tier-1',
        createdAt: '2026-08-02T09:00:00Z'
    },
    {
        id: 'user-10',
        username: 'pepperoni_pia',
        email: 'pepperoni.pia@example.com',
        passwordHash: 'mock$combo-pass-hash',
        role: 'user',
        tierId: 'tier-2',
        createdAt: '2026-07-22T09:00:00Z'
    },
    {
        id: 'user-11',
        username: 'sauce_boss',
        email: 'sauce.boss@example.com',
        passwordHash: 'mock$high-score-hash',
        role: 'user',
        tierId: 'tier-3',
        createdAt: '2026-06-30T09:00:00Z'
    },
    {
        id: 'user-12',
        username: 'oven_oskar',
        email: 'oven.oskar@example.com',
        passwordHash: 'mock$quarter-pass-hash',
        role: 'user',
        tierId: 'tier-1',
        createdAt: '2026-08-10T09:00:00Z'
    },
    {
        id: 'user-13',
        username: 'topping_tina',
        email: 'topping.tina@example.com',
        passwordHash: 'mock$combo-pass-hash',
        role: 'user',
        tierId: 'tier-2',
        createdAt: '2026-07-05T09:00:00Z'
    },
    {
        id: 'user-14',
        username: 'quattro_stagioni',
        email: 'quattro.stagioni@example.com',
        passwordHash: 'mock$high-score-hash',
        role: 'user',
        tierId: 'tier-3',
        createdAt: '2026-06-18T09:00:00Z'
    },
    {
        id: 'user-15',
        username: 'garlic_bread_gustav',
        email: 'garlic.bread.gustav@example.com',
        passwordHash: 'mock$quarter-pass-hash',
        role: 'user',
        tierId: 'tier-1',
        createdAt: '2026-07-29T09:00:00Z'
    },

    // Rank 16-51: under julia_l — user-51 hamnar sist, strax under topp 50-gränsen
    {
        id: 'user-16',
        username: 'slice_ninja',
        email: 'slice.ninja@example.com',
        passwordHash: 'mock$quarter-pass-hash',
        role: 'user',
        tierId: 'tier-1',
        createdAt: '2026-08-01T09:00:00Z'
    },
    {
        id: 'user-17',
        username: 'dough_daniel',
        email: 'dough.daniel@example.com',
        passwordHash: 'mock$combo-pass-hash',
        role: 'user',
        tierId: 'tier-2',
        createdAt: '2026-08-05T09:00:00Z'
    },
    {
        id: 'user-18',
        username: 'cheese_pull_cissi',
        email: 'cheese.pull.cissi@example.com',
        passwordHash: 'mock$high-score-hash',
        role: 'user',
        tierId: 'tier-3',
        createdAt: '2026-07-28T09:00:00Z'
    },
    {
        id: 'user-19',
        username: 'tomato_tornado',
        email: 'tomato.tornado@example.com',
        passwordHash: 'mock$quarter-pass-hash',
        role: 'user',
        tierId: 'tier-1',
        createdAt: '2026-07-15T09:00:00Z'
    },
    {
        id: 'user-20',
        username: 'basil_bandit',
        email: 'basil.bandit@example.com',
        passwordHash: 'mock$combo-pass-hash',
        role: 'user',
        tierId: 'tier-2',
        createdAt: '2026-07-02T09:00:00Z'
    },
    {
        id: 'user-21',
        username: 'calzone_kalle',
        email: 'calzone.kalle@example.com',
        passwordHash: 'mock$high-score-hash',
        role: 'user',
        tierId: 'tier-3',
        createdAt: '2026-06-25T09:00:00Z'
    },
    {
        id: 'user-22',
        username: 'margherita_maja',
        email: 'margherita.maja@example.com',
        passwordHash: 'mock$quarter-pass-hash',
        role: 'user',
        tierId: 'tier-1',
        createdAt: '2026-01-10T09:00:00Z'
    },
    {
        id: 'user-23',
        username: 'capricciosa_carl',
        email: 'capricciosa.carl@example.com',
        passwordHash: 'mock$combo-pass-hash',
        role: 'user',
        tierId: 'tier-2',
        createdAt: '2026-01-25T09:00:00Z'
    },
    {
        id: 'user-24',
        username: 'parma_pelle',
        email: 'parma.pelle@example.com',
        passwordHash: 'mock$high-score-hash',
        role: 'user',
        tierId: 'tier-3',
        createdAt: '2026-02-05T09:00:00Z'
    },
    {
        id: 'user-25',
        username: 'chili_flake_frida',
        email: 'chili.flake.frida@example.com',
        passwordHash: 'mock$quarter-pass-hash',
        role: 'user',
        tierId: 'tier-1',
        createdAt: '2026-02-18T09:00:00Z'
    },
    {
        id: 'user-26',
        username: 'thin_crust_theo',
        email: 'thin.crust.theo@example.com',
        passwordHash: 'mock$combo-pass-hash',
        role: 'user',
        tierId: 'tier-2',
        createdAt: '2026-03-01T09:00:00Z'
    },
    {
        id: 'user-27',
        username: 'deep_fryer_freja',
        email: 'deep.fryer.freja@example.com',
        passwordHash: 'mock$high-score-hash',
        role: 'user',
        tierId: 'tier-3',
        createdAt: '2026-03-14T09:00:00Z'
    },
    {
        id: 'user-28',
        username: 'extra_cheese_erik',
        email: 'extra.cheese.erik@example.com',
        passwordHash: 'mock$quarter-pass-hash',
        role: 'user',
        tierId: 'tier-1',
        createdAt: '2026-03-27T09:00:00Z'
    },
    {
        id: 'user-29',
        username: 'arcade_annika',
        email: 'arcade.annika@example.com',
        passwordHash: 'mock$combo-pass-hash',
        role: 'user',
        tierId: 'tier-2',
        createdAt: '2026-04-08T09:00:00Z'
    },
    {
        id: 'user-30',
        username: 'joystick_johan',
        email: 'joystick.johan@example.com',
        passwordHash: 'mock$high-score-hash',
        role: 'user',
        tierId: 'tier-3',
        createdAt: '2026-04-20T09:00:00Z'
    },
    {
        id: 'user-31',
        username: 'highscore_hilda',
        email: 'highscore.hilda@example.com',
        passwordHash: 'mock$quarter-pass-hash',
        role: 'user',
        tierId: 'tier-1',
        createdAt: '2026-05-02T09:00:00Z'
    },
    {
        id: 'user-32',
        username: 'combo_carla',
        email: 'combo.carla@example.com',
        passwordHash: 'mock$combo-pass-hash',
        role: 'user',
        tierId: 'tier-2',
        createdAt: '2026-05-15T09:00:00Z'
    },
    {
        id: 'user-33',
        username: 'pixel_pia',
        email: 'pixel.pia@example.com',
        passwordHash: 'mock$high-score-hash',
        role: 'user',
        tierId: 'tier-3',
        createdAt: '2026-05-28T09:00:00Z'
    },
    {
        id: 'user-34',
        username: 'retro_robin',
        email: 'retro.robin@example.com',
        passwordHash: 'mock$quarter-pass-hash',
        role: 'user',
        tierId: 'tier-1',
        createdAt: '2026-06-09T09:00:00Z'
    },
    {
        id: 'user-35',
        username: 'coin_op_conny',
        email: 'coin.op.conny@example.com',
        passwordHash: 'mock$combo-pass-hash',
        role: 'user',
        tierId: 'tier-2',
        createdAt: '2026-06-21T09:00:00Z'
    },
    {
        id: 'user-36',
        username: 'turbo_boost_tove',
        email: 'turbo.boost.tove@example.com',
        passwordHash: 'mock$high-score-hash',
        role: 'user',
        tierId: 'tier-3',
        createdAt: '2026-07-03T09:00:00Z'
    },
    {
        id: 'user-37',
        username: 'drift_king_dennis',
        email: 'drift.king.dennis@example.com',
        passwordHash: 'mock$quarter-pass-hash',
        role: 'user',
        tierId: 'tier-1',
        createdAt: '2026-07-16T09:00:00Z'
    },
    {
        id: 'user-38',
        username: 'sector_sofia',
        email: 'sector.sofia@example.com',
        passwordHash: 'mock$combo-pass-hash',
        role: 'user',
        tierId: 'tier-2',
        createdAt: '2026-07-28T09:00:00Z'
    },
    {
        id: 'user-39',
        username: 'checkpoint_charlie',
        email: 'checkpoint.charlie@example.com',
        passwordHash: 'mock$high-score-hash',
        role: 'user',
        tierId: 'tier-3',
        createdAt: '2026-08-09T09:00:00Z'
    },
    {
        id: 'user-40',
        username: 'speedrun_sara',
        email: 'speedrun.sara@example.com',
        passwordHash: 'mock$quarter-pass-hash',
        role: 'user',
        tierId: 'tier-1',
        createdAt: '2026-08-21T09:00:00Z'
    },
    {
        id: 'user-41',
        username: 'nitro_nils',
        email: 'nitro.nils@example.com',
        passwordHash: 'mock$combo-pass-hash',
        role: 'user',
        tierId: 'tier-2',
        createdAt: '2026-01-15T09:00:00Z'
    },
    {
        id: 'user-42',
        username: 'byte_beatrice',
        email: 'byte.beatrice@example.com',
        passwordHash: 'mock$high-score-hash',
        role: 'user',
        tierId: 'tier-3',
        createdAt: '2026-01-30T09:00:00Z'
    },
    {
        id: 'user-43',
        username: 'glitch_gustav',
        email: 'glitch.gustav@example.com',
        passwordHash: 'mock$quarter-pass-hash',
        role: 'user',
        tierId: 'tier-1',
        createdAt: '2026-02-11T09:00:00Z'
    },
    {
        id: 'user-44',
        username: 'boss_rush_bella',
        email: 'boss.rush.bella@example.com',
        passwordHash: 'mock$combo-pass-hash',
        role: 'user',
        tierId: 'tier-2',
        createdAt: '2026-02-23T09:00:00Z'
    },
    {
        id: 'user-45',
        username: 'credits_carl',
        email: 'credits.carl@example.com',
        passwordHash: 'mock$high-score-hash',
        role: 'user',
        tierId: 'tier-3',
        createdAt: '2026-03-06T09:00:00Z'
    },
    {
        id: 'user-46',
        username: 'arcade_annelie',
        email: 'arcade.annelie@example.com',
        passwordHash: 'mock$quarter-pass-hash',
        role: 'user',
        tierId: 'tier-1',
        createdAt: '2026-03-19T09:00:00Z'
    },
    {
        id: 'user-47',
        username: 'level_up_lasse',
        email: 'level.up.lasse@example.com',
        passwordHash: 'mock$combo-pass-hash',
        role: 'user',
        tierId: 'tier-2',
        createdAt: '2026-04-01T09:00:00Z'
    },
    {
        id: 'user-48',
        username: 'power_up_petra',
        email: 'power.up.petra@example.com',
        passwordHash: 'mock$high-score-hash',
        role: 'user',
        tierId: 'tier-3',
        createdAt: '2026-04-14T09:00:00Z'
    },
    {
        id: 'user-49',
        username: 'game_over_greta',
        email: 'game.over.greta@example.com',
        passwordHash: 'mock$quarter-pass-hash',
        role: 'user',
        tierId: 'tier-1',
        createdAt: '2026-04-26T09:00:00Z'
    },
    {
        id: 'user-50',
        username: 'respawn_rasmus',
        email: 'respawn.rasmus@example.com',
        passwordHash: 'mock$combo-pass-hash',
        role: 'user',
        tierId: 'tier-2',
        createdAt: '2026-05-08T09:00:00Z'
    },
    {
        id: 'user-51',
        username: 'final_boss_filip',
        email: 'final.boss.filip@example.com',
        passwordHash: 'mock$high-score-hash',
        role: 'user',
        tierId: 'tier-3',
        createdAt: '2026-05-21T09:00:00Z'
    }
]
