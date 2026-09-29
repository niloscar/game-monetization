export interface InputState {
    left: boolean
    right: boolean
    accelerate: boolean
    brake: boolean
    start: boolean
}

const GAME_KEYS = [
    'ArrowLeft',
    'ArrowRight',
    'ArrowUp',
    'ArrowDown',
    'KeyW',
    'KeyA',
    'KeyS',
    'KeyD',
    'Space'
]

export const createInput = (element: HTMLElement) => {
    const state: InputState = {
        left: false,
        right: false,
        accelerate: false,
        brake: false,
        start: false
    }

    const handleKeyDown = (event: KeyboardEvent) => {
        if (GAME_KEYS.includes(event.code)) event.preventDefault()

        switch (event.code) {
            case 'ArrowLeft':
            case 'KeyA':
                state.left = true
                break

            case 'ArrowRight':
            case 'KeyD':
                state.right = true
                break

            case 'ArrowUp':
            case 'KeyW':
                state.accelerate = true
                break

            case 'ArrowDown':
            case 'KeyS':
                state.brake = true
                break

            case 'Space':
                state.start = true
                break
        }
    }

    const handleKeyUp = (event: KeyboardEvent) => {
        if (GAME_KEYS.includes(event.code)) event.preventDefault()

        switch (event.code) {
            case 'ArrowLeft':
            case 'KeyA':
                state.left = false
                break

            case 'ArrowRight':
            case 'KeyD':
                state.right = false
                break

            case 'ArrowUp':
            case 'KeyW':
                state.accelerate = false
                break

            case 'ArrowDown':
            case 'KeyS':
                state.brake = false
                break

            case 'Space':
                state.start = false
                break
        }
    }

    const start = () => {
        element.addEventListener('keydown', handleKeyDown)
        element.addEventListener('keyup', handleKeyUp)
    }

    const stop = () => {
        element.removeEventListener('keydown', handleKeyDown)
        element.removeEventListener('keyup', handleKeyUp)
    }

    return {
        state,
        start,
        stop
    }
}
