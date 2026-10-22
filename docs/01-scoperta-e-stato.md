# Fabiola's Nails & Beauty: scoperta, decisioni e stato

Data: 22 ottobre 2026
Stato: **anteprima locale pronta, non pubblicata.** Prima di pubblicare servono la P.IVA e il dominio (§5).

## 1. Attività e obiettivo

- **Attività:** centro estetico e nail art in Via Alba 46, 00182 Roma.
- **Azione principale:** "Prenota su WhatsApp" (346 475 4063, confermato dalla titolare), con messaggio già scritto.
- **Azioni secondarie:** prenotare su Treatwell, chiamare, chiedere le indicazioni stradali, aprire Instagram.

## 2. Fatti usati nel sito

| Dato | Valore | Fonte |
|---|---|---|
| Nome e slogan | Fabiola's Nails & Beauty, "Dove la bellezza incontra l'arte della cura di sé" | Notion |
| Indirizzo e telefono | Via Alba 46, 00182 Roma, 346 475 4063 (anche WhatsApp) | Notion, listino, conferma |
| Orari | mar–sab 10:00–19:00, dom e lun chiuso | Notion |
| Google | 4,8, 120 recensioni, aggiornato a novembre 2026 | conferma della titolare |
| Treatwell | treatwell.it/salone/fabiola-s-nails-beauty/ | conferma |
| Instagram | @fabiolasnailsebeauty | conferma |
| Staff | solo il nome di Fabiola | richiesta della titolare |
| Prezzi | listino pubblicato su Instagram, senza offerte | richiesta della titolare |
| Epilazione "da 18/30/48 €" | è il laser a diodo | conferma |
| Recensioni | Diletta Babino, G K (esclusa quella che citava un'altra sede) | screenshot Google |

Decisioni sul listino:
- I prezzi di Notion (fasce tipo 35–50 €, probabilmente da una piattaforma con sconti) non si usano: vale il listino Instagram.
- "54/73 €" e "48/60 €" sono divisi in viso e corpo, come indicato sul listino.
- I pacchetti laser del cartellone nel locale non compaiono (niente offerte).
- La "Laminazione coreana" di Notion non è nel listino Instagram e non compare.
- Le descrizioni brevi vengono da Notion, riscritte senza promesse mediche.

## 3. Materiale e permessi

- La titolare ha dato l'ok a pubblicare le foto e a togliere le persone dalle foto del locale.
- Persone al banco rimosse in locale. Insegna ravvicinata e verticale ripulite dalla titolare.
- Video d'apertura: generato con Higgsfield (MiniMax H3 Max, 20 crediti) dalla foto dell'ingresso fino all'insegna. Gli ultimi fotogrammi, con la foto statica, sono stati tolti su richiesta della titolare. La versione approvata è `media/sorgenti/ingresso-registrazione.mov`.
- Per il web: `assets/video/ingresso.webm` (1,5 MB) e `ingresso.mp4` (2,2 MB), senza audio. La copertina iniziale è il primo fotogramma, quella finale l'insegna.
- Foto dei lavori: nella 02 sono tagliati i pollici in alto (unghia rovinata).
- Caratteri ospitati sul sito (licenza SIL OFL): Playfair Display, Jost, Parisienne.

## 4. Direzione creativa e interazioni

**Idea:** "Il giardino di rose di Via Alba".
- **Colori presi dal locale:** rosa cipria, bianco latte, glicine, oro tenue solo per i filetti, fucsia del neon solo come accento.
- **Movimento:** lento e morbido.

| # | Interazione | Mobile | Con "riduci movimento", risparmio dati o senza JS |
|---|---|---|---|
| 1 | Video d'apertura: parte una volta, si ferma fuori schermo, "Rivedi l'ingresso" | video sopra, testo sotto | insegna ferma e pulsante "Guarda l'ingresso" |
| 2 | Listino a schede, con link diretto (`#listino-viso`) | schede che scorrono | tutte le categorie una sotto l'altra |
| 3 | Galleria con ingrandimento: frecce, swipe, Esc, tasto Indietro | 2 colonne | i link aprono la foto grande |
| 4 | "Aperto ora" calcolato sull'ora di Roma e giorno evidenziato | sì | orari fissi |
| 5 | Pulsante fisso "Prenota su WhatsApp" e chiamata | dopo l'apertura | non compare |

Verifiche fatte (Chromium, 1440×900 e 390×844):
- nessun errore in console e nessuno scorrimento orizzontale;
- schede, galleria, tasto Indietro, menu e link diretti funzionanti;
- "riduci movimento" e pagina senza JavaScript funzionanti;
- contrasti dei testi ≥ 5,6:1.

## 5. Prima di pubblicare

1. **P.IVA** della titolare: obbligatoria nel piè di pagina e nell'informativa privacy (`data/business.mjs`, campo `partitaIva`).
2. **Dominio e hosting**: con il dominio in `sitoUrl` si generano canonical, sitemap e robots.
3. **Autorizzazione esplicita** alla pubblicazione.
4. Facoltativo: un video verticale per il mobile, se piace alla titolare (circa 15–20 crediti Higgsfield).

Il repository su GitHub è **pubblico**: foto e testi sono già visibili a chi conosce l'indirizzo.
