# Game Monetization – Plattform för intäktsgenerering

## 1. Projektbeskrivning

Projektet syftar till att utveckla en webbaserad plattform som möjliggör intäktsgenerering kring befintliga spel genom reklam och engångsköp.

Fokus ligger på användarhantering, betalningar och åtkomst till innehåll snarare än på spelutveckling. *Pizza Arcade* används som exempelspel.

### Planerad funktionalitet

- **Användarhantering:** Registrering, inloggning och kunduppgifter.
- **Produktpaket:** Engångsköp av funktioner och power-ups.
- **Beställningar:** Betalningar, orderhantering och prishistorik.
- **Åtkomstkontroll:** Behörighet baserad på köpta paket.
- **Reklam:** Hantering och visning av annonser.
- **Topplistor:** Registrering och visning av spelresultat.
- **Administration:** Hantering av användare, produkter, innehåll och annonser.

## 2. Förhandsvisning

Applikationen driftsätts via Vercel.

[Öppna förhandsvisningen](https://game-monetization.vercel.app)

## 3. Tech stack

| Område | Teknik |
|---|---|
| Frontend | React, TypeScript, Vite |
| Backend | Node.js, Express, TypeScript |
| Databas | PostgreSQL, Neon |
| Driftsättning | Vercel |
| Versionshantering | Git, GitHub |

## 4. Projektstruktur

```text
/
├── frontend/       # React
├── backend/        # Express API
├── docs/           # Dokumentation
└── README.md
```

Frontend kommunicerar med backend via ett REST API. Backend hanterar affärslogik, behörighet och kommunikationen med PostgreSQL-databasen på Neon.

## 5. Kom igång

### Installation

Node.js, npm och Git krävs.

Klona projektet och installera beroenden:

```bash
git clone https://github.com/niloscar/game-monetization.git
cd game-monetization

npm install
npm install --prefix frontend
npm install --prefix backend
```

### Miljövariabler

Skapa separata `.env`-filer för frontend och backend.

**Frontend (`frontend/.env`):**

```dotenv
VITE_API_URL=http://localhost:3000
```

**Backend (`backend/.env`):**

Konfigurera serverinställningar, databasanslutning och säkerhetsnycklar enligt projektets miljövariabler.

Känsliga uppgifter får inte versionshanteras eller exponeras i frontend.

### Starta utvecklingsmiljön

Starta backend:

```bash
npm run dev --prefix backend
```

Starta frontend i en separat terminal:

```bash
npm run dev --prefix frontend
```

Kommandona körs från projektets rot.

## 6. Utvecklingskonventioner

### Namnkonventioner

| Typ | Konvention | Exempel |
|---|---|---|
| Mappar och CSS-filer | kebab-case | `user-profile/` |
| React-komponenter och typer | PascalCase | `UserProfile.tsx` |
| Variabler, funktioner och övriga TS-filer | camelCase | `getUserById()` |
| Konstanter och miljövariabler | UPPER_SNAKE_CASE | `MAX_RETRIES` |
| Databastabeller och kolumner | snake_case | `order_items` |
| API-endpoints | kebab-case | `/api/order-items` |

### Git

- `main` innehåller projektets stabila version.
- Ändringar utvecklas i separata brancher och mergas via pull requests.
- Pull requests ska granskas innan de mergas.

Brancher namnges enligt `typ/kort-beskrivning`:

| Prefix | Användning |
|---|---|
| `feat/` | Ny funktionalitet |
| `fix/` | Buggfixar |
| `docs/` | Dokumentation |
| `refactor/` | Omstrukturering |
| `test/` | Tester |
| `chore/` | Underhåll |

Commit-meddelanden skrivs på engelska enligt Conventional Commits, exempelvis `feat: implement user registration`.

### Kodstandard

- TypeScript används i frontend och backend.
- 4 mellanslag används för indrag.
- Semikolon utelämnas där de inte krävs.
- Enkla citattecken används där det är möjligt.
- Funktioner och moduler ska ha tydliga ansvarsområden.
- Prettier används för formatering och ESLint för statisk kodanalys.

## 7. Tester och kvalitetssäkring

Varje utvecklare ansvarar för att testa sin kod manuellt innan ändringarna pushas.

Kontrollera att funktionaliteten fungerar, att befintlig kod inte påverkas negativt och att projektet kan byggas utan fel.

Kodstandarden kontrolleras med:

```bash
npm run format:check
```

## 8. Dokumentation

Kompletterande dokumentation finns i `docs/`.

- [Uppgiftsbeskrivning](docs/assignment-description.md)
- [Checklista för uppgiftskrav](docs/assignment-checklist.md)
- [Databasdesign](docs/database-design.md)
- [ER-diagram](docs/er-diagram.png)
- [API-dokumentation](docs/api.md)

Frontend och backend driftsätts via Vercel och databasen via Neon. Miljövariabler för driftsättning hanteras i Vercels projektinställningar.
