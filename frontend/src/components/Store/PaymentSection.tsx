import { useState } from 'react'
import FormBodyCreditCard from './FormBodyCreditCard'
import FormBodyPayPal from './FormBodyPayPal'
import FormBodySwish from './FormBodySwish'
import Button from '../Button'
import { Coins, CreditCard, LetterP } from 'pixelarticons/react'
import styles from './store.module.css'



import type { ChangeEvent, FormEvent } from 'react'
import type { Cart } from './storeTypes'
import LoadingDots from '../LoadingDots'

const validationMessages: Record<string, string> = {
    cardNumber: 'Ange ett giltigt kortnummer',
    expiryDate: 'Ange datum som MM/ÅÅ',
    cvc: 'CVC ska innehålla 3–4 siffror',
    swishNumber: 'Ange ett giltigt telefonnummer',
    paypalEmail: 'Ange en giltig e-postadress'
}

const paymentMethods = [
    { id: 'card', name: 'Kort', icon: CreditCard },
    { id: 'swish', name: 'Swish', icon: Coins },
    { id: 'paypal', name: 'Paypal', icon: LetterP }
] as const

type PaymentMethod = (typeof paymentMethods)[number]['id']

interface PaymentSectionProps {
    cart: Cart
    onSubmit: (paymentMethod: PaymentMethod) => Promise<void>
}

export default function PaymentSection({ cart, onSubmit }: PaymentSectionProps) {
    const [formData, setFormData] = useState({
        cardNumber: '',
        cardName: '',
        expiryDate: '',
        cvc: '',
        swishNumber: '',
        paypalEmail: '',
        paypalPassword: ''
    })

    const [paymentMethod, setPaymentMethod] = useState<PaymentMethod>('card')
    const [errors, setErrors] = useState<Record<string, string>>({})
    const [isSubmitting, setIsSubmitting] = useState(false)
    const [submitted, setSubmitted] = useState(false)
    const [paypalLoggedIn, setPaypalLoggedIn] = useState(false)

    const validateInput = (input: HTMLInputElement) => {
        if (input.validity.valueMissing) {
            return 'Fältet måste fyllas i'
        }

        if (input.validity.patternMismatch || input.validity.typeMismatch) {
            return validationMessages[input.name] ?? 'Fältet har fel format'
        }

        return ''
    }

    const validateInputs = (inputs: Iterable<HTMLInputElement>) => {
        const newErrors: Record<string, string> = {}

        for (const input of inputs) {
            const error = validateInput(input)

            if (error) {
                newErrors[input.name] = error
            }
        }

        return newErrors
    }

    const handleChange = (e: ChangeEvent<HTMLInputElement>) => {
        const { name, value } = e.target

        setFormData((prev) => ({ ...prev, [name]: value }))

        if (!submitted) return

        const error = validateInput(e.target)

        setErrors((prev) => {
            const newErrors = { ...prev }

            if (error) {
                newErrors[name] = error
            } else {
                delete newErrors[name]
            }

            return newErrors
        })
    }

    const handlePaymentMethodChange = (method: PaymentMethod) => {
        setPaymentMethod(method)
        setErrors({})
        setSubmitted(false)
        setPaypalLoggedIn(false)
    }

    const handlePayPalLogin = (container: HTMLElement) => {
        const inputs = container.querySelectorAll<HTMLInputElement>('input')
        const newErrors = validateInputs(inputs)

        setErrors(newErrors)

        if (Object.keys(newErrors).length > 0) return

        setPaypalLoggedIn(true)
    }

    const handleSubmit = async (e: FormEvent<HTMLFormElement>) => {
        e.preventDefault()

        if (isSubmitting) return

        setSubmitted(true)

        const inputs = e.currentTarget.querySelectorAll<HTMLInputElement>('input')
        const newErrors = validateInputs(inputs)

        setErrors(newErrors)

        if (Object.keys(newErrors).length > 0) return

        setIsSubmitting(true)

        try {
            await onSubmit(paymentMethod)
        } finally {
            setIsSubmitting(false)
        }
    }

    const orderSum = cart.items.reduce((acc, item) => acc + item.price, 0)

    const cardFormReady = Boolean(
        formData.cardNumber &&
        formData.cardName &&
        formData.expiryDate &&
        formData.cvc
    )

    const swishFormReady = Boolean(formData.swishNumber)

    const paymentReady =
        (paymentMethod === 'card' && cardFormReady) ||
        (paymentMethod === 'swish' && swishFormReady) ||
        (paymentMethod === 'paypal' && paypalLoggedIn)

    return (
        <section className={styles['payment-section']}>
            <h2>Betalsätt</h2>

            <div className={styles['payment-methods-grid']}>
                {paymentMethods.map((method) => {
                    const Icon = method.icon

                    return (
                        <button
                            key={method.id}
                            type="button"
                            className={paymentMethod === method.id ? styles.selected : ''}
                            onClick={() => handlePaymentMethodChange(method.id)}
                        >
                            <Icon className={styles['payment-icon']} />
                            <span>{method.name}</span>
                        </button>
                    )
                })}
            </div>

            <form onSubmit={handleSubmit} noValidate>
                {paymentMethod === 'card' && (
                    <FormBodyCreditCard formData={formData} errors={errors} handleChange={handleChange} />
                )}

                {paymentMethod === 'swish' && (
                    <FormBodySwish formData={formData} errors={errors} handleChange={handleChange} />
                )}

                {paymentMethod === 'paypal' && (
                    <FormBodyPayPal
                        formData={formData}
                        errors={errors}
                        handleChange={handleChange}
                        loggedIn={paypalLoggedIn}
                        onLogin={handlePayPalLogin}
                    />
                )}

                <div className={styles['order-summary']}>
                    {cart.items.map((item) => (
                        <div className={styles['order-item']} key={item.id}>
                            <span>{item.name}</span>
                            <span>{item.price} kr</span>
                        </div>
                    ))}

                    <div className={styles['order-tax']}>
                        <span>Moms (25%)</span>
                        <span>Ingår</span>
                    </div>

                    <div className={styles['order-total']}>
                        <span>Att betala</span>
                        <span>{orderSum} kr</span>
                    </div>
                </div>

                <Button
                    type="submit"
                    disabled={!paymentReady || isSubmitting}
                    className={styles['btn-confirm-purchase']}
                >
                    {isSubmitting ? (
                        <>
                            Genomför köp<LoadingDots />
                        </>
                    ) : (
                        `Betala ${orderSum} kr`
                    )}
                </Button>

                <p className={styles['disclaimer']}>
                    Detta är ett låtsasbetalsteg – ingen riktig betalning sker
                </p>
            </form>
        </section>
    )
}