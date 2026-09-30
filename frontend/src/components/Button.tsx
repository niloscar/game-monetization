import type { ButtonHTMLAttributes, ReactNode } from 'react'

interface ButtonProps extends ButtonHTMLAttributes<HTMLButtonElement> {
    children: ReactNode
}

const Button = ({ type = 'button', className = '', children, ...props }: ButtonProps) => {
    return (
        <button
            type={type}
            className={`btn ${className}`}
            {...props}
        >
            {children}
        </button>
    )
}

export default Button