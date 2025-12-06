
**Készítette**: Seres Botond

**Verzió**: V.100 (Production 1) 2025.12.06. 23:52

**URL**: https://botondseres.github.io/burned-calculator/

**Leírás**: A weblapon néhány egyszerű egészségügyi alapadat megadása után a felhasználó megismerheti az ebből következtető adatait, mint bazális anyagcsere, bmi, ideális testsúly, stb. Ezután a következő oldalon rögzítheti az aznapi sport/mozgás aktivitását, és megnézheti a teljes napi energia a fogyasztását, és annak megoszlását.

**Egyedi javascript logika elérése**: ./code/js/calculations.js
	
	Leírása: A weboldal üzleti logikája a különböző egészségügyi adatok számításával foglalkozik. Többek között itt számolok BMI-t, ideális testsúlyt, kalória égetést az adott sport tevékenységekhez (MET adatokból), stb. Ezt a modult több helyen importálom az oldalak saját script-jeiben és használom fel a benne található függvényeket.
	
**Egyedi Font típus**: Roboto

	Helye: https://fonts.googleapis.com/css2?family=Roboto:ital,wght@0,100..900;1,100..900&display=swap

# KÜLSŐ FORRÁSOK ÉS KÓDRÉSZLETEK:

## Bulma CSS Framework v1.0.4
- Letöltés: https://github.com/jgthms/bulma/releases/tag/1.0.4
- Fájlok: css\bulma\css\bulma.css
- Weboldal: https://bulma.io/documentation/
- Használat: 
  * Alap layout: navbar, űrlap kontrollok, gombok, grid, reszponzivitás
  * CSS mintaként többszörösen felhasznált: színek, spacing, tipográfia
  * Személyre szabás a saját CSS-ekben:
    - Színpaletta és egyéb változók felülírása 
    - Saját slider styling natív range inputra
    - Egyedi tipográfiai finomhangolások
    - Reszponzivitás beállítása a bulma által biztosított flexbox lehetőségekkel.


## Materialize Ikon készlet
- Letöltés: https://fonts.googleapis.com/icon?family=Material+Icons
- Weboldal: https://materializecss.com/icons.html
- Használat: 
  * Inline ikonmeghívás

## Chart.js modul könyvtár
- Letöltés: https://cdn.jsdelivr.net/npm/chart.js@4.5.1/dist/chart.umd.min.js
- Weboldal: https://www.chartjs.org/
- Használat: 
  * Végső megjelenítő oldalon a kördiagram generálása.

## Google Fonts
- Használat:
	- A feladatban megjelölt külső forrásból származó betűtípus szolgáltatása. (Roboto)
