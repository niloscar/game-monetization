import styles from "./form-field.module.css"

interface FormFieldProps {
    label: string
    type: string
    name: string
    value: string
    placeholder?: string
    required?: boolean
    pattern?: string
    error?: string
    onChange: (e: React.ChangeEvent<HTMLInputElement>) => void
}

export default function FormField(props: FormFieldProps) {
    const { label, type, name, value, placeholder, required, pattern, error, onChange } = props;

    return (
        <div className={styles['form-field']}>
            <label htmlFor={name}>{label}</label>

            <input
                type={type}
                id={name}
                name={name}
                placeholder={placeholder}
                value={value}
                onChange={onChange}
                required={required}
                pattern={pattern}
                aria-invalid={Boolean(error)}
            />

            {error && (
                <p className={styles['error-message']}>
                    {error}
                </p>
            )}
        </div>
    );
}