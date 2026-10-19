# Leas spelavatar

Välkomstbilden är `assets/lea-sigge.webp`. Ansiktet och håret i spelavataren återanvänder denna bild genom en SVG-klippning i `src/avatar.js`; ansiktet nygenereras inte vid klädbyte. Även sminkvyn visar samma källa. Defaultfärgen är blond och eventuell hårfärg maskas utanför det centrala ansiktet.

Kropp och klädsprites skapades med det inbyggda bildverktyget från välkomstbilden. De finns i:

- `assets/characters/lea.webp`
- `assets/characters/lea-trousers.webp`
- `assets/characters/lea-overalls.webp`
- `assets/characters/lea-pajamas.webp`

Bildverktygets PNG-filer har konverterats till WebP med bevarad transparens. Klädfärger och mönster ändras i SVG, med färgmasker för textilen. Ansiktsbilden ligger ovanpå och samma identitet följer med i rum, garderob och berättelser. Originalfotot på barnet finns inte i repot.

## Använda bildprompter

Basbild: isolera Lea från den befintliga välkomstbilden, ta bort hunden och sänk hennes högra arm till sidan. Behåll ansikte, blå ögon, leende, huvudets lutning, blont hår, hudton, rosa T-shirt, lavendelfärgad kjol och vita skor. Behåll illustrerad detaljstil, hela kroppen synlig och transparent bakgrund, ingen text.

Rensning: ta bort bakgrund, gloria och dis runt figuren, behåll figur, färger, ansikte, position och format oförändrade, verklig transparens utanför silhuetten.

Klädvarianter: ändra enbart plaggen till (1) blå raka jeans under samma rosa T-shirt, (2) blå jeanshängselbyxor ovanpå samma rosa T-shirt, (3) lavendelfärgad långärmad pyjamas med långbyxor och en liten ljusgul måne. Behåll person, pose, proportioner, position, 1024 × 1536-format, hår, ansikte, skor och renderingsstil oförändrade; transparent bakgrund utan rekvisita eller text.

De genererade ansiktena används inte som identitetskälla. Välkomstbildens ursprungliga ansikte läggs tillbaka i kod för att undvika drift mellan varianter.
