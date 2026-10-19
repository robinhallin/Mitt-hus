# Spelbrief – Lea & Sigge

Ett personligt lekspel för femåriga Lea på iPad/surfplatta. Lea gillar kläder, smink, pyssel, organisering och enkla omvårdnadslekar. Hennes följeslagare är golden retrievern Sigge. En delad bild används som inspiration för Lea; originalfotot ska inte ingå i det offentliga kodrepot.

## Första spelbara versionen

Rummet är navet. Därifrån går spelaren till garderoben, spegeln, pysselväggen, sorteringsleken, Sigge och tandborstningen. Kläder, smink, väggfärg och klistermärken syns efter bytet. Framsteg sparas automatiskt på samma enhet. Minnen firar utforskande utan tidspress eller krav på prestation.

Teknik: modulär JavaScript, CSS och redigerbar SVG utan externa körtidsberoenden. Samma kontroller stödjer klick och pekskärm; sortering har ett tryckalternativ till drag. Svenska hjälpröster använder enhetens tillgängliga röster.

## Fortsatt utveckling

Nästa arbete bör utgå från hur Lea faktiskt spelar: justera symboler, storlek, tempo och hjälpröst, utveckla en mer konsekvent karaktärsgrafik och lägg därefter till fri möblering, fler pyssel och korta berättelser med Sigge. Den här versionen har inga köp, annonser eller nätbaserade spelardata.

## Version 0.2 – fri lek och berättelser

Rummet har nu flyttbara möbler i åtta typer med färg, vändning, borttagning och ångra. Samma möblering visas i hemvyn. Garderoben har fem plaggkombinationer, separata underdelsfärger, fem mönster, solhatt och krona.

Tre frivilliga berättelser knyter ihop aktiviteterna: picknick med en leta-lek i trädgården, Sigges kalas och en mysig kväll. Varje berättelse sparar sitt eget steg. Att byta berättelse raderar inte den förra. När en aktivitetsdel förbereds för omspel återställs bara den aktuella aktiviteten; intjänade minnen finns kvar.

Versionen är verifierad med 41 automatiska tester och XML-validering av 36 grafiska varianter. Visuell webbläsargranskning och fysisk iPad återstår.

## Version 0.3 – fingerlek på surfplatta

Hunden borstas lokalt genom rörelse över fem kroppsdelar. Tvål, sköljning och torkning är tre olika steg per del. Smink och fri ritning lagrar faktiska penseldrag med sudd och ångra. Tandborstning kräver rörelse över varje tand. Verktygen följer fingret och scenerna byggs inte om mitt i ett svep. Fångad pekare, sammanslagna pekhändelser och avbrott hanteras gemensamt.

Leas ansikte hämtas direkt från välkomstbilden. Matchande kroppar med flera plagg ger enhetlig karaktärsgrafik; klädfärger maskas så att hud och ansikte bevaras. De tre berättelserna fortsätter använda samma aktiviteter och sparningar.

Appmanifest, PNG-ikoner, säkra skärmkanter och layout i båda riktningar är uppdaterade. Den privata versionen kan läggas på hemskärmen som webbapp. 62 automatiska tester passerar; full browserlayout och fysisk iPad återstår att prova.
