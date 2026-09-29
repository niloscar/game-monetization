import FormField from '../FormField'
import type { FormBodyProps } from './storeTypes'
import styles from './store.module.css'

export default function FormBodyCreditCard({ formData, errors, handleChange }: FormBodyProps) {
    return (
        <div
            className={`${styles['payment-form']} ${styles['credit-card-form']}`}
        >
            <FormField
                label="Kortnummer"
                type="text"
                name="cardNumber"
                value={formData.cardNumber}
                placeholder="1234 5678 9012 3456"
                pattern="(?:\d\s*){15}\d"
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

            <div className={`field-group ${styles['field-group']}`}>
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
                    placeholder="***"
                    pattern="\d{3,4}"
                    required
                    error={errors.cvc}
                    onChange={handleChange}
                />
            </div>
        </div>
    )
}
