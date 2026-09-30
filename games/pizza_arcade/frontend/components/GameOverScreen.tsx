import styles from './game-over-screen.module.css'

export default function GameOverScreen() {
    return (
        <div className={styles['game-over-screen']}>
            <h1>GAME OVER</h1>
            <p>Press space to play again</p>
        </div>
    )
}