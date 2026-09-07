# Describe It!

Základ webové aplikace pro praktickou angličtinu středoškoláků. **Implementována pouze Etapa 1.** Úvod a výběr úrovně fungují; lekce, katalog aktivit a Random Challenge zatím nejsou implementovány.

## Spuštění

Použijte Node.js 24.11.1 (viz `.nvmrc`) a npm.

```sh
npm ci
npm run dev
```

V PowerShellu lze při omezení spouštění skriptů používat `npm.cmd`. Adresu vývojového serveru vypíše Vite. Server nepotřebuje žádné API klíče ani environment secrets.

```sh
npm run typecheck
npm run lint
npm test
npm run validate:content
npm run build
npm run preview
```

Produkční sestavení vzniká v `dist/`. Build zahrnuje TypeScript a runtime kontrolu publikovaného obsahu. Testy běží vestavěným test runnerem Node.js bez další testovací knihovny.

## Architektura

```text
src/
  app/                   sestavení aplikace, router, layout, stav úrovně
  components/
    ui/                  odkazy-tlačítka, ikony, informační stav
    learning/            výběr úrovně a přehled výukové cesty
  pages/                 úvod a samostatné route komponenty
  content/
    topics/              publikovaný registr témat (aktuálně Personality Basic)
    categories.ts        taxonomie kategorií a podkategorií
    levels.ts            aplikační úrovně a mapování CEFR
    learning-path.ts     texty úvodního přehledu
    catalog.ts           runtime validační hranice
  domain/                TypeScript datový model
  validation/            kontrola vstupu unknown, ID, referencí a řešení
  storage/               bezpečný přístup k lokálnímu nastavení
  utils/                 malé sdílené pomocné funkce
  styles/                design tokens, globální CSS, komponentové styly
public/                  lokální favicon
scripts/                 kontrola obsahu při sestavení
tests/                   validační testy a testy selhání úložiště
docs/                    pravidla obsahu a report Etapy 1
```

Aplikace používá React, TypeScript, Vite a deklarativní React Router. ESLint má pravidla pro TypeScript, React Hooks a Fast Refresh. Striktní TypeScript doplňují `noUncheckedIndexedAccess` a `exactOptionalPropertyTypes`; platí i pro testy a skripty.

Runtime závislosti jsou pouze React, React DOM a React Router. Bez externího UI frameworku, knihovny pro globální stav a knihovny pro schémata. Verze závislostí jsou uzamčené v `package-lock.json`.

## Routy

| Adresa | Stav v Etapě 1 |
| --- | --- |
| `/` | Funkční úvod a výběr úrovně |
| `/topics` | Informační stránka s vybranou úrovní |
| `/topics/:topicId` | Připravená routa; nepublikované téma zobrazí srozumitelný stav |
| `/topics/:topicId/:level` | Připravená routa; kontrola ID úrovně a její dostupnosti |
| `/random` | Informační stránka Coming soon, bez losování |
| ostatní adresy | Přístupná stránka Page not found s návratem |

Nejsou zde nefunkční karty kategorií ani falešné lekce. Pět kategorií včetně podkategorií existuje v datové taxonomii. Všechny cílové informační stránky obsahují možnost návratu.

## Obsah a validace

Podrobná pravidla jsou v [docs/content-guide.md](docs/content-guide.md). Výuková data se nepíší do React komponent. Testovací data se nikdy neimportují do aplikace.

Vlastní validátor přijímá `unknown`, vrací strukturované chyby s cestami a kontroluje povinná pole, ID, úrovně, kategorie, reference i strukturální platnost řešení. Spouští se při buildu i při načtení katalogu aplikací. V neplatném stavu se obsah nezpřístupní.

## Uložení úrovně

Výchozí úroveň je Basic. React Context a state drží aktuální volbu; do localStorage se ukládá jen hodnota `basic`, `standard` nebo `challenge` pod klíčem `describe-it:level:v1`.

Čtení i zápis včetně samotného přístupu k localStorage jsou v `try/catch`. Neznámé hodnoty se ignorují. Při neúspěšném zápisu zůstane volba funkční v aktuální návštěvě a zobrazí se krátká informace. Neexistují účty, osobní údaje ani ukládání žákovských textů.

## Design a přístupnost

Vlastní CSS používá světlý neutrální základ, fialový akcent, systémové fonty a responzivní karty. Breakpointy jsou 40rem a 64rem. Radio skupina je nativní a ovladatelná šipkami. Součástí je skip odkaz, viditelný fokus, návrat fokusu na obsah při změně routy, popisky úrovní, podpora reduced motion a základ forced colors. Žádné externí fonty či obrázky.

## Netlify a další etapy

`netlify.toml` definuje build, výstup `dist`, Node.js a SPA fallback na `index.html`, aby přímé adresy budoucích lekcí fungovaly po nasazení. Nasazení na Netlify v této etapě nebylo provedeno.

Neimplementováno: výukové enginy, skutečné lekce, kompletní katalog, timer, random logika, Teacher Mode, AI, backend, databáze, mikrofon, statistiky ani service worker. Struktura statické aplikace umožní pozdější PWA, ale offline režim nyní není deklarován.

Etapa 2 vyžaduje další pokyn uživatele.
