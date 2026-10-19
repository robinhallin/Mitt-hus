# Lea och Sigges spelgrafik

Välkomstbilden är `assets/lea-sigge.webp`. Leas faktiska ansiktsdrag återanvänds med en klippning i `src/lea-appearance.js`. Klippningen stannar innanför ansiktet så att gammalt hår inte följer med över en ny frisyr. Samma bildval, hårfärg och accessoarer används i rum, garderob, berättelser och sminkspegel. Penseldragen använder samma ansiktskoordinater i alla vyer.

## Kompletta frisyrer och kläder

`assets/characters/` innehåller tolv transparenta Lea-sprites: kjol, byxor, hängselbyxor och pyjamas, vardera med utsläppt hår, hästsvans eller två tofsar. Klänningen använder kjolens form med en gemensam färg och ett gemensamt mönster. Frisyrerna ersätter hela frisyren; inga extra platta hårformer läggs ovanpå det utsläppta håret.

Bildverktygets PNG-filer är konverterade till WebP med bevarad transparens. Textilmasker färgar kläder och bevarar textur, sömmar och hud. Hårfärgningen kombinerar en geometrisk mask med en färgmask som utesluter rosa/blå textil. Skorna färgas med en separat ljusnivå och mask för att bevara detaljer och undvika byxfållar. Rosetterna placeras vid den valda frisyrens fästen eller på solhatten. Krona och solhatt har gradienter och ytstruktur.

## Sigge

`assets/characters/sigge.webp` är en isolerad, detaljerad Sigge från välkomstbilden, med rekonstruerad sida där Lea tidigare stod. Ansikte, päls, sittande pose, svans och halsband följer originalillustrationen. Halsbandets tyg färgas med en pixelmask; guldspänne och namnbricka behålls.

`src/character-layout.js` är gemensam källa för bildformat, fem kroppsdelar och mun. Bild, fingerkoordinater, matning och skötseleffekter använder samma geometri. Lera, lödder och vatten maskas till hundens silhuett. Huvudets effekt är mindre för att hålla lödder ovanför ögonen. Befintliga sparningar behåller fem regioners framsteg.

## Bildprompter

Bas: isolera Lea från välkomstbilden, ta bort hunden och sänk höger arm till sidan. Behåll identitet, ögon, leende, huvudlutning, kläder, skor, illustrerad detaljstil och transparent bakgrund.

Kläder: ändra endast plaggen till blå jeans under rosa T-shirt, blå hängselbyxor över samma T-shirt eller lavendelfärgad långärmad pyjamas med gul måne. Behåll person, pose, proportioner, position och 1024 × 1536-format.

Frisyrer: ändra endast håret till en naturligt uppsatt hög blond hästsvans eller två blonda tofsar med små rosa hårsnoddar. Ta bort allt gammalt utsläppt hår och visa hals och plagg där det tidigare låg. Bevara exakt ansikte, pose, kläder, bildformat och placering; varm detaljerad målad stil och verklig transparens.

Sigge: isolera bara hunden från välkomstbilden, behåll samma individuella ansikte, uttryck, päls, turkosa halsband med guldspänne och rund bricka. Återskapa den skymda sidan, ta bort Lea och hennes hand, visa hela hunden med tassar och svans mot transparent bakgrund.

Originalfotot på barnet ingår inte i repot.
