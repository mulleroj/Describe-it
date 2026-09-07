# ETAPA 1 — IMPLEMENTATION REPORT

Dokončena pouze Etapa 1: spustitelný základ Describe It!. Etapa 2 nebyla zahájena.

## Co bylo vytvořeno

- React + TypeScript + Vite projekt s uzamčenými závislostmi.
- Striktní kontrola TypeScriptu pro aplikaci, testy i skripty; navíc `noUncheckedIndexedAccess` a `exactOptionalPropertyTypes`.
- ESLint pro TypeScript, React Hooks a Fast Refresh, s nulovou tolerancí varování.
- Úvodní obrazovka s názvem aplikace, vysvětlením účelu, třemi úrovněmi a oběma požadovanými akcemi.
- Samostatné routy `/`, `/topics`, `/topics/:topicId`, `/topics/:topicId/:level`, `/random` a záchytná stránka pro neznámou adresu.
- Informační stavy s návratem, bez falešných lekcí či nefunkčních odkazů kategorií.
- Vlastní responzivní CSS: typografie, spacing tokeny, karty, tlačítka, kontejnery, fokus, breakpointy 40rem a 64rem.
- Základní konfigurace Netlify: build, výstup `dist`, verze Node a SPA fallback. Bez nasazení.
- Dokumentace spuštění, architektury a budoucího přidávání obsahu.

## Architektura a struktura

| Oblast | Umístění |
| --- | --- |
| Sestavení aplikace, layout, router a stav úrovně | `src/app/` |
| Sdílené UI | `src/components/ui/` |
| Výběr úrovně a textový přehled cesty | `src/components/learning/` |
| Stránky | `src/pages/` |
| Obsah a taxonomie | `src/content/` |
| Datové typy | `src/domain/` |
| Runtime validace | `src/validation/` |
| Lokální nastavení | `src/storage/` |
| Utility | `src/utils/` |
| Vizuální systém | `src/styles/` |
| Kontrola obsahu při sestavení | `scripts/` |
| Cílené testy a výhradně testovací data | `tests/` |

