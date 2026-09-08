# Mitt hus 🏠

Ett 3D-spel för att utforska Robins hus och prova inredning.

**Spela:** https://mitt-hus-robin.robinrhallin.chatgpt.site (privat för ägaren).

## Funktioner

- Nio rum, två våningar och dörrar mellan rummen.
- Gå runt med WASD/piltangenter eller mobilens styrspak; dra för att titta.
- Överblick i 3D och ett inredningsläge för att flytta möbler.
- Lägg till, rotera, ändra storlek och färgsätt möbler.
- Byt väggfärg och golv, prova dagsljus och kvällsljus.
- Ångra ändringar och spara i den aktuella webbläsaren.

Modellen tolkar foton och är ungefärlig. Planlösning, mått och kopplingar är inte en uppmätt ritning.

## Kör lokalt

Ingen installation eller byggning behövs. Starta en vanlig HTTP-server i `dist`:

```bash
python3 -m http.server 8000 --directory dist
```

Öppna sedan http://localhost:8000. Öppna genom HTTP-servern, inte genom att dubbelklicka på HTML-filen.

## Kod

- `dist/index.html` – gränssnittet.
- `dist/app.js` – reglage, val av möbler, ångra och sparning.
- `dist/model.js` – rum, möbelkatalog, placering, kollision och kontroll av sparningar.
- `dist/world.js` – 3D-modeller, kameror och spelkontroller.
- `dist/style.css` – utseende och mobilanpassning.
- `dist/vendor/` – Three.js 0.180.0 med dess MIT-licens. Hjälpmodulerna använder lokala importvägar.

## Fotoreferenser och sparningar

Originalfotona ingår inte i detta offentliga repo. Saknade foton döljs automatiskt; 3D-spelet fungerar ändå. Den privata spelsidan har fotoreferenserna. Se `dist/photos/README.md` för lokala foton.

Knappen **Spara** använder webbläsarens lokala lagring. Sparningar synkas inte mellan enheter.

GitHub-repot innehåller spelkoden. Den privata spelsidan publiceras separat; det finns ingen automatisk publicering från GitHub.
