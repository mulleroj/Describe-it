# Výukový obsah Describe It!

Etapa 2 obsahuje první publikovanou lekci `Personality · Basic` v content-driven katalogu. Data v `tests/fixtures/` slouží pouze ke strukturálním testům; aplikace je neimportuje.

## Uspořádání

- `src/domain/content-types.ts`: aplikační úrovně, CEFR, kategorie, výrazy, čtyři typy uzavřených cvičení, Build, Describe, Speak a smlouva Random Challenge.
- `src/content/levels.ts`: Basic A1/A2, Standard A2/B1, Challenge B1/B2.
- `src/content/categories.ts`: pět kategorií a jejich podkategorie.
- `src/content/topics/index.ts`: registr publikovaných témat; aktuálně obsahuje `personality.ts` pro Basic.
- `src/content/learning-path.ts`: pouze textový přehled výukové cesty na úvodu, nikoli výukové aktivity.
- `src/validation/content-validation.ts`: kontrola vstupu `unknown` nezávislá na TypeScriptu a Reactu.

## Přidání tématu v pozdější etapě

1. Připravit `src/content/topics/<topic-id>.ts` a exportovat objekt s `satisfies Topic`.
2. Vyplnit společná metadata a alespoň jednu variantu `basic`, `standard` či `challenge`.
3. Přidat téma do registru. Chybějící úroveň se nesmí nahrazovat jinou bez výslovné volby studenta.
4. Spustit `npm run validate:content`, `npm test` a `npm run build`.
5. Provést jazykovou a pedagogickou revizi. Strukturální validace nedokazuje přiměřenost CEFR ani přirozenost angličtiny.

Publikované téma musí obsahovat všechny požadované sekce modelu. Prázdné pole je dovoleno u doplňkových výrazových bank, cvičení a Build úloh, pokud ještě nejsou potřebné. Slovní zásoba, příklady, checklist, popisné zadání a speaking zadání mají povinná pole. Nedokončené pracovní lekce ponechat mimo registr.

## Identifikátory a reference

- ID i slug tématu jsou unikátní v katalogu. Adresy v etapě 1 používají `topicId`; slug je obsahové metadata pro případnou pozdější publikaci, nikoli alternativní routovací klíč.
- ID výrazů jsou unikátní napříč `vocabulary`, `phrases`, `collocations` a `sentenceStarters` v jedné jazykové variantě. Mezi úrovněmi či tématy se opakovat mohou.
- `suggestedItemIds` odkazují na libovolnou z těchto čtyř bank ve stejné variantě.
- `vocabularyItemIds` ve cvičeních odkazují výhradně do `vocabulary` stejné varianty.
- ID cvičení a Build úloh jsou společně unikátní v rámci varianty. ID možností, párů a tokenů jsou lokální pro jednotlivé cvičení.
- `wordFinderPath` je nepovinná neprázdná cesta v pojmech, například `['person', 'face', 'expression']`. Vyhledávač slov zatím není implementován.

## Řešení cvičení

- `choice`: alespoň dvě rozlišitelné možnosti a `correctOptionId` existující možnosti.
- `gap`: právě jedna značka `___`, alespoň jedna neprázdná přijatelná odpověď.
- `match`: alespoň dva jednoznačně rozlišitelné páry; správné spojení je dáno dvojicí v datech.
- `order`: nejméně dva tokeny a alespoň jedno řešení. Každé řešení musí obsahovat všechny tokeny právě jednou. Opakovaná slova mají odlišná ID tokenů.
- `Build`: značka `___` pro každé doplnitelné místo a obsahový `buildChecklist`. Jde o otevřenou tvorbu, bez automatického rozhodování o správnosti věty.
- `Describe`: situace, otevřené zadání, nápověda a sebekontrolní checklist. Modelový popis je jedna možná odpověď.
- `Speak`: celé nezáporné sekundy přípravy a kladné celé sekundy mluvení. Pouze datový kontrakt, bez časovače.

Validátor kontroluje existenci a konzistenci řešení, nikoli jejich jazykovou správnost. Zakázané jsou například dvě stejně pojmenované možnosti nebo dvě stejné definice v párování. Jazykově platná alternativa musí být doplněna autorem.

## Obrázky a bezpečnostní hranice

Obrázek je nepovinný; bez obrázku lze použít situaci. `src` musí být lokální cesta pod `/images/`, bez `..`, a `alt` je povinný. Fyzickou existenci souboru a licenci je nutné ověřit při přidávání obsahu. Žádný HTML obsah se nevykresluje pomocí `dangerouslySetInnerHTML`.

Obsah je součástí sestavení. Není zde CMS, síťové načítání, backend, AI ani osobní údaje. V případě chyby validace build skončí neúspěšně; běžící aplikace nezpřístupní neplatný katalog.

## Rozšíření

Nová témata mají přibývat změnou obsahu, nikoli React komponent. Nový druh cvičení bude vyžadovat rozšíření diskriminované unie, validátoru a teprve později vykreslovacího modulu. Teacher Mode, exporty, nahrávání, časovač i náhodné losování zůstávají mimo Etapu 1.
