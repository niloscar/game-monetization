import { NavLink } from 'react-router-dom'
import { useAuth } from '../context/AuthContext'
import styles from './nav.module.css'

const Nav = () => {
    const { isAdmin } = useAuth()

    return (
        <nav className={styles.nav}>
            <ul className={styles.list}>
                <li>
                    <NavLink to="/" className={styles.link}>
                        hem
                    </NavLink>
                </li>

                <li>
                    <NavLink to="/scoreboard" className={styles.link}>
                        scoreboard
                    </NavLink>
                </li>

                <li>
                    <NavLink to="/about" className={styles.link}>
                        om oss
                    </NavLink>
                </li>

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
