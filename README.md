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

/
├── frontend/                      # Plattformens React/Vite-applikation
│   ├── public/                    # Statiska filer, fonter och ikoner
│   └── src/
│       ├── api/                   # API-klient och API-anrop
│       ├── assets/                # Bilder och grafiska resurser
│       ├── components/            # Återanvändbara UI-komponenter
│       ├── context/               # React context, t.ex. autentisering
│       ├── lib/                   # Hjälpfunktioner och frontendlogik
│       ├── mock/                  # Mockdata för utveckling
│       ├── pages/                 # Applikationens sidor
│       ├── App.tsx
│       └── main.tsx
│
├── backend/                       # Plattformens Express API
│   ├── build.mjs                  # Backend-build med esbuild
│   └── src/
│       ├── controllers/           # Hantering av HTTP-anrop och svar
│       ├── middleware/            # Auth, felhantering och 404-hantering
│       ├── routes/                # Publika API-routes
│       │   └── admin/             # Administrativa API-routes
│       ├── seed/                  # Seeddata
│       ├── services/              # Databasåtkomst och applikationslogik
│       ├── types/                 # Backend-specifika TypeScript-typer
│       ├── utils/                 # Validering, lösenordshantering m.m.
│       ├── database.ts            # PostgreSQL-anslutning
│       └── server.mts             # Express-serverns entry point
│
├── games/                         # Utbytbara spelmoduler
│   └── pizza_arcade/
│       ├── frontend/              # Spelspecifik frontend
│       └── backend/               # Spelspecifik backend
│
├── shared/                        # Gemensamma typer för plattform och spel
│   └── game.ts
│
├── docs/                          # Projektdokumentation
│   ├── openapi.yaml               # API-specifikation
│   ├── database-design.md         # Databasdesign
│   ├── er-diagram.png             # ER-diagram
│   └── ...                        # Wireframes och övrig dokumentation
│
├── package.json                   # Root workspace-konfiguration
├── package-lock.json
├── vercel.json                    # Vercel-konfiguration
└── README.md

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
- [OpenAPI-specifikation](docs/openapi.yaml) – API-endpoints och request/response-strukturer

## 9. Driftsättning

Frontend och backend driftsätts via Vercel och databasen via Neon.

Miljövariabler för produktion hanteras i Vercels projektinställningar. Spelmodulerna byggs tillsammans med applikationen och inkluderas i driftsättningen.