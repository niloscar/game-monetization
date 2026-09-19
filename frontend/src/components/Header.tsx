import { Link } from 'react-router-dom'
import { useAuth } from '../context/AuthContext'
import Nav from './Nav'
import logo from '../assets/pizza-arcade-logo-1.png'
import styles from './header.module.css'
import comboIcon from '../assets/combo-icon.png'
import highscoreIcon from '../assets/highscore-icon.png'
import quarterIcon from '../assets/quarter-icon.png'
import adminIcon from '../assets/admin-icon.png'
import { tiers } from '../mock'
import type { User } from '../mock/types'
import { getProfileIconKey } from '../lib/profile'

const profileIcons = {
    quarter: quarterIcon,
    combo: comboIcon,
    highscore: highscoreIcon,
    admin: adminIcon
}

// user.tierId (eller admin-roll) till rätt ikon/färg.
const tierSlugById = new Map(tiers.map((t) => [t.id, t.slug]))

const Header = () => {
    const { user, isAuthenticated } = useAuth()
    const isLoggedIn = isAuthenticated

    const iconKey = user
        ? getProfileIconKey(user as User, tierSlugById)
        : 'quarter'

    return (
        <header className={styles.header}>
            <Link to="/" className={styles.logo}>
                <img src={logo} alt="Pizza Arcade Logo" />
            </Link>

            <Nav />

            <div className={styles.authLinks}>
                {!isLoggedIn ? (
                    <div className={styles.authButtons}>
                        <Link to="/login" className={styles.loginButton}>
                            logga in
                        </Link>

                        <Link to="/register" className={styles.registerButton}>
                            skapa konto
                        </Link>
                    </div>
                ) : (
                    <Link to="/profile" className={styles.profile}>
                        <img src={profileIcons[iconKey]} alt="Profil" />
                    </Link>
                )}
            </div>
        </header>
    )
}

export default Header