React Router je použit v deklarativním režimu, bez serverového frameworku. Aktuální stav úrovně drží malý React Context; není přidána knihovna pro globální stav. [Oficiální dokumentace React Router](https://reactrouter.com/start/declarative/installation).

Runtime závislosti jsou pouze React, React DOM a React Router. Validace je vlastní, bez další knihovny. Testy používají vestavěný test runner Node.js. Návrh neobsahuje backend ani síťové načítání výukových dat.

## Obsah a datový model

`Topic` obsahuje společná metadata a mapu variant dle aplikační úrovně. CEFR rozsahy jsou definovány centrálně: Basic A1/A2, Standard A2/B1 a Challenge B1/B2. Jedno téma může mít pouze některé připravené varianty.

Model zahrnuje kategorii a podkategorii, slovní zásobu, phrases, collocations, sentence starters, příklady, modelový popis, čtyři druhy uzavřených cvičení, Build, Describe, Speak, kontrakt Random Challenge a `wordFinderPath`.

Taxonomie obsahuje People, Places, Things, Situations a Five senses včetně požadovaných podkategorií. Skutečný registr témat zůstává prázdný. Fixture v testech ověřuje strukturu dat a není součástí aplikace. Výuková data nejsou vložena do React komponent.

## Runtime validace

Vstupem je `unknown`; výsledkem je diskriminovaná unie s ověřenými daty nebo seznamem chyb s cestami k položkám. Kontrolují se:

- povinná pole, typy, neprázdné texty, známé kategorie a úrovně;
- příslušnost podkategorie ke kategorii;
- unikátní ID témat, slugy, ID výrazů a aktivit v popsaných jmenných prostorech;
- reference do výrazových bank a samostatně reference výhradně do vocabulary;
- existující řešení výběrových cvičení, odpovědi mezer, rozlišitelné páry a úplné permutace tokenů;
- základní konzistence Build rámců, Describe checklistů a časových hodnot ve speaking datech;
- lokální formát cesty obrázku, alternativní text a struktura `wordFinderPath`.

Validace běží při sestavení a znovu při načtení katalogu aplikací. Neplatný obsah blokuje build a není zpřístupněn uživateli. Kontrola řešení je strukturální; jazyková a pedagogická správnost zůstává věcí obsahové revize.

## Ukládání úrovně

React state je nezávislý na úložišti. Do localStorage se zapisuje pouze `basic`, `standard` či `challenge` pod klíčem `describe-it:level:v1`. Přístup k vlastnosti localStorage, čtení i zápis jsou chráněné `try/catch`. Neznámá hodnota znamená výchozí Basic. Při selhání zápisu volba funguje dál pro aktuální návštěvu a rozhraní o tom informuje. Nejsou ukládány osobní údaje ani studentské odpovědi.

## Ověření

| Kontrola | Výsledek |
| --- | --- |
| `npm run typecheck` | PASS, exit 0 |
| `npm run lint` | PASS, exit 0, bez chyb a varování |
| `npm test` | PASS, 21 testů, 0 selhání |
| `npm run build` | PASS, exit 0 |
| Runtime kontrola skutečného katalogu v buildu | PASS, 0 publikovaných témat |
| Mobilní viewport 390 × 844 | Vizuálně ověřen úvod i volby úrovní; bez vodorovného přetečení |
| Úzký viewport 320 × 740 | Vizuálně ověřeno zalamování a absence vodorovného přetečení |
| Desktop 1440 × 1000 | Vizuálně ověřeno rozložení a hierarchie |
| Klávesnice | Tab → skip odkaz → Enter → radio skupina; změna úrovně šipkou; Tab/Enter na hlavní akci; návrat ze stránky |
| Fokus | Viditelný rámeček aktivní karty; po navigaci se fokus přesune na hlavní obsah |
| Uložení úrovně | Standard zůstal vybraný po návratu a obnovení stránky |
| Selhání úložiště | Jednotkově ověřen zákaz přístupu, chyba čtení, chyba zápisu a neplatné uložené hodnoty |
| Přímé routy | Ověřeny v prohlížeči včetně neexistujícího tématu, neplatné úrovně, `/random` a neznámé stránky |
| Produkční náhled | Úvod ověřen na `http://127.0.0.1:4173/` při šířce 390 px |
| Konzole prohlížeče | Bez zachycených varování a chyb v kontrolovaných průchodech |

Výstup sestavení: HTML 0,82 kB, CSS 9,04 kB a JavaScript 244,45 kB; komprimovaný JavaScript přibližně 78,65 kB. Údaje platí pro toto sestavení.

## Omezení a technický dluh

- Žádný známý blokující problém Etapy 1.
- Informační stránky jsou záměrným stavem, nikoli dokončeným katalogem nebo lekcí.
- Nebylo provedeno nasazení na Netlify; přepis SPA adres v jeho prostředí bude potřeba ověřit při skutečném nasazení.
- Vizuální kontrola proběhla v desktopovém prohlížeči s mobilními viewporty, nikoli na fyzickém telefonu či školním projektoru. Nejde o úplný audit přístupnosti nebo všech prohlížečů.
- Validátor nehodnotí přirozenost angličtiny, CEFR ani fyzickou existenci a licenci budoucích obrázků; tyto kontroly patří k přidávání obsahu.
- Složka původně nebyla Git repozitářem. Nebyl vytvářen commit ani proveden push.

## Výslovně neimplementováno

Skutečné lekce, úplný katalog, Practice/Build/Describe enginy, časovač Speak, náhodné losování, I need a word UI, Teacher Mode, AI, backend, účty, databáze, mikrofon, PWA service worker a statistiky.

## Vytvořené nebo významně změněné soubory

Všechny níže uvedené soubory vznikly v novém projektu. Základní soubory šablony Vite byly upraveny; demo komponenty, obrázky a konfigurace Oxlint byly odstraněny a nahrazeny vlastní aplikací a ESLintem. `node_modules/` a `dist/` jsou generované adresáře.

```text
.gitignore
.nvmrc
README.md
package.json
package-lock.json
index.html
eslint.config.js
vite.config.ts
tsconfig.json
tsconfig.app.json
tsconfig.node.json
netlify.toml
public/favicon.svg
src/main.tsx
src/app/App.tsx
src/app/AppLayout.tsx
src/app/LevelProvider.tsx
src/app/level-context.ts
src/app/router.tsx
src/components/ui/ButtonLink.tsx
src/components/ui/EmptyState.tsx
src/components/ui/Icon.tsx
src/components/learning/LevelSelector.tsx
src/components/learning/LearningPath.tsx
src/pages/HomePage.tsx
src/pages/TopicsPage.tsx
src/pages/TopicPage.tsx
src/pages/RandomChallengePage.tsx
src/pages/NotFoundPage.tsx
src/content/categories.ts
src/content/levels.ts
src/content/learning-path.ts
src/content/catalog.ts
src/content/topics/index.ts
src/domain/content-types.ts
src/validation/content-validation.ts
src/storage/preferences.ts
src/utils/levels.ts
src/styles/tokens.css
src/styles/global.css
src/styles/components.css
scripts/validate-content.ts
tests/content-validation.test.ts
tests/preferences.test.ts
tests/fixtures/topic.ts
docs/content-guide.md
docs/stage-1-report.md
```

**ETAPA 1: PASS**

**STOP AFTER STAGE 1.**
