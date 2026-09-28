import PizzaArcade from '../../../games/pizza_arcade/frontend/PizzaArcade'
import styles from './game.module.css'

export default function Game() {
  return (
    <div className={styles['game-container']}>
      <PizzaArcade />
    </div>
  )
}