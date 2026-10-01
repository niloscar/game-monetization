import { Link } from 'react-router-dom'
import { useAuth } from '../../context/useAuth'
import styles from './upgrade-alert.module.css'

export default function UpgradeAlert() {
    const { isAuthenticated, user } = useAuth()
    const userTierLevel = user?.tier?.level ?? 0


    if (!isAuthenticated) {
        return (
            <div className={styles['upgrade-alert']}>
                <span>
                    Hur går det egentligen? Logga in eller skapa ett
                    kostnadsfritt konto för att se din poäng!
                </span>
                <div className={styles['button-group']}>
                    <Link to="/login" className={styles['login-link']}>
                        Logga in
                    </Link>
                    <Link to="/register" className={styles['register-link']}>
                        Skapa konto
                    </Link>
                </div>
            </div>
        )
    }

    if (userTierLevel === 0) {
        return (
            <div className={styles['upgrade-alert']}>
                <span>
                    Vill du se hur du ligger till jämfört med tidigare?
                    Uppgradera för att få tillgång till ditt personliga high
                    score!
                </span>
                <Link to="/store" className={styles['upgrade-link']}>
                    Uppgradera nu
                </Link>
            </div>
        )
    }

    if (userTierLevel === 1) {
        return (
            <div className={styles['upgrade-alert']}>
                <span>
                    Trött på avbrott? Uppgradera till Combo Pass och spela utan
                    pre-game-reklam!
                </span>
                <Link to="/store" className={styles['upgrade-link']}>
                    Uppgradera nu
                </Link>
            </div>
        )
    }

    if (userTierLevel === 2) {
        return (
            <div className={styles['upgrade-alert']}>
                <span>
                    Trött på reklam? Uppgradera till High Score Access för ett
                    reklamfritt spel och möjlighet att jämföra dina resultat med
                    andra spelare.
                </span>
                <Link to="/store" className={styles['upgrade-link']}>
                    Uppgradera nu
                </Link>
            </div>
        )
    }

    return null
}
