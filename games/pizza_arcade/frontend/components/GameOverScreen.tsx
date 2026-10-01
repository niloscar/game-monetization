import styles from './game-over-screen.module.css'

export default function GameOverScreen() {
    return (
        <div className={styles['game-over-screen']}>
            <h1>GAME OVER</h1>
            <p className={styles['game-over-text']}>Tryck på SPACE för att spela igen</p>
        </div>
    )
}