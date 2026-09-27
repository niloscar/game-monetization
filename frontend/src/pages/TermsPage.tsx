const TermsPage = () => {
  return (
    <div className="score-page">
      <div className="page-title">
        <h1>VILLKOR & INTEGRITETSPOLICY</h1>
      </div>

      <div className="card">
        <p className="profile-meta">
          Pizza Arcade är ett skolprojekt och ingen riktig kommersiell tjänst. Köp,
          betalningsmetoder och kvitton i appen är testdata — inga riktiga pengar eller
          verkliga betalningar hanteras. Den här sidan finns för att visa hur en
          villkors-/integritetssida skulle kunna se ut i en riktig produkt.
        </p>
      </div>

      {/* ================= VILLKOR ================= */}
      <div className="card">
        <div className="card-head">
          <h2>VILLKOR</h2>
        </div>

        <h3>Konto</h3>
        <p>
          För att spara scores, delta på topplistan och köpa nivåer behöver du skapa ett
          konto med användarnamn, e-postadress och lösenord. Du ansvarar för att hålla ditt
          lösenord hemligt och för aktivitet som sker via ditt konto.
        </p>

        <h3>Nivåer (Quarter Pass, Combo Pass, High Score Access)</h3>
        <p>
          Vissa delar av appen — som utökad topplista, statistik och prestationer — kräver
          en viss nivå. Nivåer "köps" via butiken i appen. Eftersom det här är ett
          skolprojekt är alla köp och betalningsmetoder fiktiva.
        </p>

        <h3>Uppförande</h3>
        <p>
          Du får inte använda kontot för att fuska med scores, störa andra spelares
          upplevelse, eller försöka kringgå åtkomstbegränsningar för nivåer du inte äger.
        </p>

        <h3>Ändringar</h3>
        <p>
          Villkoren kan komma att uppdateras allt eftersom projektet utvecklas. Väsentliga
          ändringar meddelas i appen.
        </p>
      </div>

      {/* ================= INTEGRITETSPOLICY ================= */}
      <div className="card">
        <div className="card-head">
          <h2>INTEGRITETSPOLICY</h2>
        </div>

        <h3>Vilka uppgifter vi sparar</h3>
        <p>
          Vi sparar användarnamn, e-postadress och ett hashat lösenord (aldrig lösenordet i
          klartext) för ditt konto, samt dina scores, köpta nivåer och eventuella beställningar
          du gör i appen.
        </p>

        <h3>Cookies</h3>
        <p>
          Appen använder en sessions-cookie för att hålla dig inloggad. Den innehåller inget
          annat än en teknisk sessionsidentifierare och används inte för spårning eller
          marknadsföring.
        </p>

        <h3>Vad dina uppgifter används till</h3>
        <p>
          Dina uppgifter används för att driva kontofunktioner (inloggning, profil,
          topplista, köp) — inget säljs vidare eller delas med tredje part, eftersom det
          inte finns någon tredje part i det här skolprojektet.
        </p>

        <h3>Vem som kan se vad</h3>
        <p>
          Ditt användarnamn och dina scores är synliga för andra inloggade användare på
          topplistan och din publika profil. E-postadress, lösenord och köphistorik är
          privat och syns bara för dig.
        </p>

        <h3>Radera ditt konto</h3>
        <p>
          Vill du få ditt konto och dina uppgifter borttagna, kontakta gruppen bakom
          projektet.
        </p>
      </div>
    </div>
  );
};

export default TermsPage;