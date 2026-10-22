// Dati centralizzati di Fabiola's Nails & Beauty.
// Fonti: scheda Notion del cliente, listino prezzi pubblicato su Instagram, conferme della titolare (ottobre 2026).
// Modifica qui contatti, orari e prezzi, poi esegui `npm run build`.

export const business = {
  nome: "Fabiola's Nails & Beauty",
  slogan: "Dove la bellezza incontra l’arte della cura di sé",
  titolare: "Fabiola",
  indirizzo: "Via Alba 46",
  cap: "00182",
  citta: "Roma",
  provincia: "RM",
  telefono: "346 475 4063",
  telefonoLink: "+393464754063",
  whatsapp: "393464754063",
  treatwellUrl: "https://www.treatwell.it/salone/fabiola-s-nails-beauty/",
  mapsUrl: "https://maps.app.goo.gl/GQcA6LidXupLcUYP9",
  instagram: "fabiolasnailsebeauty",
  google: { voto: "4,8", recensioni: 120, aggiornato: "novembre 2026" },
  // In attesa: la titolare la comunica in seguito. Senza P.IVA il sito non va pubblicato.
  partitaIva: "",
  // Dominio non ancora scelto: senza indirizzo non si generano canonical e sitemap.
  sitoUrl: "",
};

// Giorni nell'ordine di Date.getDay(): 0 = domenica
export const orari = [
  { giorno: "Domenica", breve: "Dom", apre: null },
  { giorno: "Lunedì", breve: "Lun", apre: null },
  { giorno: "Martedì", breve: "Mar", apre: "10:00", chiude: "19:00" },
  { giorno: "Mercoledì", breve: "Mer", apre: "10:00", chiude: "19:00" },
  { giorno: "Giovedì", breve: "Gio", apre: "10:00", chiude: "19:00" },
  { giorno: "Venerdì", breve: "Ven", apre: "10:00", chiude: "19:00" },
  { giorno: "Sabato", breve: "Sab", apre: "10:00", chiude: "19:00" },
];

export const recensioni = [
  {
    autore: "Diletta Babino",
    testo: "Il centro Fabiola’s nails&beauty offre tantissimi servizi, ambiente molto curato ed accogliente, personale gentile e disponibile! Per tutti i trattamenti e servizi provati mi sono trovata sempre bene, super consigliato!",
  },
  {
    autore: "G K",
    testo: "Mani perfette SEMPRE. Abito dall’altra parte di Roma, ho centri estetici anche sotto il cancello di casa, ma mi faccio la traversata più che volentieri! SUPER!",
  },
];

// Listino dal volantino Instagram (prezzi confermati dalla titolare). Nessuna offerta a tempo.
// Descrizioni brevi riscritte dalla scheda Notion del cliente.
export const listino = [
  {
    id: "unghie",
    titolo: "Unghie",
    intro: "Ricostruzione, coperture e semipermanente, con nail art su misura.",
    voci: [
      { nome: "Ricostruzione unghie", prezzo: "54 €", dettagli: "Unghie sottili ed eleganti, con allungamento o semplice copertura: resistenti, dall’effetto naturale e durature nel tempo." },
      { nome: "Copertura o ritocco (refill)", prezzo: "36 €", dettagli: "Per chi ha già una buona forma e lunghezza e vuole unghie più forti, o per rinnovare una ricostruzione quando l’unghia ricresce." },
      { nome: "Semipermanente mani o piedi", prezzo: "30 €" },
      { nome: "Rimozione semipermanente o gel", prezzo: "6 € · 12 €", dettagli: "6 € il semipermanente, 12 € il gel." },
      { nome: "Riparazione di un’unghia", prezzo: "6 €" },
      { nome: "Manicure", prezzo: "12 €" },
      { nome: "Pedicure", prezzo: "30 €" },
    ],
  },
  {
    id: "ciglia-sopracciglia",
    titolo: "Ciglia e sopracciglia",
    intro: "Laminazioni per uno sguardo definito, senza trucco.",
    voci: [
      { nome: "Laminazione ciglia", prezzo: "60 €", dettagli: "Trattamento alla cheratina che allunga e incurva le ciglia naturali, dando volume e struttura." },
      { nome: "Laminazione sopracciglia", prezzo: "42 €", dettagli: "Disciplina le sopracciglia ribelli e ne fissa la forma, con un’idratazione finale per un risultato naturale." },
    ],
  },
  {
    id: "viso",
    titolo: "Viso",
    intro: "Trattamenti per una pelle luminosa e levigata.",
    voci: [
      { nome: "Pulizia viso", prezzo: "30 €", dettagli: "Per ritrovare luminosità e levigatezza della pelle di viso, collo e décolleté." },
      { nome: "Trattamento viso specifico", prezzo: "65 €" },
      { nome: "Radiofrequenza viso", prezzo: "54 €", dettagli: "Tecnologia non invasiva e indolore per migliorare tono ed elasticità della pelle." },
      { nome: "Microneedling viso", prezzo: "48 €" },
    ],
  },
  {
    id: "corpo-massaggi",
    titolo: "Corpo e massaggi",
    intro: "Trattamenti corpo e massaggi per prenderti un momento per te.",
    voci: [
      { nome: "Massaggio 30 minuti", prezzo: "30 €" },
      { nome: "Massaggio 45 minuti", prezzo: "42 €" },
      { nome: "Scrub corpo e massaggio", prezzo: "50 €" },
      { nome: "Trattamento corpo specifico", prezzo: "75 €" },
      { nome: "Radiofrequenza corpo", prezzo: "73 €", dettagli: "Tecnologia non invasiva e indolore per migliorare tono ed elasticità della pelle." },
      { nome: "Microneedling corpo", prezzo: "60 €" },
      { nome: "Pressoterapia (a seduta)", prezzo: "30 €" },
      { nome: "Fangoterapia", prezzo: "60 €" },
      { nome: "Bendaggio", prezzo: "60 €" },
    ],
  },
  {
    id: "ceretta",
    titolo: "Ceretta",
    intro: "Depilazione con cera per una pelle liscia per settimane.",
    voci: [
      { nome: "Gambe intere", prezzo: "24 €" },
      { nome: "Gambe e inguine", prezzo: "30–34 €" },
      { nome: "Mezza gamba", prezzo: "14 €" },
      { nome: "Mezza gamba e inguine", prezzo: "22–25 €" },
      { nome: "Inguine", prezzo: "9–14 €" },
      { nome: "Ascelle", prezzo: "8 €" },
      { nome: "Braccia", prezzo: "12 €" },
      { nome: "Sopracciglia", prezzo: "6 €" },
      { nome: "Baffetto", prezzo: "6 €" },
    ],
  },
  {
    id: "laser",
    titolo: "Epilazione laser",
    intro: "Epilazione con laser a diodo.",
    voci: [
      { nome: "Zona piccola", prezzo: "da 18 €" },
      { nome: "Zona media", prezzo: "da 30 €" },
      { nome: "Zona grande", prezzo: "da 48 €" },
    ],
  },
];

export const whatsappUrl = (testo = "Ciao Fabiola, vorrei prenotare un appuntamento.") =>
  `https://wa.me/${business.whatsapp}?text=${encodeURIComponent(testo)}`;

export const instagramUrl = () => `https://www.instagram.com/${business.instagram}/`;
