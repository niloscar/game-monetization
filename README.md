# Game Monetization – Plattform för intäktsgenerering

## 1. Projektbeskrivning

Projektet syftar till att utveckla en webbaserad plattform som möjliggör intäktsgenerering kring befintliga spel genom reklam och engångsköp.

Fokus ligger på att bygga den tekniska infrastrukturen för användarhantering, betalningar och åtkomst till innehåll, snarare än på själva spelutvecklingen.

Spelet _Pizza Arcade_ används som exempel för att demonstrera plattformens funktionalitet.

### Planerad funktionalitet

- **Användarhantering:** Registrering, inloggning och hantering av användarkonton och kunduppgifter.
- **Engångsköp av produktpaket:** Olika paket som ger tillgång till specifika funktioner och power-ups i spelet.
- **Beställningar och betalningar:** Köpflöde med orderhantering, betalningsmetoder och prishistorik.
- **Åtkomstkontroll:** Säkerställa att användaren endast får tillgång till innehåll som ingår i dennes köpta paket.
- **Reklam:** Hantering och visning av annonser för att möjliggöra reklamintäkter.
- **Poäng och topplistor:** Registrering av spelresultat kopplade till användare och produktpaket samt möjlighet att visa topplistor.
- **Administration:** Hantering av användare, produktpaket, innehåll, annonser och tillgänglighet.

## 2. Förhandsvisning

Projektet driftsätts via Vercel och kommer att finnas tillgängligt för förhandsvisning under utvecklingen.

**[Öppna förhandsvisningen](URL_TILL_VERCEL)**

## 3. Tech stack

| Område            | Teknik                       |
| ----------------- | ---------------------------- |
| Frontend          | React, TypeScript, Vite      |
| Backend           | Node.js, Express, TypeScript |
| Databas           | PostgreSQL                   |
| Databashosting    | Neon                         |
| Versionshantering | Git, GitHub                  |
| Driftsättning     | Ej fastställd                |

## 4. Projektstruktur

Beskriv hur projektets filer och mappar är organiserade.

```text
/
├── frontend/        # React-applikation
├── backend/         # Express-API
├── docs/            # Dokumentation
└── README.md
```

Uppdatera strukturen när projektet förändras.

## 5. Kom igång

### Förutsättningar

Ange vilka program och verktyg som behöver vara installerade för att köra projektet lokalt.

### Installation

Beskriv steg för steg hur man:

1. Klonar projektet.
2. Installerar beroenden.
3. Konfigurerar miljövariabler.
4. Startar frontend och backend.

### Miljövariabler

Beskriv vilka miljövariabler som krävs och hur de konfigureras.

Använd `.env.example` som mall. Lösenord, API-nycklar och andra hemligheter får inte versionshanteras.

### Starta utvecklingsmiljön

Ange kommandon för att starta projektet lokalt.

## 6. Utvecklingskonventioner

För att skapa en enhetlig kodbas ska samtliga utvecklare följa gemensamma namnkonventioner och arbetsrutiner.

### Namnkonventioner

| Typ                      | Konvention       | Exempel            |
| ------------------------ | ---------------- | ------------------ |
| Mappar                   | kebab-case       | `user-profile/`    |
| React-komponenter        | PascalCase       | `UserProfile.tsx`  |
| Övriga TypeScript-filer  | camelCase        | `formatPrice.ts`   |
| Variabler och funktioner | camelCase        | `userId`           |
| Klasser och typer        | PascalCase       | `OrderItem`        |
| Konstanter               | UPPER_SNAKE_CASE | `MAX_RETRIES`      |
| CSS-filer                | kebab-case       | `user-profile.css` |
| Databastabeller          | snake_case       | `order_items`      |
| Databaskolumner          | snake_case       | `created_at`       |
| API-endpoints            | kebab-case       | `/api/order-items` |
| Miljövariabler           | UPPER_SNAKE_CASE | `DATABASE_URL`     |

Undantag kan göras när ramverk eller bibliotek kräver en annan namnkonvention.

### Brancher

Nya brancher namnges enligt följande format:

`typ/kort-beskrivning`

| Prefix      | Användningsområde      | Exempel                     |
| ----------- | ---------------------- | --------------------------- |
| `feat/`     | Ny funktionalitet      | `feat/user-auth`            |
| `fix/`      | Buggfixar              | `fix/login-validation`      |
| `docs/`     | Dokumentation          | `docs/update-readme`        |
| `refactor/` | Omstrukturering av kod | `refactor/order-service`    |
| `test/`     | Tester                 | `test/payment-flow`         |
| `chore/`    | Underhåll              | `chore/update-dependencies` |

Branchernas namn ska skrivas med små bokstäver och använda kebab-case.

### Commit-meddelanden

Vi använder Conventional Commits.

Format:

`typ: kort beskrivning`

Exempel:

- `feat: implement user registration`
- `fix: resolve login validation error`
- `docs: update database documentation`
- `refactor: simplify order validation`

Commit-meddelanden skrivs på engelska.

### Arbetsflöde med Git

- `main` innehåller projektets stabila version.
- Varje ny funktion eller ändring utvecklas i en separat branch.
- Ändringar förs in i `main` genom en pull request.
- Pull requests ska granskas innan de mergas.
- Färdigmergeade brancher tas bort.

### Kodstandard

För att säkerställa en enhetlig och lättunderhållen kodbas gäller följande riktlinjer:

- **Språk:** TypeScript används i både frontend och backend.
- **Indrag:** 4 mellanslag. Tabbar används inte.
- **Semikolon:** Utelämnas där de inte krävs.
- **Citattecken:** Enkla citattecken används där det är möjligt. JSX-attribut och JSON använder dubbla citattecken.
- **Namn:** Variabler, funktioner och filer namnges enligt projektets namnkonventioner.
- **Ansvarsfördelning:** Funktioner och moduler ska ha tydligt avgränsade ansvarsområden. Affärslogik ska inte placeras direkt i React-komponenter.
- **Felhantering:** Fel ska hanteras uttryckligen och relevanta felmeddelanden ska tillhandahållas utan att känslig information exponeras.
- **Kodkvalitet:** ESLint används för statisk kodanalys.

Kod ska vara läsbar och konsekvent. Undvik onödiga förkortningar, duplicerad logik och kommentarer som enbart upprepar vad koden redan uttrycker.

## 7. Arkitektur och databas

Beskriv systemets övergripande arkitektur och hur frontend, backend och databasen kommunicerar.

Länka till mer detaljerad dokumentation om databasstruktur och tekniska designbeslut.

## 8. API

Beskriv hur API:et är organiserat och var dokumentation för endpoints, förfrågningar och svar finns.

## 9. Tester och kvalitetssäkring

Beskriv vilka tester som används, hur de körs och vilka kontroller som ska genomföras innan en ändring mergas.

## 10. Driftsättning

Beskriv hur applikationen driftsätts, vilka tjänster som används och hur miljövariabler hanteras i produktion.

## 11. Dokumentation

Kompletterande dokumentation finns i mappen `docs/`.

| Dokument                     | Innehåll                      |
| ---------------------------- | ----------------------------- |
| `assgignment-description.md` | Uppgiftsbeskrivning           |
| `assignment-checklist.md`    | Checklista för uppgiftskraven |
| `database-design.md`         | Designbeslut, databas         |
| `er-diagram.png`             | Databasdiagram                |

Länka endast till dokument som faktiskt finns.

## 12. Att bidra till projektet

Beskriv hur utvecklare bidrar med ändringar, hur pull requests ska utformas och vad som krävs för att en funktion ska anses färdig.
