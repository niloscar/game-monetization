import { NavLink } from 'react-router-dom'

const Nav = () => {
    const isAdmin = true

    return (
        <nav>
            <ul>
                <li>
                    <NavLink to="/">hem</NavLink>
                </li>

                <li>
                    <NavLink to="/scoreboard">scoreboard</NavLink>
                </li>

                <li>
                    <NavLink to="/about">om oss</NavLink>
                </li>

                {isAdmin && (
                    <li>
                        <NavLink to="/admin">admin</NavLink>
                    </li>
                )}
            </ul>
        </nav>
    )
}

export default Nav
