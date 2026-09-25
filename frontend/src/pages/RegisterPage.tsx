import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import Button from "../components/Button";
import RegisterCard from "../components/RegisterCard";
import Input from "../components/Input";

type RegisterForm = {
  username: string;
  email: string;
  password: string;
  confirmPassword: string;
  termsAccepted: boolean;
};

type RegisterError = {
  message?: string;
};

const RegisterPage = () => {
  const navigate = useNavigate();

  const [formData, setFormData] = useState<RegisterForm>({
    username: "",
    email: "",
    password: "",
    confirmPassword: "",
    termsAccepted: false,
  });

  const [error, setError] = useState("");
  const [isLoading, setIsLoading] = useState(false);

  const handleChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value, type, checked } = event.target;

    setFormData((previous) => ({
      ...previous,
      [name]: type === "checkbox" ? checked : value,
    }));
  };

  const handleSubmit = async (
    event: React.SubmitEvent<HTMLFormElement>,
  ) => {
    event.preventDefault();

    setError("");

    if (formData.password !== formData.confirmPassword) {
      setError("Lösenorden matchar inte.");
      return;
    }

    if (!formData.termsAccepted) {
      setError("Du måste godkänna villkoren.");
      return;
    }

    const { username, email, password } = formData;

    try {
      setIsLoading(true);

      const response = await fetch(
         "/api/user",
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            username,
            email,
            password,
          }),
        },
      );

      const data: RegisterError = await response.json();

      if (!response.ok) {
        setError(data.message || "Kunde inte skapa kontot.");
        return;
      }

      navigate("/");
    } catch {
      setError("Kunde inte ansluta till servern.");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <main>
      <RegisterCard>
        <h1>skapa konto</h1>

        <p>spara dina poäng och kliv upp på scoreboarden</p>

        <form onSubmit={handleSubmit}>
          <div className="field">
            <label className="field-label" htmlFor="username">
              användarnamn
            </label>

            <Input
              id="username"
              name="username"
              type="text"
              value={formData.username}
              onChange={handleChange}
              required
            />
          </div>

          <div className="field">
            <label className="field-label" htmlFor="email">
              e-post
            </label>

            <Input
              id="email"
              name="email"
              type="email"
              value={formData.email}
              onChange={handleChange}
              required
            />
          </div>

          <div className="field">
            <label className="field-label" htmlFor="password">
              lösenord
            </label>

            <Input
              id="password"
              name="password"
              type="password"
              autoComplete="new-password"
              value={formData.password}
              onChange={handleChange}
              required
            />
          </div>

          <div className="field">
            <label className="field-label" htmlFor="confirmPassword">
              bekräfta lösenord
            </label>

            <Input
              id="confirmPassword"
              name="confirmPassword"
              type="password"
              autoComplete="new-password"
              value={formData.confirmPassword}
              onChange={handleChange}
              required
            />
          </div>

          <label>
            <input
              type="checkbox"
              name="termsAccepted"
              checked={formData.termsAccepted}
              onChange={handleChange}
            />

            jag godkänner villkoren
          </label>

          {error && <p className="field-error">{error}</p>}

          <Button type="submit" disabled={isLoading || !formData.termsAccepted}>
            {isLoading ? "skapar konto..." : "skapa konto"}
          </Button>
        </form>

        <p>
          har du redan ett konto? <Link to="/login">logga in</Link>
        </p>
      </RegisterCard>
    </main>
  );
};

export default RegisterPage;