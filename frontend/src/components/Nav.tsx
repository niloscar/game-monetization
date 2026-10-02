import { NavLink } from 'react-router-dom'
import { useAuth } from '../context/useAuth'
import styles from './nav.module.css'

const Nav = () => {
    const { isAdmin, user } = useAuth()
    const isAuthenticated = !!user
    const tierLevel = user?.tier?.level ?? 0

    // TODO: Get tier level from backend instead of hardcoding it here. This is just a temporary solution until we have a proper backend implementation.

    return (
        <nav className={styles.nav}>
            <ul className={styles.list}>
                <li>
                    <NavLink to="/" className={styles.link}>
                        hem
                    </NavLink>
                </li>

                {isAuthenticated && tierLevel >= 1 && (
                    <li>
                        <NavLink to="/scoreboard" className={styles.link}>
                            scoreboard
                        </NavLink>
                    </li>
                )}

                <li>
                    <NavLink to="/about" className={styles.link}>
                        om oss
                    </NavLink>
                </li>

                {isAuthenticated && (
                    <li>
                        <NavLink to="/store" className={styles.link}>
                            store
                        </NavLink>
                    </li>
                )}

                {isAdmin && (
                    <li>
                        <NavLink to="/admin" className={styles.link}>
                            admin
                        </NavLink>
                    </li>
                )}
            </ul>
        </nav>
    )
}

export default Nav
