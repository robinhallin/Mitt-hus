# Lea & Sigge – Min lilla värld

Ett personligt, lugnt lekspel för Lea och hennes golden retriever Sigge, byggt för surfplatta och iPad. Version 0.6 innehåller ett eget rum, fri möblering, sju lekområden och tre sammanhängande äventyr. Spelet använder svenska, tydliga bilder och stora knappar, med frivillig uppläsning om enheten har en svensk röst.

Den nya [picknickdagen](docs/picknickdagen.md) binder ihop valfri packning, fingerlekar med Sigge, lera och bad, fika och ett eget foto. Fantasiparad, tebjudning och små upptäckter ger skapandet en fortsättning.

## Det går att leka med

- **Mitt rum:** ett illustrerat rum med Lea, Sigge och genvägar till leken.
- **Inred:** lägg till åtta möbeltyper, flytta genom drag, tryck eller pilar, byt färg, vänd och ta bort. Upp till tolv möbler och ångra för de senaste tjugo ändringarna. Möbleringen syns direkt i rummet. Kategorierna Möbler, Flytta & färga och Idéer samt tre rumidéer ger enkla ingångar; idéerna kan ångras.
- **Kläder:** kombinera kjol, byxor, klänning, hängselbyxor och pyjamas med sex färger, fem mönster, solhatt eller krona, tre frisyrer, rosett och skor. Bildkategorier delar upp kläder, hår, accessoarer och sparade stilar. Sexton illustrerade accessoarer används för huvudbonader, hårspännen, glasögon, halsband, väskor och Sigges detaljer. Sex egna favoritstilar kan sparas och återställas med målningen. Klänningens färg väljs gemensamt för hela plagget.
- **Smink:** välj färg och måla egna streck med fingret på kinder, läppar och ögon. Hela huvudet och axlarna ryms i spegeln. Tre penselstorlekar, glitter, målade hjärtan och blommor, lokalt sudd, ångra och tvätta bort finns. En förhandsvisning visar hela stilen. Glasögonen tas tillfälligt av under målningen och syns i förhandsvisningen. Markeringarna sparas och syns på Lea i andra vyer. Ett stillastående tryck målar inte.
- **Pyssel:** måla väggen, rita fritt med fingret i sex färger och placera upp till 24 klistermärken där du vill. Tolv märken kan flyttas med fingret, väljas utan att råka raderas och ångras. Ritningen kan suddas och ångras. Dekorationerna syns också i rummet.
- **Plocka:** sortera sex saker i tre lådor genom att trycka på saken och lådan, eller genom att dra.
- **Sigge:** borsta huvudet, bröstet, tassarna och svansen med verkliga svep. Tvåla, skölj och torka varje del i ordning; lera, lödder och vatten förändras medan fingret rör sig. För benet till munnen, klappa pälsen och dra bollen till Sigge för fångst. Kategorierna Mys & lek, Bada och Fina saker håller verktygen åtskilda. Halsband, halsduk och fluga följer med till rummet.
- **Tänder:** borsta åtta tänder med små cirklar. Beläggningen försvinner gradvis på den tand där fingret rör sig; tryck räcker inte.
- **Äventyr:** picknick med Sigge (inklusive en leta-lek i trädgården), Sigges kalas och en mysig kväll. Berättelserna knyter ihop kläder, pyssel, hundskötsel, organisering och tandborstning. De kan pausas, bytas och återupptas individuellt.
- **Minnen:** sju små aktivitetsminnen och tre äventyrsminnen, utan tidspress, förlust eller krav på att bli klar.

## Kör och bygg

Kräver Node.js 20 eller senare. Inga paket behöver installeras.

```sh
npm start
```

Öppna `http://localhost:4173`. För annan port: `PORT=8080 npm start`.

```sh
npm run build
npm test
```

`dist/` kan läggas på vanlig statisk HTTPS-hosting. Alla resursvägar fungerar även i en undermapp. Service workern gör spelet tillgängligt offline efter ett första onlinebesök på HTTPS eller localhost. Uppläsningens offlinefunktion beror på enhetens röster.

