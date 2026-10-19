# Lea & Sigge – Min lilla värld

Ett personligt, lugnt lekspel för Lea och hennes golden retriever Sigge, byggt för surfplatta och iPad. Version 0.2 innehåller ett eget rum, fri möblering, sju lekområden och tre sammanhängande äventyr. Spelet använder svenska, tydliga bilder och stora knappar, med frivillig uppläsning om enheten har en svensk röst.

## Det går att leka med

- **Mitt rum:** ett illustrerat rum med Lea, Sigge och genvägar till leken.
- **Inred:** lägg till åtta möbeltyper, flytta genom drag, tryck eller pilar, byt färg, vänd och ta bort. Upp till tolv möbler och ångra för de senaste tjugo ändringarna. Möbleringen syns direkt i rummet.
- **Kläder:** kombinera kjol, byxor, klänning, hängselbyxor och pyjamas med sex färger, fem mönster, solhatt eller krona, tre frisyrer, rosett och skor. Den valda stilen visas på Lea och följer med tillbaka till rummet.
- **Smink:** prova färger på kinder, läppar och ögon, och tvätta bort dem igen.
- **Pyssel:** måla väggen och placera upp till 24 klistermärken där du vill. Dekorationerna syns också i rummet.
- **Plocka:** sortera sex saker i tre lådor genom att trycka på saken och lådan, eller genom att dra.
- **Sigge:** borsta pälsen, tvätta fem lerfläckar, ge mat och välj halsband.
- **Tänder:** borsta åtta tänder rena med tryck eller svep.
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

Kläder, smink, pyssel och framsteg sparas automatiskt i webbläsaren på den aktuella enheten under `lea-sigge-world-v1`. Ingen inloggning, extern speltjänst, reklam eller köp behövs. Sparning följer inte automatiskt med till en annan enhet. Att rensa webbplatsdata tar bort framstegen. Spelaren kan upprepa städning, hundskötsel och tandborstning utan att tidigare minnen försvinner.

## Projektstruktur

- `src/state.js` – versionshanterad speldata, validering, sparning och aktivitetsregler.
- `src/app.js` – vyer, pekskärmskontroller och valfri uppläsning/ljud.
- `src/world.js` – möbelkatalog, begränsningar, äventyr och bakåtkompatibel sparvalidering.
- `src/play-views.js` – möblering, äventyrsvyer och trädgårdslek.
- `src/play-art.js` – redigerbar möbel- och trädgårdsgrafik.
- `src/art.js` – redigerbar SVG-grafik för Lea, Sigge och rummet.
- `src/style.css` – responsiv layout och rörelseanpassning.
- `assets/lea-sigge.webp` – tidigare skapad karaktärsbild till startskärmen. Originalfotot ingår inte.
- `sw.js` – offlinecache med avgränsad upprensning.
- `tests/` – tester av sparning, spelregler, faktiska applikationshändelser och distributionspaket.

## Verifiering och nästa nivå

Version 0.2 passerar 41 automatiska tester av spelregler, hela äventyrsflöden, navigering, faktiska klick- och pekhändelser, möbeldrag med ångra/avbrott, migration av gamla sparningar och offlinepaket. 36 SVG-varianter är XML-validerade. Webbläsarrendering och fysisk iPad har ännu inte verifierats i denna arbetsmiljö. Uppläsning och ljud beror på enheten. Spelet har ännu inte testats av Lea på en fysisk surfplatta. Fler rum, djupare pyssel och återkoppling från verkligt spelande är naturliga nästa steg. Sparformatets version och lagringsnyckel är oförändrade; nya fält läggs till med säkra standardvärden.

Det tidigare husprojektet finns kvar på grenen `archive/house-before-kids-game-2026-10-19` och i Git-historiken.
