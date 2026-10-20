# Leas rum – version 0.12.0

Rummet är en lokal WebGL-scen med riktiga 3D-modeller av möbler och leksaker samt animerade 3D-modeller av Lea och Sigge. Det använder den medföljande MIT-licensierade Three.js-motorn; inga externa resurser behövs för rummet.

## Lek

- Dra kuddarna och filten till mattan för att bygga koja. Bildhjälpen kan placera nästa del. Tänd ficklampan, bjud in Sigge och lyssna på en kort berättelse. Kojan kan plockas ned och byggas igen.
- Dra i garderobens dörrar eller sminkbordets låda. Sigge kan hämta en strumpa; i lådan finns en rosett.
- Flytta nallen och leksakerna mellan golvet, sängen och bordet. Nallen vid tebordet leder till tebjudningen.
- Klappa Sigge med mjuka svep. Han går runt möblerna, vilar och kommer när man kallar.
- Vattna blomman, dra gardinerna, byt mellan dag och kväll och tänd lampan.
- Välj tre motiv från rithörnan till väggarnas ramar. De visar faktiskt sparad färgläggning.

## Pekskärm

Tryck på golvet så går Lea dit. Den isometriska vinkeln är stabil under vanliga pekgester. Plus och minus förstorar rummet och husknappen återställer hela vyn. I inredningsläget går möblerna att dra, vända, färga och ta bort. Ogiltig placering visas i rött och sparas inte.

Kameran anpassas till stående och liggande skärm. Grafikens upplösning och bildfrekvens begränsas för surfplattor. När rummet lämnas frigörs grafikresurser och animationerna stoppas. Om WebGL inte kan starta visas den tidigare 2D-vyn.

## Sparning och verifiering

Alla nya värden läggs till befintligt sparformat. Gamla kläder, målningar, möbler och framsteg behålls. Dörrar, gardiner, ljus, möbler, koja, bildramar och kamera sparas lokalt med resten av spelet.

151 tester passerar, inklusive riktiga scenmodeller, kamerans utsnitt, ray/AABB-val, navigering, möbelplacering, kojans hela cykel, sparning och pekhändelser med verklig 3D-projektion. Renderer är utbytt i de automatiska kontrollertesterna. Produktionsgeometrin har granskats genom en separat CPU-rendering. WebGL, full webbläsarlayout och fysisk iPad återstår att verifiera på en riktig enhet.


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

## Sammanhållen spelvy och användbarhet (0.10.0)

Den nya skärmen har en samlad bildmeny med sex val. Foto, hjälp och inställningar ligger separat. Leklåda och möbelkatalog öppnas i en stor, stängbar panel. Val på figurer och föremål visas i en liten kontextmeny. Inredningsläget har en synlig Klar-knapp och tjugo steg Ångra. Att gå till en annan aktivitet lämnar inredningsläget. Ljus och ljud uppdateras utan att återskapa scenen. Storleksändringar behåller grafikresurserna och avbryter pågående drag säkert.

Lea och Sigge visas med samma etablerade illustrationer som i de andra aktiviteterna. Figurerna ritas på transparenta, kameravända bildplan i 3D-scenen med djup, golvskuggor och rörelse. Det är en avsiktlig blandning av illustrerade figurer och verklig 3D-inredning. Leas kläder, frisyr, accessoarer och ansiktsmålning används vid bildrenderingen. Pekval följer den synliga silhuetten och ignorerar bildens transparenta kanter. Färdiga bildladdningar kan inte skriva till ett rum som redan lämnats. En enkel lokal figurbild används om SVG-kompositionen inte kan läsas av enheten.

Grundmöbleringen ger garderob, sminkbord och fikabord egna fria ytor. Nya möbler placeras på lediga platser. Möbler och bord får inte överlappa. Småsaker kan inte tappas inne i en stängd garderob. Nallen följer med när fikabordet flyttas. Kuddar faller till golvet när sängen tas bort. Figurer som hamnar i en flyttad möbel får en närliggande fri plats. Kamera och bildutsnitt är stabila och anpassas till surfplatta och bred mobil. Golvdrag och extra fingrar ändrar inte kameran.

148 automatiska tester passerar, inklusive synliga figurers tryckytor, sena bildladdningar, flyttning och avbrott, inredningslägen, ångra, föremålsplacering, små kopptryck samt att hela grundmöbler ryms ovanför bildmenyn. Scengeometri och de faktiska figurtexturerna har granskats i separat CPU-rendering i 1180×820, 1024×768 och 844×390. Kontrollerna i dessa granskningsbilder är schematiska, inte webbläsarskärmbilder. Full webbläsarlayout, Safari/WebGL och fysisk iPad är fortfarande inte verifierade.

Det återanvändbara granskningsskriptet finns i tools/render-room-qa.mjs och använder den redan installerade arbetsmiljöns bildbibliotek. Spelet självt behöver inga installerade paket.

## Material och modeller (0.12)

Rummet har egen lokalt genererad botanisk tapet, målad panel, fiskbensparkett, vävd blomstermatta, quiltat täcke och spegelglas. Gardinerna har tredimensionella veck och en försiktig rörelse. Kontaktskuggor följer möbler, leksaker och figurer; dagsljuset släcks när gardinen dras för eller det blir natt. Garderobens lister, sängens stoppade gavel, sminkbordets bricka och bokryggarna är modellerade och följer möblerna. Leas hår har en sammanhängande skalp och formade lockar för samtliga frisyrer. Ornament med gemensamt material slås ihop inom sitt moderobjekt; dörrar, lådor och animerade delar bevaras.
