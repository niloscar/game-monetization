interface ButtonProps {
    type?: 'button' | 'submit' | 'reset'
    className?: string
    children: React.ReactNode
}

const Button = ({ type='button', className = '', children, ...props }: ButtonProps) => {
  return (
    <button 
        type={type}
        className={`btn ${className}`}
        {...props}
    >
      {children}
    </button>
  );
};

export default Button;