import { Link } from 'react-router-dom'
import { useAuth } from '../context/useAuth'
import styles from './upgrade-alert.module.css'

export default function UpgradeAlert({ showPreGameAd }: { showPreGameAd: boolean }) {
    const { isAuthenticated, user } = useAuth()
    const userTierLevel = user?.tier?.level ?? 0

    if (!isAuthenticated) {
        return (
            <div className={styles['upgrade-alert']}>
                <span>Hur går det för dig egentligen? Logga in eller skapa ett konto helt kostnadsfritt och se din poäng!</span>
                <Link to="/register" className={styles['upgrade-link']}>
                    Skapa konto
                </Link>
            </div>
        )
    }

    if (userTierLevel === 1 && showPreGameAd) {
        return (
            <div className={styles['upgrade-alert']}>
                <span>Trött på blockerande reklam? Uppgradera till Combo Pass för att kunna spela utan avbrott.</span>
                <Link to="/store" className={styles['upgrade-link']}>
                    Uppgradera nu
                </Link>
            </div>
        )
    }

    if (userTierLevel < 3) {
        return (
            <div className={styles['upgrade-alert']}>
                <span>Trött på störande reklam? Uppgradera till High Score Access för att slippa reklam i spelet och för att kunna jämföra ditt resultat med andra spelares resultat.</span>
                <Link to="/store" className={styles['upgrade-link']}>
                    Uppgradera nu
                </Link>
            </div>
        )
    }

    return null
}