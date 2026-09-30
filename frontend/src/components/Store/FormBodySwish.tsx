import FormField from '../FormField'
import type { FormBodyProps } from './storeTypes'
import styles from './store.module.css'

export default function FormBodySwish({ formData, errors, handleChange }: FormBodyProps) {
    return (
        <div className={`${styles['payment-form']} ${styles['swish-form']}`}>
            <FormField
                label="Mobilnummer"
                type="text"
                name="swishNumber"
                value={formData.swishNumber}
                placeholder="0701234567"
                pattern="\d{10}"
                required
                error={errors.swishNumber}
                onChange={handleChange}
            />
        </div>
    )
}