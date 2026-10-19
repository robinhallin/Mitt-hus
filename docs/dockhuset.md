# Leas 3D-dockhus – version 0.8

Rummet är en lokal WebGL-scen med riktiga modeller av Lea, Sigge, möbler och leksaker. Det använder den medföljande MIT-licensierade Three.js-motorn; inga externa resurser behövs för rummet.

## Lek

- Dra kuddarna och filten till mattan för att bygga koja. Bildhjälpen kan placera nästa del. Tänd ficklampan, bjud in Sigge och lyssna på en kort berättelse. Kojan kan plockas ned och byggas igen.
- Dra i garderobens dörrar eller sminkbordets låda. Sigge kan hämta en strumpa; i lådan finns en rosett.
- Flytta nallen och leksakerna mellan golvet, sängen och bordet. Nallen vid tebordet leder till tebjudningen.
- Klappa Sigge med mjuka svep. Han går runt möblerna, vilar och kommer när man kallar.
- Vattna blomman, dra gardinerna, byt mellan dag och kväll och tänd lampan.
- Välj tre motiv från rithörnan till väggarnas ramar. De visar faktiskt sparad färgläggning.

## Pekskärm

Tryck på golvet så går Lea dit. Dra tom yta för att vrida kameran; använd två fingrar för zoom och rotation. Kameraknapparna ger samma kontroll utan flerfingergester. I inredningsläget går möblerna att dra, vända, färga och ta bort. Ogiltig placering visas i rött och sparas inte.

Kameran anpassas till stående och liggande skärm. Grafikens upplösning och bildfrekvens begränsas för surfplattor. När rummet lämnas frigörs grafikresurser och animationerna stoppas. Om WebGL inte kan starta visas den tidigare 2D-vyn.

## Sparning och verifiering

Alla nya värden läggs till befintligt sparformat. Gamla kläder, målningar, möbler och framsteg behålls. Dörrar, gardiner, ljus, möbler, koja, bildramar och kamera sparas lokalt med resten av spelet.

126 tester passerar, inklusive riktiga scenmodeller, kamerans utsnitt, ray/AABB-val, navigering, möbelplacering, kojans hela cykel, sparning och pekhändelser med verklig 3D-projektion. Renderer är utbytt i de automatiska kontrollertesterna. Produktionsgeometrin har granskats genom en separat CPU-rendering. WebGL, full webbläsarlayout och fysisk iPad återstår att verifiera på en riktig enhet.
