import { useRef, useState } from 'react'
import FormField from '../FormField'
import Button from '../Button'
import type { FormBodyProps } from './storeTypes'
import styles from './store.module.css'
import LoadingDots from '../LoadingDots'

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

    const handleLogin = () => {
        if (!containerRef.current) return

        setLoading(true)

        setTimeout(() => {
            if (containerRef.current) onLogin(containerRef.current)
            setLoading(false)
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
                        <LoadingDots />
                    </>
                ) : (
                    'Logga in med PayPal'
                )}
            </Button>
        </div>
    )
}
