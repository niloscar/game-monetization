import styles from './start-screen.module.css'
import pizzaArcadeLogo from '../assets/pizza_arcade/pizza-arcade-logo-1.png'

export default function StartScreen() {
    return (
        <div className={styles['start-screen']}>
            <img src={pizzaArcadeLogo} alt="Pizza Arcade" className={styles.logo} />
            <p className={styles['start-text']}>Tryck på SPACE för att starta</p>
        </div>
    )
}