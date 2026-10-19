# Leas 3D-dockhus – version 0.9

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

136 tester passerar, inklusive riktiga scenmodeller, kamerans utsnitt, ray/AABB-val, navigering, möbelplacering, kojans hela cykel, sparning och pekhändelser med verklig 3D-projektion. Renderer är utbytt i de automatiska kontrollertesterna. Produktionsgeometrin har granskats genom en separat CPU-rendering. WebGL, full webbläsarlayout och fysisk iPad återstår att verifiera på en riktig enhet.


## Liggande spelvy och mer liv (0.9)

Rummet fyller spelområdet med infällbar leklåda. I liggande läge visas inga permanenta sidopaneler, sidrubriker eller navigationsfält runt rummet. Den vänstra bildraden öppnar Lea, Sigge, aktiviteter och inredning. Alla tidigare aktiviteter finns kvar i lådan och får en tätare liggande layout. På stående skärm visas en uppmaning att vända enheten; det går att fortsätta stående. Manifestet önskar liggande visning. Operativsystemets stöd avgör om orienteringen kan låsas; iPad Safari kan kräva att enheten vrids manuellt.

Lea har krage, sömmar, knappar, skodetaljer, tygmönster, hårlockar, fräknar, ögonfransar och blinkningar. Hon vänder sig mot kameran när hon stannar och kan vinka, hoppa och dansa. Sigge följer med i dansen. Rummet har vimplar, ljusslinga, namnskylt, korg, bok och tofflor. Väggens tidigare pyssel och målning visas även i 3D.

Dra bollen till en ledig golvplats: den flyger i en liten båge, Sigge hämtar den i munnen och lämnar den på golvet. Leken kan upprepas. Dra tekannan över en kopp och håll kvar: mängden te ökar gradvis. Tryck på koppen för en klunk, bjud nallen och Sigge eller duka om. Skattjakten växlar mellan att lyfta en kudde, dra ut lådan och leta bland böckerna. Den väljer bara platser som finns kvar. En fullt vattnad blomma får en fjäril som följer fingrets rörelse i rummet.

Fotoknappen sparar en faktisk bild från 3D-renderaren i albumet, som mest fyra rumsfoton. Foton, te, skattjakt och valda inställningar valideras och sparas utan att äldre sparningar förloras. Fotona går att ta bort individuellt.

136 automatiska tester passerar. De nya testerna kör hela apportcykeln med den faktiska bollmodellen, verklig projicerad kannrörelse och hållning, bild- och sparvalidering, sökregler, Leas poser samt applikationens faktiska menyroutning. Ingen riktig webbläsare eller fysisk iPad har kunnat testas i arbetsmiljön. Geometrin granskas separat genom CPU-rendering; det verifierar inte WebGL-belysning eller faktisk pekskärmskänsla.

## Rummet över hela skärmen (0.9.1)

Spelkameran visar rummet inifrån, med golv och väggar genom hela bildytan. Den tidigare kameran som anpassade hela dockhusets ytterkanter används inte längre för spel. Lea visas som minst 30 procent av bildhöjden i de testade liggande skärmformaten. Verktyg är överlägg och ändrar aldrig kamerans projektion eller rummets storlek.

Två fasta knappar öppnar Lek och Inred. Tryck på figurer och möbler ger små bildval direkt i rummet. I inredningsläge går det att dra möbler direkt och välja vridning eller färg. Leklådan har en ingång till lekar inne i rummet och till alla tidigare aktiviteter. Canvas och spelbehållare är låsta till hela den tillgängliga webbytan.

137 tester passerar, inklusive regressionstest av rummets faktiska kameraskala och bildtäckning, oförändrad kamera när menyer öppnas samt de befintliga drag-, apport- och teinteraktionerna. Den nya scenen är separat CPU-renderad och visuellt granskad. Fysisk iPad och faktisk WebGL-rendering har fortfarande inte kunnat verifieras här.
