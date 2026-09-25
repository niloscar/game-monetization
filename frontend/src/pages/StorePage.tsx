import { useState } from 'react'
import Button from '../components/Button'
import FormField from '../components/FormField'
import type { ChangeEvent } from 'react'

const MOCK_TIERS = [
    {
        name: 'Quarter pass',
        price: 29,
        period: 'mån',
        features: [
            { name: 'Full spelåtkomst', included: true, icon: 'fa-gamepad' },
            { name: 'Mycket reklam', included: true, icon: 'fa-ad' },
            { name: 'Ser maxpoäng', included: true, icon: 'fa-trophy' },
            { name: 'Ej speltid/high score', included: false, icon: 'fa-times' }
        ],
        mostPopular: false
    },
    {
        name: 'Combo pass',
        price: 59,
        period: 'mån',
        features: [
            { name: 'Full spelåtkomst', included: true, icon: 'fa-gamepad' },
            { name: 'En del reklam', included: true, icon: 'fa-ad' },
            { name: 'Maxpoäng + speltid', included: true, icon: 'fa-trophy' },
            { name: 'Ej high score/support', included: true, icon: 'fa-times' }
        ],
        mostPopular: true
    },
    {
        name: 'High score access',
        price: 99,
        period: 'mån',
        features: [
            { name: 'Full spelåtkomst', included: true, icon: 'fa-gamepad' },
            { name: 'Ingen reklam', included: true, icon: 'fa-ban' },
            {
                name: 'Full statistik + high score',
                included: true,
                icon: 'fa-chart-line'
            },
            { name: 'Prioriterad support', included: true, icon: 'fa-headset' }
        ],
        mostPopular: false
    }
]

const validationMessages: Record<string, string> = {
    cardNumber: 'Ange ett giltigt kortnummer.',
    expiryDate: 'Ange datum som MM/ÅÅ.',
    cvc: 'CVC ska innehålla 3–4 siffror.'
}

const StorePage = () => {
    const [formData, setFormData] = useState({
        cardNumber: '',
        cardName: '',
        expiryDate: '',
        cvc: ''
    })

    const [errors, setErrors] = useState<Record<string, string>>({})

    const handleChange = (e: ChangeEvent<HTMLInputElement>) => {
        const { name, value } = e.target
        setFormData((prev) => ({ ...prev, [name]: value }))
    }

    const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
        e.preventDefault()

        const form = e.currentTarget
        const newErrors: Record<string, string> = {}

        const inputs = form.querySelectorAll<HTMLInputElement>('input')

        inputs.forEach((input) => {
            if (input.validity.valueMissing) {
                newErrors[input.name] = 'Fältet måste fyllas i.'
            } else if (input.validity.patternMismatch) {
                newErrors[input.name] = validationMessages[input.name] ?? 'Fältet har fel format.'
            }
        })

        setErrors(newErrors)

        if (Object.keys(newErrors).length > 0) return

        // Fortsätt med köpet
    }

    return (
        <main>
            <h1>Välj din nivå</h1>
            <p>Avsluta eller byt nivå när du vill</p>

            <section className="tier-grid">
                {MOCK_TIERS.map((tier) => (
                    <article
                        className={`tier-card ${tier.mostPopular ? 'most-popular' : undefined}`}
                        key={tier.name}
                    >
                        {tier.mostPopular && (
                            <div className="most-popular-badge">
                                Mest populär
                            </div>
                        )}
                        <h2>{tier.name}</h2>
                        <p className="tier-price">
                            <span className="tier-price-amount">{tier.price} kr</span>
                            <span className="tier-price-period">/{tier.period}</span>
                        </p>
                        <ul>
                            {tier.features.map((feature) => (
                                <li
                                    key={feature.name}
                                    className={ feature.included ? 'included' : 'not-included' }
                                >
                                    <i className={`icon feature-icon ${feature.included ? feature.icon : 'fa-xmark'}`}></i>
                                    <span>{feature.name}</span>
                                </li>
                            ))}
                        </ul>
                    </article>
                ))}
            </section>

            <section className="payment">
                <h2>Betalsätt</h2>
                <div className="payment-methods-grid">
                    <button className="payment-method">
                        <i className="icon fa-credit-card"></i>
                        <span>Kort</span>
                    </button>
                    <button className="payment-method">
                        <i className="icon fa-paypal"></i>
                        <span>Swish</span>
                    </button>
                    <button className="payment-method">
                        <i className="icon fa-apple-pay"></i>
                        <span>Paypal</span>
                    </button>
                </div>

                <form
                    onSubmit={handleSubmit}
                    className="credit-card-form"
                    noValidate
                >
                    <FormField
                        label="Kortnummer"
                        type="text"
                        name="cardNumber"
                        value={formData.cardNumber}
                        placeholder="1234 5678 9012 3456"
                        pattern="\d{4} \d{4} \d{4} \d{4}"
                        required
                        error={errors.cardNumber}
                        onChange={handleChange}
                    />

                    <FormField
                        label="Namn på kort"
                        type="text"
                        name="cardName"
                        value={formData.cardName}
                        placeholder="Förnamn Efternamn"
                        pattern="[\p{L}\p{M}]+(?:[ '\-’][\p{L}\p{M}]+)*"
                        required
                        error={errors.cardName}
                        onChange={handleChange}
                    />

                    <FormField
                        label="Giltig till"
                        type="text"
                        name="expiryDate"
                        value={formData.expiryDate}
                        placeholder="MM/ÅÅ"
                        pattern="\d{2}/\d{2}"
                        required
                        error={errors.expiryDate}
                        onChange={handleChange}
                    />

                    <FormField
                        label="CVC"
                        type="text"
                        name="cvc"
                        value={formData.cvc}
                        placeholder="CVC"
                        pattern="\d{3,4}"
                        required
                        error={errors.cvc}
                        onChange={handleChange}
                    />

                    <div className="order-summary">
                        <div className="order-item">
                            <span>Combo pass</span>
                            <span>59 kr</span>
                        </div>
                        <div className="order-tax">
                            <span>Moms (25%)</span>
                            <span>Ingår</span>
                        </div>
                        <div className="order-total">
                            <span>Att betala</span>
                            <span>59 kr</span>
                        </div>
                    </div>

                    <Button type="submit" className="btn-confirm-purchase">
                        Bekräfta köp
                    </Button>

                    <p>
                        Detta är ett låtsasbetalsteg – ingen riktig betalning
                        sker
                    </p>
                </form>
            </section>
        </main>
    )
}

export default StorePage
