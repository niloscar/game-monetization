import styles from './start-screen.module.css'

export default function StartScreen() {
    return (
        <div className={styles['start-screen']}>
            <h1>Pizza Arcade</h1>
            <p>Press space to play</p>
        </div>
    )
}