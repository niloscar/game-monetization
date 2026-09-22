type InputProps = React.InputHTMLAttributes<HTMLInputElement>;

const Input = ({ className = "", ...props }: InputProps) => {
  return <input className={`field-input ${className}`} {...props} />;
};

export default Input;