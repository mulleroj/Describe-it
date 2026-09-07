# Describe It!

Describe It! je malá lokální webová aplikace pro praktickou angličtinu středoškoláků. Žák si zvolí úroveň, projde lekci od slovní zásoby k vlastnímu popisu a může si vyzkoušet krátkou speaking challenge. Aplikace nepoužívá účet, backend, AI, mikrofon ani ukládání žákovských textů.

## Stack

- React 19, TypeScript 6, Vite 8 a React Router 8
- Node.js 24.11.1 a npm (`.nvmrc`)
- vestavěný Node test runner pro unit testy
- Playwright pro malou browser smoke suite
- ESLint s pravidly pro TypeScript, React Hooks a Fast Refresh
- statické nasazení na Netlify; žádný SSR ani serverová databáze

## Lokální spuštění

```sh
npm ci
npm run dev
```

V PowerShellu lze použít `npm.cmd`, pokud je omezeno spouštění skriptů. Vite vypíše adresu lokálního serveru.

## Kontroly a build

```sh
npm run validate:content  # runtime kontrola publikovaného katalogu
npm run typecheck         # TypeScript
npm run lint              # ESLint, včetně zákazu warningů
npm test                  # unit a content testy
npm run build             # typecheck + content validation + Vite production build
npm run preview           # lokální náhled dist/
```

Browser smoke testy používají production build a Vite preview server:

```sh
npx playwright install chromium
npm run test:browser
```

Suite obsahuje čtyři krátké scénáře: homepage a výběr úrovně, průchod lesson steps, Random Challenge s timerem a přímou hlubokou route po refreshi.

## Struktura projektu

```text
src/
  app/                   router, layout a sdílený stav úrovně
  components/            UI, level selector a lesson steps
  content/               katalog, kategorie, úrovně a texty
  domain/                TypeScript datový model
  pages/                 homepage, katalog, lekce a Random Challenge
  random/                deterministicky testovatelný výběr a safe storage
  storage/               bezpečný přístup k preferencím
  validation/            runtime validace obsahu z unknown vstupu
  styles/                design tokens a komponentové styly
public/                  lokální favicon
scripts/                 kontroly spouštěné při build procesu
tests/                   unit, content, storage, random a browser smoke testy
docs/                    pravidla pro výukový obsah
.github/workflows/       GitHub Actions CI
```

## Obsah a úrovně

Publikovaný katalog je v `src/content/topics/index.ts`. Aktuálně obsahuje tři témata a devět kompletních variant:

- Personality
- Smile
- Waiting in a queue

Každé téma může mít variantu `basic`, `standard` a `challenge`. Úrovně jsou definované centrálně v `src/content/levels.ts` jako Basic A1/A2, Standard A2/B1 a Challenge B1/B2. Chybějící varianta se v katalogu zobrazí jako `Coming soon` a není použitelná v Random Challenge.

Při přidání tématu:

1. Vytvoř `src/content/topics/<topic-id>.ts` podle `Topic` modelu a existujících variant.
2. Přidej téma do `src/content/topics/index.ts`.
3. Udrž všechny reference uvnitř stejné varianty a vyplň Explore, Practice, Build, Describe i Speak.
4. Ověř obsah pomocí `npm run validate:content`, `npm test` a `npm run build`.
5. Proveď samostatnou jazykovou a pedagogickou revizi; strukturální validátor ji nenahrazuje.

Testovací fixture v `tests/fixtures/` slouží pouze validátorovým testům a aplikace je neimportuje.

## Routy

- `/` — homepage a výběr úrovně
- `/topics` — katalog témat podle zvolené úrovně
- `/topics/:topicId/:level` — lesson route
- `/random` — Random Challenge z existujícího katalogu
- neznámé adresy — přístupný not-found stav

Pro kompatibilitu je `/topics/queue/:level` alias pro publikované téma `waiting-in-a-queue`.

## Random Challenge

Random Challenge používá pouze existující `speakingTask` a výrazy z publikovaných lesson variant. Výběr filtruje zvolenou úroveň, ignoruje nedostupný nebo `Coming soon` obsah, podporuje injectable RNG pro testy a při více kandidátech potlačuje okamžité opakování. Při prázdném katalogu vrací bezpečný stav.

Sdílený `SpeakingTimer` je použit v lesson Speak i v Random Challenge. Úroveň se ukládá jako `basic`, `standard` nebo `challenge` pod `describe-it:level:v1`; poslední random key je samostatná nepovinná preference. Každý přístup k `localStorage` je v `try/catch` a při selhání zůstane aplikace použitelná pouze pro aktuální návštěvu.

## CI

`.github/workflows/ci.yml` běží při pull requestu do `main` a při pushi do `main`. Na čistém runneru provede `npm ci`, nainstaluje Chromium, validaci obsahu, typecheck, lint, unit testy, browser smoke testy a production build. Workflow neobsahuje deployment secrets.

## Deployment model

`netlify.toml` nastavuje Node.js 24.11.1, build command `npm run build`, publish directory `dist` a SPA fallback `/* -> /index.html`. Díky tomu funguje přímé otevření i refresh hlubokých React route, například `/topics/smile/standard` a `/random`.

Netlify Deploy Preview vzniká z GitHub pull requestu, pokud je Netlify site propojená s tímto repository. Přístup k Netlify účtu a nastavení propojení patří do Netlify UI; žádné tokeny ani secrets se necommitují do repository.

## Bezpečnostní hranice MVP

Data jsou součástí buildu a aplikace je čistě klientská. Nejsou zde účty, osobní údaje, API keys, AI, mikrofon, nahrávání, speech recognition, analytics, databáze, exporty ani PWA offline režim.
