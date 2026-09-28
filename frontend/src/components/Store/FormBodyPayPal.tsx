import { useRef } from 'react'
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

    if (loggedIn) {
        return (
            <div className={`${styles['payment-form']} ${styles['paypal-form']}`}>
                <p className={`${styles['form-description']} ${styles['text-center']}`}>Inloggad med PayPal som {formData.paypalEmail}</p>
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
                />
            </div>

            <Button
                type="button"
                className={`btn ${styles['paypal-button']}`}
                onClick={() => {
                    if (containerRef.current) {
                        onLogin(containerRef.current)
                    }
                }}
            >
                Logga in med PayPal
            </Button>
        </div>
    )
}