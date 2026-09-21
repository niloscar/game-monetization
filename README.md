# Game Monetization – Plattform för intäktsgenerering

## 1. Projektbeskrivning

Projektet syftar till att utveckla en speloberoende webbplattform som möjliggör intäktsgenerering kring befintliga spel genom reklam och engångsköp.

Fokus ligger på användarhantering, betalningar och åtkomst till innehåll snarare än på spelutveckling. Plattformen utformas för att spel ska kunna bytas ut med så få ändringar som möjligt. *Pizza Arcade* används som exempelspel.

### Planerad funktionalitet

- **Användarhantering:** Registrering, inloggning och kunduppgifter.
- **Produktpaket:** Engångsköp av funktioner och power-ups.
- **Beställningar:** Betalningar, orderhantering och prishistorik.
- **Åtkomstkontroll:** Behörighet baserad på köpta paket.
- **Reklam:** Hantering och visning av annonser.
- **Topplistor:** Registrering och visning av spelresultat.
- **Administration:** Hantering av användare, produkter, innehåll och annonser.
- **Spelintegration:** Stöd för utbytbara spelmoduler genom gemensamma gränssnitt.

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

Projektet har en modulär struktur där plattformen och spelen hålls separerade genom tydligt definierade gränssnitt.

```text
/
├── frontend/              # Plattformens React-applikation
│   └── src/
│       ├── components/    # Gemensamma komponenter
│       ├── pages/         # Plattformens sidor
│       ├── services/      # API-kommunikation
│       └── game/          # Integration och registrering av spel
│
├── backend/               # Plattformens Express API
│   └── src/
│       ├── routes/        # API-endpoints
│       ├── services/      # Affärslogik
│       ├── types/         # Backend-specifika typer
│       ├── game/          # Spelintegration och resultatvalidering
│       ├── database.ts
│       └── server.mts
│
├── games/                 # Utbytbara spelmoduler
│   └── pizza/
│       ├── frontend/      # Spelets React-komponenter och logik
│       ├── backend/       # Spelspecifik serverlogik
│
├── shared/                # Gemensamma typer för plattform och spel
│   └── game.ts
│
├── docs/                  # Dokumentation
├── package.json
├── vercel.json
└── README.md
```

### Arkitektur och ansvarsfördelning

**Plattformen** ansvarar för användare, köp, behörigheter, reklam, spelomgångar och resultatlagring.

**Spelmodulerna** ansvarar för sin egen presentation, spellogik och spelspecifika funktioner.

**Gemensamma kontrakt** i `shared/` definierar hur plattformen och spelen kommunicerar.

Frontend kommunicerar med backend via ett REST API. Backend hanterar affärslogik, behörighet och kommunikationen med PostgreSQL-databasen på Neon.

### Spelintegration

Spelen integreras genom ett gemensamt gränssnitt. Plattformen startar spelet och skickar nödvändig information, exempelvis spelomgångens ID och tillgängliga power-ups.

Spelet rapporterar tillbaka resultat och avslut genom definierade callbacks.

Varje spel registreras i plattformens spelregister och beskriver sitt innehåll genom ett manifest.

Spelmoduler ska inte vara direkt beroende av plattformens interna implementationer.

### Power-ups

Plattformen hanterar köp, ägande och behörighet till power-ups. Vid spelstart kontrollerar backend användarens tillgång och skapar en spelomgång med godkända power-ups.

Spelet tar emot dessa som identifierare och ansvarar för att implementera deras effekter.

Backend ansvarar för att kontrollera behörighet och förbrukning samt verifiera spelresultat enligt den valideringsmetod som implementeras.

Detta gör det möjligt att byta spel utan att förändra plattformens grundläggande köp- och behörighetssystem.

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

```dotenv
NODE_ENV=development
HOST=localhost
PORT=3000
DB_HOST=
DB_PORT=
DB_USER=
DB_PASSWORD=
DB_NAME=
SESSION_SECRET=
SALT_ROUNDS=
SALT_SECRET=
```

Fyll i databasuppgifter från Neon och generera egna säkerhetsnycklar. Känsliga uppgifter får inte versionshanteras eller exponeras i frontend.

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
- Spelspecifik kod ska hållas separerad från plattformens affärslogik.

## 7. Tester och kvalitetssäkring

Varje utvecklare ansvarar för att testa sin kod manuellt innan ändringarna pushas.

Kontrollera att funktionaliteten fungerar, att befintlig kod inte påverkas negativt och att projektet kan byggas utan fel.

Vid ändringar i gemensamma kontrakt ska även integrationen mellan plattform och spel kontrolleras.

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

## 9. Driftsättning

Frontend och backend driftsätts via Vercel och databasen via Neon.

Miljövariabler för produktion hanteras i Vercels projektinställningar. Spelmodulerna byggs tillsammans med applikationen och inkluderas i driftsättningen.