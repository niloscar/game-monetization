import type { Player } from '../types/game'

export function damagePlayer(player: Player, amount: number) {
    player.health.current = Math.max(0, player.health.current - amount)
}

export function healPlayer(player: Player, amount: number) {
    player.health.current = Math.min(player.health.max, player.health.current + amount)
}

export function increaseMaxHealth(player: Player, amount: number) {
    player.health.max += amount
}

export function decreaseMaxHealth(player: Player, amount: number) {
    player.health.max = Math.max(1, player.health.max - amount)
    player.health.current = Math.min(player.health.current, player.health.max)
}