## Sparning

Kläder, smink, pyssel och framsteg sparas automatiskt i webbläsaren på den aktuella enheten under `lea-sigge-world-v1`. Spelmotorn använder ingen extern speltjänst, reklam eller köp. Den publicerade privata webbversionen kräver ägarkontot vid åtkomst. Sparning följer inte automatiskt med till en annan enhet. Att rensa webbplatsdata tar bort framstegen. Spelaren kan upprepa städning, hundskötsel och tandborstning utan att tidigare minnen försvinner.

## Projektstruktur

- `src/state.js` – versionshanterad speldata, validering, sparning och aktivitetsregler.
- `src/app.js` – vyer, pekskärmskontroller och valfri uppläsning/ljud.
- `src/world.js` – möbelkatalog, begränsningar, äventyr och bakåtkompatibel sparvalidering.
- `src/play-views.js` – möblering, äventyrsvyer och trädgårdslek.
- `src/play-art.js` – redigerbar möbel- och trädgårdsgrafik.
- `src/character-layout.js` – gemensam geometri för Sigges bild, skötsel och matning.
- `src/lea-appearance.js` – kompletta frisyr- och klädbilder, identitet, hårfärg och accessoarer.
- `src/wardrobe.js` / `src/accessories.js` – bildkategorier, stilar, illustrerade detaljer och fästpunkter.
- `src/portrait-geometry.js` – separerar spegelutsnittet från sminkets fasta ansiktskoordinater.
- `src/makeup-layer.js` – penselstorlekar, målade hjärtan och blommor samt lokalt sudd.
- `src/avatar.js` – välkomstbildens faktiska ansikte kombinerat med matchande klädsprites; se `docs/avatar.md`.
- `src/touch.js` – lokal sveplängd, kroppsdelar, penseldata och validering.
- `src/touch-controller.js` – fångad pekare, sammanslagna händelser, koordinater och avbrott.
- `src/touch-views.js` / `src/paint-art.js` – levande fingerverktyg, maskad målning och omvårdnadsfeedback.
- `src/art.js` – delad karaktärs- och rumsgrafik.
- `src/style.css` – responsiv layout och rörelseanpassning.
- `assets/lea-sigge.webp` – tidigare skapad karaktärsbild till startskärmen. Originalfotot ingår inte.
- `sw.js` – offlinecache med avgränsad upprensning.
- `tests/` – tester av sparning, spelregler, faktiska applikationshändelser och distributionspaket.

## Verifiering och nästa nivå

Version 0.6 passerar 79 automatiska tester av fingerinteraktioner, lokala kroppsdelar, tvål/skölj/tork, målning/sudd, flerfingerhändelser, fångad pekare, avbrott, koordinater efter storleksändring, alla tre äventyr, gamla och nya sparningar samt app- och offlinepaket. Karaktärsgrafik, nya accessoarer, huvudbonader och kombinationer samt Sigges halsbandsfärger och skötseleffekter är separat renderade och visuellt granskade. 360 kombinationer inklusive hårfärg kontrolleras för kompletta bildkällor och konsekventa porträtt. Full webbläsarlayout och fysisk iPad har ännu inte verifierats i arbetsmiljön. Uppläsning beror på enhetens röster.

## Spela från iPads hemskärm

Öppna den publicerade länken i Safari och välj Dela → Lägg till på hemskärmen. Manifestet har fristående appvisning, egna PNG-ikoner och iPad-ikon. Layouten anpassar sig till liggande och stående läge och håller lekscenen synlig medan verktygsfältet kan rullas. Det är en installerbar webbapp, inte en App Store-app.

Efter ett onlinebesök cachas spelets egna filer. Privat inloggning och enhetens svenska röster kan kräva internet. Webbläsaren kan ha annan lagring än den installerade webbappen; framsteg synkas inte mellan appar/enheter. Sparformatets version och lagringsnyckel är oförändrade och gamla sparningar får nya fält med standardvärden.

Det tidigare husprojektet finns kvar på grenen `archive/house-before-kids-game-2026-10-19` och i Git-historiken.
