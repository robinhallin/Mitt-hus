# Mitt hus — sammanhängande fotobaserad modell

Ett hus i två våningar med fri gång, en sammanhängande kvartsvängd trappa och redigerbar inredning. Måtten är uppskattningar från fotografierna, inte uppmätta byggmått.

## Kör lokalt

```sh
python3 -m http.server 8000 --directory dist
```

Öppna http://localhost:8000. Inget byggsteg behövs. Three.js och tillägg ligger lokalt i `dist/vendor`.

## Användning

- WASD/piltangenter eller mobilens styrspak: gå. Dra på bilden: titta. Q/E: vrid. Shift: snabbare gång.
- Dörrar och trappan passeras direkt i samma scen. Rumlistan ger valfria genvägar.
- Överblick visar hela den aktuella våningen utan tak. Planvyn visar positionen.
- Inred: välj och dra möbler, byt färg, rotera och ändra storlek. Väggar och golv kan ändras.
- Spara lagrar ändringarna i aktuell webbläsare. Ångra återställer tidigare redigeringar.

## Modell och uppskattningar

Se `PLANLOSNING.md`. `dist/model.js` innehåller rumsgränser, delade öppningar, möbler och mått i meter. `dist/navigation.js` använder samma öppningar som geometrin och en höjdfunktion för trappan. `dist/world.js` bygger alla rum samtidigt; gång mellan rum laddar inte om modellen. Statiska delar grupperas i instanser för färre ritoperationer.

Sparformat 2 använder en ny lagringsnyckel. Sparningar från den tidigare separata rumsmodellen skrivs inte över eller förs över till de ändrade måtten.

Den här offentliga GitHub-kopian innehåller inga originalfoton. Koden döljer fotoreferenser när bilderna saknas. Den privata webbversionen har fotona som jämförelseunderlag.

## Kontroller

```sh
node tests/navigation.mjs
node tests/geometry.mjs
```

Kontrollerna verifierar sammanhängande gång med möbelkollisioner, upp- och nedstigning, gemensamma dörrgränser, giltiga geometrier, rumshöjder, redigering och sparformat. Ingen visuell webbläsargranskning har gjorts för version 2.
