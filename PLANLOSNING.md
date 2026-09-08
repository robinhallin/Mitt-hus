# Underlag och antaganden, modell 2

Alla mått är uppskattade. Bilderna används för inredning, siktlinjer och rumskopplingar. Dörrar omkring 0,9 m, sängar omkring 1,8 × 2,0 m och köksmoduler omkring 0,6 m används som skalreferenser. Fotoperspektiv kan ge stora fel, särskilt i rummens djup.

| Utrymme | Modellmått | Underlag |
|---|---|---|
| Kök och matplats | 3,8 × 7,2 m | Köksdelen, halvön, matbordet, fönsterväggen och bokhyllorna |
| Hall och trappa | 4,2 × 4,9 m | Entré, skjutdörrsgarderob, trappsväng och siktlinjen mot vardagsrummet |
| Lekrum | 4,2 × 2,3 m | Dörr under trappan, leksaksförvaring och heltäckningsmatta |
| Vardagsrum | 8,0 × 3,8 m | Bara delvis synligt genom öppningarna; utsträckning och fönster är osäkra |
| Sovalkov | 4,2 × 2,3 m | Säng, spjälsäng och halvvägg med träöverliggare vid trappan |
| Allrum | 4,2 × 3,8 m | Soffa längs glasräcket, soffbord, öppen TV-hylla och tre fönster-/dörrfält |
| Övre hall | 1,2 × 7,2 m | Sammanbinder trappa, sovalkov, barnrum, kontor och badrum; längden är osäker |
| Barnrum | 2,6 × 3,6 m | Hussäng under snedtak, byrå och fönster |
| Kontor | 2,6 × 1,8 m | Skrivbord, stol och klädförvaring; ingen separat klädkammare antas |
| Sovrum | 3,4 × 3,8 m | Dubbelsäng, spjälsäng vid entrén, byrå, fönster och snedtak |
| Badrum | 2,8 × 3,8 m | Kommod, WC, badkar, dusch och bastudörr |
| Bastu | 1,8 × 2,1 m | Träpanel, lav och aggregat |

Trappan har ungefär 1,05–1,10 m bredd och 2,85 m mellan golvnivåerna. En kort nedre del, ett kvartssvängt vilplan och en rak övre del approximerar den svängda trappan på bilderna. Stegmodellen har öppna trästeg, vit vang och glas-/trähandledare. Gånghöjden följer en jämn ramp för att kameran inte ska hoppa för varje steg. Dörren till lekrummet kan passeras under den övre, högre delen.

Kopplingar som stöds av bilderna:

- Kök/matplats har öppningar mot hallen och vardagsrummet.
- Från lekrummet syns hallen, köksöppningen och vardagsrummet längre bort.
- Trappan kommer upp mellan sovalkovens halvvägg och allrummets glasräcke/soffa.
- Barnrummet ligger vid trappans övre landning.
- Sovrummet och badrummet nås vid allrummets bortre passage; kontoret ligger intill.
- Bastun nås från badrummet.

Husets yttre kontur, fönster som inte syns tydligt och hur alla mått passar mot samma stomme är antaganden. Tomma ytor i planvyn är inte uppfunna rum. Detta är en redigerbar tolkning av husets synliga delar, inte en skannad eller måttexakt kopia. Mått, öppningar och möbelplaceringar kan korrigeras i `dist/model.js` utan att byta navigationsmotor.


## Rättelse, modell 3

Version 2 hade fel höger/vänster-riktning. Rumskoordinater, öppningar, inredning och trappans geometri har speglats tillsammans med gångkollisionerna. Bild 0090 styr glasräcke/allrum till vänster och sovalkov till höger när man går upp; bild 0087 styr kök till höger och entré till vänster sett från lekrummet. Sovalkovens sänghuvud och snedtak har dessutom rättats efter bild 0093. Detta löser identifierade orienteringsfel; det gör inte den tidigare uppskattade planlösningen måttexakt.

Trädgård och garage är ännu inte modellerade eftersom verifierat underlag saknas. Exteriörbilder eller situationsplan behövs för en korrekt rekonstruktion.
