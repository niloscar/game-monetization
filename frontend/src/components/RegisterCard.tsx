import styles from "./register-card.module.css";

type RegisterCardProps = {
  children: React.ReactNode;
};

const RegisterCard = ({ children }: RegisterCardProps) => {
  return (
    <div className={styles.registerCard}>
      {children}
    </div>
  );
};

export default RegisterCard;