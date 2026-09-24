import styles from './login-card.module.css'

type LoginCardProps = {
    children: React.ReactNode
}

const LoginCard = ({ children }: LoginCardProps) => {
    return <div className={styles['login-card']}>{children}</div>
}

export default LoginCard
