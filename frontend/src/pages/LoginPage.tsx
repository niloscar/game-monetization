import { useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import Button from '../components/Button'
import Input from '../components/Input'
import LoginCard from '../components/LoginCard'
import { useAuth } from '../context/AuthContext'

const LoginPage = () => {
    const navigate = useNavigate()
    const { login, error } = useAuth()

    const [email, setEmail] = useState('')
    const [password, setPassword] = useState('')
    const [isLoading, setIsLoading] = useState(false)

    const handleSubmit = async (event: React.SubmitEvent<HTMLFormElement>) => {
        event.preventDefault()

        try {
            setIsLoading(true)

            await login(email, password)

            navigate('/')
        } catch {
        } finally {
            setIsLoading(false)
        }
    }

    return (
        <main>
            <LoginCard>
                <h1>logga in</h1>

                <form onSubmit={handleSubmit}>
                    <div className="field">
                        <label className="field-label" htmlFor="email">
                            e-post
                        </label>

                        <Input
                            id="email"
                            name="email"
                            type="email"
                            autoComplete="email"
                            value={email}
                            onChange={(event) => setEmail(event.target.value)}
                            required
                        />
                    </div>

                    <div className="field">
                        <label className="field-label" htmlFor="password">
                            lösenord
                        </label>

                        <Input
                            id="password"
                            name="password"
                            type="password"
                            autoComplete="new-password"
                            value={password}
                            onChange={(event) =>
                                setPassword(event.target.value)
                            }
                            required
                        />
                    </div>

                    {error && <p className="field-error">{error}</p>}

                    <Button type="submit" disabled={isLoading}>
                        {isLoading ? 'loggar in...' : 'logga in'}
                    </Button>
                </form>

                <p>
                    har du inget konto? <Link to="/register">skapa konto</Link>
                </p>
            </LoginCard>
        </main>
    )
}

export default LoginPage
