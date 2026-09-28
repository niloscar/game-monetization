export interface InputState {
  left: boolean
  right: boolean
  accelerate: boolean
  brake: boolean
}

export const createInput = () => {
  const state: InputState = {
    left: false,
    right: false,
    accelerate: false,
    brake: false,
  }

  const handleKeyDown = (event: KeyboardEvent) => {
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
    }
  }

  const handleKeyUp = (event: KeyboardEvent) => {
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
    }
  }

  const start = () => {
    window.addEventListener('keydown', handleKeyDown)
    window.addEventListener('keyup', handleKeyUp)
  }

  const stop = () => {
    window.removeEventListener('keydown', handleKeyDown)
    window.removeEventListener('keyup', handleKeyUp)
  }

  return {
    state,
    start,
    stop,
  }
}