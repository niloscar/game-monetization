import { useRef, useState } from 'react'
import FormField from '../FormField'
import Button from '../Button'
import type { FormBodyProps } from './storeTypes'
import styles from './store.module.css'

type FormBodyPayPalProps = FormBodyProps & {
    loggedIn: boolean
    onLogin: (container: HTMLElement) => void
}

export default function FormBodyPayPal({
    formData,
    errors,
    handleChange,
    loggedIn,
    onLogin
}: FormBodyPayPalProps) {
    const containerRef = useRef<HTMLDivElement>(null)
    const [loading, setLoading] = useState(false)
    const [loadingDots, setLoadingDots] = useState(0)

    const handleLogin = () => {
        if (!containerRef.current) return

        setLoading(true)

        const interval = setInterval(() => setLoadingDots((dots) => (dots >= 3 ? 0 : dots + 1)), 300)

        setTimeout(() => {
            clearInterval(interval)
            if (containerRef.current) onLogin(containerRef.current)
            setLoading(false)
            setLoadingDots(0)
        }, 2000)
    }

    if (loggedIn) {
        return (
            <div className={`${styles['payment-form']} ${styles['paypal-form']}`}>
                <p className={`${styles['form-description']} ${styles['text-center']}`}>
                    Inloggad på PayPal som {formData.paypalEmail}
                </p>
            </div>
        )
    }

    return (
        <div
            ref={containerRef}
            className={`${styles['payment-form']} ${styles['paypal-form']}`}
        >
            <div className={styles['field-group']}>
                <FormField
                    label="E-postadress"
                    type="email"
                    name="paypalEmail"
                    value={formData.paypalEmail}
                    placeholder="exempel@domän.com"
                    required
                    error={errors.paypalEmail}
                    onChange={handleChange}
                    disabled={loading}
                />

                <FormField
                    label="Lösenord"
                    type="password"
                    name="paypalPassword"
                    value={formData.paypalPassword}
                    placeholder="********"
                    required
                    error={errors.paypalPassword}
                    onChange={handleChange}
                    disabled={loading}
                />
            </div>

            <Button
                type="button"
                className={`btn ${styles['paypal-button']}`}
                onClick={handleLogin}
                disabled={loading}
            >
                {loading ? (
                    <>
                        Loggar in
                        <span className={styles['loading-dots']}>
                            {[1, 2, 3].map((dot) => (
                                <span
                                    key={dot}
                                    className={
                                        dot <= loadingDots
                                            ? ''
                                            : styles['hidden']
                                    }
                                >
                                    .
                                </span>
                            ))}
                        </span>
                    </>
                ) : (
                    'Logga in med PayPal'
                )}
            </Button>
        </div>
    )
}
