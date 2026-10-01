# Game Monetization – Plattform för intäktsgenerering

## 1. Projektbeskrivning

Projektet är en webbplattform för monetisering av spelet **Pizza Arcade** genom produktnivåer, annonser, power-ups och åtkomststyrd funktionalitet.

Plattformen hanterar användarkonton, produkter, beställningar, annonser, power-ups, spelåtkomst, resultat och administration. Pizza Arcade är implementerat som en separat spelmodul med egen spellogik och rendering, medan användarhantering, affärslogik och datalagring hanteras av plattformens frontend och backend.

### Funktionalitet

- **Användarhantering:** Registrering, inloggning, profilsidor och kunduppgifter.
- **Produktnivåer:** Produkter med olika nivåer, funktioner och power-ups.
- **Beställningar:** Köp, orderhistorik och lagring av historiska priser.
- **Åtkomstkontroll:** Spel- och funktionsåtkomst baserad på användarens produktnivå.
- **Reklam:** Pre-game-annonser och displayannonser med åtkomststyrning.
- **Power-ups:** Databasstyrda power-ups som kan kopplas till produkter och användas i spelet.
- **Topplista:** Lagring av spelresultat, high score och scoreboard.
- **Administration:** Hantering av användare, och villka annonser och power-ups.
- **Spelintegration:** Pizza Arcade är separerat från plattformens övriga frontendkod och använder gemensamma typer för kommunikationen med plattformen.


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

Projektet är ett monorepo där plattformens frontend och backend, spelet och gemensamma TypeScript-typer hålls separerade.

```text
/
├── backend/
│   ├── build.mjs
│   └── src/
│       ├── controllers/           # HTTP-hantering för API-resurser
│       ├── middleware/            # Auth, uploads och felhantering
│       ├── routes/                # Publika och autentiserade routes
│       │   └── admin/             # Administrativa routes
│       ├── services/              # Databasåtkomst och affärslogik
│       ├── types/                 # Backend-specifika TypeScript-typer
│       ├── utils/                 # Validering och lösenordshantering
│       ├── database.ts            # PostgreSQL-anslutning
│       └── server.mts             # Express-serverns entry point
│
├── frontend/
│   ├── public/                    # Statiska filer och uppladdade resurser
│   └── src/
│       ├── api/                   # API-klient och API-anrop
│       ├── assets/                # Bilder och grafiska resurser
│       ├── components/            # UI-komponenter och plattformsintegration
│       ├── context/               # React context, bl.a. autentisering
│       ├── lib/                   # Frontendlogik och hjälpfunktioner
│       ├── pages/                 # Applikationens sidor
│       ├── types/                 # Frontend-specifika typer
│       ├── utils/                 # Hjälpfunktioner
│       ├── App.tsx
│       └── main.tsx
│
├── games/
│   └── pizza_arcade/
│       └── frontend/
│           ├── assets/            # Sprites och spelgrafik
│           ├── components/        # Canvas, HUD och spelvyer
│           ├── engine/            # Spellogik, rendering och game loop
│           ├── types/             # Spelspecifika typer
│           └── PizzaArcade.tsx    # Spelmodulens entry point
│
├── shared/
│   └── src/
│       └── types/                 # Delade kontrakt mellan projektets delar
│           ├── ad.ts
│           ├── game.ts
│           ├── order.ts
│           └── powerUp.ts
│
├── docs/
│   ├── assignment-checklist.md
│   ├── assignment-description.md
│   ├── database-design.md
│   ├── er-diagram.png
│   ├── openapi.yaml
│   └── ...                        # Wireframes och övrig dokumentation
│
├── package.json
├── package-lock.json
├── vercel.json
└── README.md
```

### Arkitektur och ansvarsfördelning

Applikationen består huvudsakligen av fyra delar:

**Frontend** ansvarar för webbapplikationens användargränssnitt, autentiseringsstate, butik, profiler, scoreboard, administration och integrationen mellan plattformen och spelet.

**Pizza Arcade** ligger separat under `games/pizza_arcade/`. Spelmodulen innehåller bland annat game loop, rendering, inputhantering, rörelse, kollisionshantering, power-ups, annonser i spelvärlden och poängberäkning.

**Backend** är ett centralt Express-API som hanterar autentisering, användare, produkter, beställningar, annonser, power-ups, spelåtkomst och resultat. Backend ansvarar även för validering, behörighetskontroll och kommunikation med PostgreSQL-databasen.

**Shared** innehåller TypeScript-typer som används av flera delar av projektet och fungerar som gemensamma kontrakt mellan frontend, backend och spelet.

```text
Frontend
   |
   ├── Plattformens UI
   |
   └── Pizza Arcade
          |
          v
       REST API
          |
          v
       Backend
          |
          v
   PostgreSQL / Neon
```

### Spelintegration

`frontend/src/components/Game.tsx` fungerar som integrationslager mellan plattformen och Pizza Arcade.

Plattformen hämtar bland annat användarens spelåtkomst, annonser och annan data från backend och skickar den vidare till spelmodulen.

Pizza Arcade ansvarar därefter för själva spelupplevelsen, exempelvis:

- game loop
- input och rörelse
- rendering
- världsgenerering
- kollisioner
- hälsa
- poäng
- power-ups
- in-game-annonser

När en spelomgång avslutas skickas resultatet till plattformens API för lagring.

### Power-ups

Power-ups lagras i databasen och kan kopplas till produkter.

Backend ansvarar för att lagra och exponera konfigurationen för power-ups, exempelvis namn, bild, effekt, varaktighet och spawn-vikt.

Pizza Arcade använder konfigurationen för att skapa power-ups i spelvärlden och implementerar deras effekter i spelmotorn.

Det gör att egenskaper för power-ups kan ändras från plattformens data utan att motsvarande värden behöver hårdkodas direkt i spelmotorn.

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
- [Utvecklingsplan och ansvarsfördelning](docs/development-plan.md)
- [Databasdesign](docs/database-design.md)
- [ER-diagram](docs/er-diagram.png)
- [OpenAPI-specifikation](docs/openapi.yaml) – API-endpoints och request/response-strukturer

## 9. Driftsättning

Frontend och backend driftsätts via Vercel och databasen via Neon.

Miljövariabler för produktion hanteras i Vercels projektinställningar. Spelmodulerna byggs tillsammans med applikationen och inkluderas i driftsättningen.