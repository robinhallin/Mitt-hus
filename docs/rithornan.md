# Leas rithörna (0.7)

Öppnas från **🖍️ Rithörnan** i rummet, från dockan eller från Pyssel. Sju bildval visas med riktiga förhandsbilder: Lea och Sigge i trädgården, på picknick, i bubbeljakt, på fantasiparad, vid hundbadet och hemma i rummet, samt ett tomt papper för fritt ritande.

Välj någon av 18 färger och dra fingret över bilden. Tre penselstorlekar, en färghink, lokalt sudd, ångra och gör om finns. Hjälp med kanterna låser ett penseldrag till den sammanhängande yta där fingret börjar; den kan stängas av. Konturerna ligger ovanpå färgen och kan aldrig suddas bort. Färghinken fyller samma ursprungliga bildytor oberoende av befintlig färgläggning.

Varje motiv sparas automatiskt separat med den befintliga sparningen. Bildvalet visar tidigare arbete; det går att växla utan att förlora färgerna. **Sätt i albumet** visar bilden bland Mina målarbilder, med en länk tillbaka för att fortsätta måla. Albumbilden följer den aktuella teckningen. Ett tomt motiv får en albumplats efter att det har målats. **Nytt på samma bild** är en ångringsbar tömning.

En fingerpekare fångas åt gången. Avbrott, navigation, ändrad skärmstorlek och bakgrundsläge bevarar det ritade. Ångra/gör om är lokal redigeringshistorik för aktuell spelstund; färgoperationerna sparas mellan besök. Upp till 160 färgoperationer per motiv lagras, med högst 128 kompakta punkter i ett penseldrag. När gränsen nås lämnas bilden intakt, och spelaren kan ångra eller välja annat motiv. All bilddata och spelkod finns i offlinecachen.

## Implementation och kontroll

- `coloring.js`: validerat målarbokstillstånd, pekkoordinater, gestkontroll och sammanhängande bildytor.
- `coloring-canvas.js`: färglager under originalkonturer, maskad pensel, färghink, sudd och återskapning. Enbart den ursprungliga linjebilden styr maskerna. Bildladdning har generationskontroll så att sena svar inte kan måla på nästa motiv.
- `coloring-views.js` och `coloring.css`: pappersyta, bildväljare, färger, verktyg och album. Samma kvadratiska koordinater används även när skärmen ändrar format.

Bygge, 110 automatiska tester och diffkontroll godkända. Tester täcker separata motiv, sparning, äldre sparningar, regiongränser, penseldrag och avbrott, extra fingrar, färghink, tomt papper, gränser, navigation och offlinepaket. Utöver dessa har alla sex faktiska bilder körts genom samma Canvas-målare som spelet använder: fyllning, kantmaskning, sudd och återskapning av färger verifierades med pixelkontroller, och en sammansatt målning granskades visuellt. Full webbläsarlayout och fysisk iPad är inte verifierade i arbetsmiljön.

## Bilder och prompt

Sex nya illustrationer skapades med det inbyggda bildverktyget och `assets/lea-sigge.webp` som identitetsreferens. De finns i `assets/coloring/{garden,picnic,bubbles,parade,bath,room}.webp`, paketerade från de genererade PNG-bilderna. Samtliga linjebilder granskades visuellt.

Gemensam prompt: “One square digital coloring-book page for a five-year-old. Preserve recognizable little Lea with shoulder-length side-parted hair and golden retriever Sigge with collar and round tag from the identity reference. Polished adorable children's coloring book, clean black outlines on pure white, all areas uncolored, no shading, no dense fur texture. Broad closed contours and large colorable regions, happy faces, full bodies. No text, letters, numbers, watermarks or product mockup.”

Motivprompter:

1. Lea och Sigge vattnar en stor blomma i trädgården, med fjärilar, sol och moln.
2. Lea och Sigge på filt med nalle, picknickkorg, äpple, hundkex och ett träd.
3. Lea blåser stora såpbubblor och Sigge sträcker nosen mot en bubbla.
4. Lea med krona och fantasiklänning, Sigge med fluga, regnbåge och stjärnor.
5. Lea tvättar Sigge i hundbadet med svamp, bubblor, handduk och badanka.
6. Lea, Sigge och nallen på en matta i rummet, med bokhylla, kudde, växt och fönster.
