# Fabiola's Nails & Beauty: sito web

Sito statico di Fabiola's Nails & Beauty, centro estetico e nail art in Via Alba 46, 00182 Roma.

## Struttura

| Percorso | Contenuto |
|---|---|
| `data/business.mjs` | **Dati centralizzati**: contatti, orari, recensioni, listino prezzi |
| `scripts/build.mjs` | Genera il sito in `dist/` (home, privacy, cookie, 404) dai dati |
| `scripts/immagini.py` | Prepara le foto per il web (WebP + JPEG) da `media/sorgenti/` |
| `css/tokens.css` | Colori, caratteri, spazi, movimento |
| `css/style.css` | Stile delle pagine |
| `js/main.js` | Interazioni: video d'apertura, listino a schede, galleria, "aperto ora", pulsante fisso su mobile |
| `assets/` | Caratteri (licenza SIL OFL), foto e video pronti per il web |
| `media/sorgenti/` | Foto e video di partenza (già senza persone): non vanno online |
| `docs/` | Schermate dell'anteprima |

## Modificare prezzi, orari o contatti

1. Modifica `data/business.mjs`.
2. Esegui `npm run build` (serve Node 18 o superiore, nessuna dipendenza): il sito viene rigenerato in `dist/`.
3. Controlla l'anteprima con `npm run preview` su http://localhost:8080.

Per cambiare le foto: sostituisci il file in `media/sorgenti/` ed esegui `python3 scripts/immagini.py` (serve Pillow).

La cartella `dist/` è generata e non va nel repository.

## Pubblicazione

Il sito **non è ancora pubblicato**. Mancano la P.IVA e il dominio. `netlify.toml` è pronto per quando la pubblicazione sarà autorizzata.

### Anteprima su GitHub Pages

L'anteprima è su https://zeldastudiosr-hue.github.io/Fabiola-nails-beauty-/ ed è pubblicata dal ramo `gh-pages` (Settings → Pages → Deploy from a branch → `gh-pages`, cartella `/ (root)`). Le pagine hanno `noindex`: non compaiono su Google.

Per aggiornarla dopo una modifica: `npm run anteprima` (genera `dist/` per la sottocartella del progetto), poi copia il contenuto di `dist/` nel ramo `gh-pages` insieme a un file vuoto `.nojekyll` e caricalo.
