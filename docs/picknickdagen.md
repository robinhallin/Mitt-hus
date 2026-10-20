# Picknickdagen (0.6)

Gå till **🧺 Picknickdag** i rummet. Välj upp till tre saker genom att trycka på bilderna eller dra dem till korgen. Äpple och hundkex följer alltid med. Packningen väljer vilka lekar som syns; det går även att gå ut med en tom korg. Boll, bubblor och vattenkanna ger egna fingerlekar. Nalle och regnbågsfilt förändrar picknicken.

Bollen dras från marken och släpps ute på gräset. Sigge springer ut, hämtar och kommer tillbaka. Först då räknas hämtningen. Vart tredje fynd är en strumpa. Att lämna scenen under ett kast avbryter kastet. Magklappen börjar med mjuka svep, och bubblor skapas genom rörelse. Sigge går fram och försöker fånga dem med nosen. Vattenkannan får blomman att växa; därefter följer fjärilen fingret.

Pölen gör tassarna leriga och lämnar avtryck i rummet. Hundbadet använder samma tvåla–skölj–torka-system som tidigare. Badet tar bort leran från Sigge; avtrycken städas separat genom att svepa över dem. Både följder och framsteg sparas mellan besök.

På filten dras maten till två separata tallrikar. Efter dukningen går det att spara dagens bild och börja en ny picknick med andra saker. Ingen timer eller förlust finns.

## Skapande och upptäckter

- Kläder och ansiktsmålning följer med till fantasiparaden. Där väljs bakgrund, pose och en av tre enkla, lokalt syntetiserade melodier. Ljudknappen styr både musik och uppläsning. Animationer och musik stoppas vid navigation eller när spelet tappar fokus.
- Inredningen följer med till tebjudningen. Välj en leksaksgäst, dra kannan till en kopp och håll kvar för att hälla låtsaste. Jordgubbar dras till gästerna. Dukningen kan göras om.
- Lådan, byrån och kudden i rummet kan öppnas genom drag eller tryck. Fynd visas i bildsamlingen.
- Albumet lagrar åtta självständiga bilder med kläder, målning, rum och faktiska sceninställningar. Senare ändringar påverkar inte sparade bilder. Radera en bild för att ge plats åt en ny. Det är bilder av spelscener, inte foton från en kamera.

## Teknik och kontroll

`playday.js` äger bestående tillstånd. `play-controller.js` äger en pekgest åt gången och tillfällig animation. `playday-views.js` och `playday.css` visar spelen. Den befintliga sparnyckeln och sparversion 1 behålls; nya fält har validerade standardvärden. Alla nya moduler, stilar och Sigges rörelsebild ingår i offlinecachen.

Kontroll: `npm run build` och `npm test`. Tester omfattar rörelse och återhämtning, inga belöningar vid avbrott eller extra fingrar, packningsval, dukning, badets följder, fotonas oberoende och omladdning. Ingen körning på en fysisk iPad har gjorts. Intern webbläsar-QA saknar tillgänglig control-browser i den här miljön; surfplattornas visuella layout behöver granskas på enheten.

## Grafik

Tillagd spelresurs: `assets/characters/sigge-play.webp`. Den är skapad med det inbyggda bildverktyget, med `assets/characters/sigge.webp` som identitetsreferens. Den används som fyra CSS-rutor för löpsteg och magposer; originalbilden används när Sigge sitter. Rörelseposernas halsband är turkost; valda halsbandsfärger och accessoarer syns i sittande poser och foton.

Prompt: “Production game sprite sheet on a truly transparent background, same golden retriever Sigge and polished soft detailed children's storybook illustration as reference, golden fur, teal collar, gold tag, friendly brown eyes. Strict 2x2 grid, whole dog per quadrant. Top: two opposite phases of a right-facing gallop. Bottom: two happy belly-up tummy-rub poses. Full body, no scenery, no labels or text.”
