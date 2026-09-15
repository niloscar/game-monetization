import { Link } from "react-router-dom"
import Nav from "./Nav"
import logo from "../assets/pizza-arcade-logo.png"


const Header = () => {

    return (
        
        <header>

            <Link to="/" className="logo-link">
                <img
                height="100px" width="250px"
                 src={logo} 
                 alt="Pizza Arcade" 
                 className="logo"
                 />
            </Link>

             <Nav />

             <div className="auth-links">
                
                <Link to="/login">logga in</Link>
                <Link to="/register">skapa konto</Link>

             </div>

        </header >
    )
}

export default Header