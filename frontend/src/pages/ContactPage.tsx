import { useState } from "react";
import type { FormEvent } from "react";

// Skickar inget till backend — bara en lokal bekräftelse
const ContactPage = () => {
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [message, setMessage] = useState("");
  const [formError, setFormError] = useState<string | null>(null);
  const [isSubmitted, setIsSubmitted] = useState(false);

  function handleSubmit(e: FormEvent) {
    e.preventDefault();
    setFormError(null);

    const trimmedName = name.trim();
    const trimmedEmail = email.trim();
    const trimmedMessage = message.trim();

    if (!trimmedName || !trimmedEmail || !trimmedMessage) {
      setFormError("Alla fält måste fyllas i.");
      return;
    }

    setIsSubmitted(true);
  }

  function handleSendAnother() {
    setName("");
    setEmail("");
    setMessage("");
    setFormError(null);
    setIsSubmitted(false);
  }

  return (
    <div className="score-page">
      <div className="page-title">
        <h1>KONTAKT</h1>
      </div>

      <div className="card">
        {isSubmitted ? (
          <>
            <p>Tack för ditt meddelande, {name}! Vi hör av oss så snart vi kan.</p>
            <div className="profile-actions">
              <button type="button" className="btn combo" onClick={handleSendAnother}>
                Skicka ett till meddelande
              </button>
            </div>
          </>
        ) : (
          <form className="profile-edit-form" onSubmit={handleSubmit}>
            <label className="field">
              <span className="field-label">Namn</span>
              <input
                type="text"
                className="field-input"
                value={name}
                onChange={(e) => setName(e.target.value)}
                autoComplete="name"
                required
              />
            </label>
            <label className="field">
              <span className="field-label">E-post</span>
              <input
                type="email"
                className="field-input"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                autoComplete="email"
                required
              />
            </label>
            <label className="field">
              <span className="field-label">Meddelande</span>
              <textarea
                className="field-input"
                value={message}
                onChange={(e) => setMessage(e.target.value)}
                rows={5}
                required
              />
            </label>

            {formError && <p className="field-error">{formError}</p>}

            <div className="profile-actions">
              <button type="submit" className="btn combo">
                Skicka
              </button>
            </div>
          </form>
        )}
      </div>
    </div>
  );
};

export default ContactPage;