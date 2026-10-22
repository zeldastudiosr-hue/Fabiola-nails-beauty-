// Genera il sito statico in dist/ a partire da data/business.mjs.
// In dist/ finiscono solo i file pubblici: niente data/, media/ o scripts/.
// Uso: npm run build  (nessuna dipendenza esterna)
import { cpSync, mkdirSync, rmSync, writeFileSync } from "node:fs";
import { fileURLToPath } from "node:url";
import { dirname, join } from "node:path";
import { business as b, orari, recensioni, listino, whatsappUrl, instagramUrl } from "../data/business.mjs";

const root = join(dirname(fileURLToPath(import.meta.url)), "..");
const out = join(root, "dist");
rmSync(out, { recursive: true, force: true });
mkdirSync(out);
const esc = (s) =>
  String(s).replace(/[&<>"']/g, (c) => ({ "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;", "'": "&#39;" })[c]);

const anno = new Date().getFullYear();
const indirizzoCompleto = `${b.indirizzo}, ${b.cap} ${b.citta}`;
const ext = `rel="noopener" target="_blank"`;

/* ---------- Icone (SVG in linea, decorative) ---------- */
const svg = (path, cls = "icon") => `<svg class="${cls}" viewBox="0 0 24 24" aria-hidden="true" focusable="false">${path}</svg>`;
const ico = {
  wa: svg(`<path fill="currentColor" d="M12 2a10 10 0 0 0-8.6 15.1L2 22l5-1.3A10 10 0 1 0 12 2Zm0 18.2a8.2 8.2 0 0 1-4.2-1.2l-.3-.2-3 .8.8-2.9-.2-.3A8.2 8.2 0 1 1 12 20.2Zm4.5-6.1c-.2-.1-1.5-.7-1.7-.8-.2-.1-.4-.1-.6.1l-.8 1c-.1.2-.3.2-.5.1a6.7 6.7 0 0 1-3.3-2.9c-.2-.4.2-.4.7-1.3.1-.2 0-.3 0-.4l-.8-1.8c-.2-.5-.4-.4-.6-.4h-.5a1 1 0 0 0-.7.3 3 3 0 0 0-.9 2.2 5.2 5.2 0 0 0 1.1 2.7 11.8 11.8 0 0 0 4.5 4c1.7.7 2.3.8 3.2.6.5-.1 1.5-.6 1.7-1.2.2-.6.2-1.1.2-1.2-.1-.1-.3-.2-.5-.3Z"/>`),
  tel: svg(`<path fill="none" stroke="currentColor" stroke-width="1.8" stroke-linejoin="round" d="M5 3h4l2 5-2.5 1.5a11 11 0 0 0 6 6L16 13l5 2v4a2 2 0 0 1-2 2A16 16 0 0 1 3 5a2 2 0 0 1 2-2Z"/>`),
  pin: svg(`<path fill="none" stroke="currentColor" stroke-width="1.8" d="M12 21s-7-6.2-7-11.5a7 7 0 0 1 14 0C19 14.8 12 21 12 21Z"/><circle cx="12" cy="9.5" r="2.5" fill="none" stroke="currentColor" stroke-width="1.8"/>`),
  cal: svg(`<rect x="3.5" y="5" width="17" height="15.5" rx="2" fill="none" stroke="currentColor" stroke-width="1.8"/><path d="M3.5 10h17M8 3v4M16 3v4" stroke="currentColor" stroke-width="1.8" stroke-linecap="round"/>`),
  ig: svg(`<rect x="3.5" y="3.5" width="17" height="17" rx="5" fill="none" stroke="currentColor" stroke-width="1.8"/><circle cx="12" cy="12" r="4" fill="none" stroke="currentColor" stroke-width="1.8"/><circle cx="17.2" cy="6.8" r="1.1" fill="currentColor"/>`),
  star: svg(`<path fill="currentColor" d="m12 3 2.7 5.6 6.1.8-4.5 4.2 1.1 6.1L12 16.8l-5.4 2.9 1.1-6.1-4.5-4.2 6.1-.8Z"/>`, "icon icon-star"),
  play: svg(`<path fill="currentColor" d="M8 5.5v13l10.5-6.5Z"/>`),
};
const stelle = `<span class="stars" aria-hidden="true">${ico.star.repeat(5)}</span>`;

/* ---------- Parti comuni ---------- */
const MENU = [
  ["#servizi", "Servizi e prezzi"],
  ["#lavori", "I lavori"],
  ["#centro", "Il centro"],
  ["#recensioni", "Recensioni"],
  ["#dove", "Dove siamo"],
];

const wordmark = (tag = "span") => `<${tag} class="wordmark"><span class="wordmark-script">Fabiola’s</span><span class="wordmark-sans">Nails &amp; Beauty</span></${tag}>`;

const head = ({ title, description, path, extra = "", base = "" }) => `<!doctype html>
<html lang="it">
<head>
<meta charset="utf-8">
${base ? `<base href="${base}">\n` : ""}<meta name="viewport" content="width=device-width, initial-scale=1">
<title>${esc(title)}</title>
<script>document.documentElement.classList.add("js")</script>
<meta name="description" content="${esc(description)}">
${b.sitoUrl ? `<link rel="canonical" href="${esc(b.sitoUrl + path)}">\n<meta property="og:url" content="${esc(b.sitoUrl + path)}">\n<meta property="og:image" content="${esc(b.sitoUrl)}/assets/img/insegna-1024.jpg">\n` : ""}<meta property="og:type" content="website">
<meta property="og:locale" content="it_IT">
<meta property="og:title" content="${esc(title)}">
<meta property="og:description" content="${esc(description)}">
<meta name="theme-color" content="#FFF8F7">
<link rel="icon" href="assets/favicon.svg" type="image/svg+xml">
<link rel="preload" href="assets/fonts/jost-latin-400-normal.woff2" as="font" type="font/woff2" crossorigin>
<link rel="preload" href="assets/fonts/playfair-display-latin-400-normal.woff2" as="font" type="font/woff2" crossorigin>
<link rel="stylesheet" href="css/tokens.css">
<link rel="stylesheet" href="css/style.css">
${extra}
</head>`;

const header = (home) => {
  const p = home ? "" : "index.html";
  return `<a class="skip-link" href="#contenuto">Vai al contenuto</a>
<header class="site-header" data-header>
  <div class="container header-inner">
    <a class="brand" href="${home ? "#top" : "index.html"}" aria-label="${esc(b.nome)}, torna all’inizio">${wordmark()}</a>
    <button class="nav-toggle" type="button" aria-expanded="false" aria-controls="menu" data-nav-toggle>
      <span class="nav-toggle-bars" aria-hidden="true"></span><span class="sr-only">Menu</span>
    </button>
    <nav id="menu" class="site-nav" aria-label="Menu principale" data-nav>
      <ul>
${MENU.map(([h, v]) => `        <li><a href="${p}${h}">${v}</a></li>`).join("\n")}
      </ul>
      <a class="btn btn-small" href="${esc(whatsappUrl())}" ${ext}>${ico.wa}<span>Prenota</span></a>
    </nav>
  </div>
</header>`;
};

const footer = () => `<footer class="site-footer">
  <div class="container footer-inner">
    <div class="footer-brand">
      ${wordmark("p")}
      <p class="footer-claim">${esc(b.slogan)}</p>
    </div>
    <ul class="footer-list">
      <li>${esc(indirizzoCompleto)}</li>
      <li><a href="tel:${esc(b.telefonoLink)}">${esc(b.telefono)}</a></li>
      <li><a href="${esc(instagramUrl())}" ${ext}>Instagram @${esc(b.instagram)}</a></li>
    </ul>
    <ul class="footer-list">
      <li><a href="${esc(b.treatwellUrl)}" ${ext}>Prenota su Treatwell</a></li>
      <li><a href="privacy.html">Informativa privacy</a></li>
      <li><a href="cookie.html">Cookie</a></li>
    </ul>
  </div>
  <div class="container footer-bottom">
    <p>© ${anno} ${esc(b.nome)}${b.partitaIva ? ` · P.IVA ${esc(b.partitaIva)}` : ""}</p>
  </div>
</footer>`;

const stickyCta = `<div class="sticky-cta" data-sticky>
  <a class="sticky-cta-main" href="${esc(whatsappUrl())}" ${ext}>${ico.wa}<span>Prenota su WhatsApp</span></a>
  <a class="sticky-cta-call" href="tel:${esc(b.telefonoLink)}" aria-label="Chiama ${esc(b.telefono)}">${ico.tel}</a>
</div>`;

const scripts = `<script>window.FNB = ${JSON.stringify({ orari: orari.map(({ giorno, apre, chiude }) => ({ giorno, apre, chiude })) })};</script>
<script src="js/main.js" defer></script>`;

const pagina = ({ file, home = false, title, description, path, extra, base, main }) =>
  writeFileSync(
    join(out, file),
    `${head({ title, description, path, extra, base })}
<body${home ? ' id="top"' : ""}>
${header(home)}
<main id="contenuto">
${main}
</main>
${home ? `\n${stickyCta}\n` : ""}
${footer()}
${scripts}
</body>
</html>
`
  );

/* ---------- Immagini responsive ---------- */
const foto = ({ nome, w, h, alt, larghezze, sizes, cls = "", loading = "lazy" }) => `<picture>
  <source type="image/webp" srcset="${larghezze.map((x) => `assets/img/${nome}-${x}.webp ${x}w`).join(", ")}" sizes="${sizes}">
  <img${cls ? ` class="${cls}"` : ""} src="assets/img/${nome}-${larghezze[0]}.jpg" width="${w}" height="${h}" alt="${esc(alt)}" loading="${loading}" decoding="async">
</picture>`;

const LAVORI = [
  { nome: "lavoro-01-rosa-glitter-strass", w: 640, h: 943, alt: "Unghie quadrate rosa nude con punte di glitter rosa e uno strass" },
  { nome: "lavoro-02-french-farfalle-blu", w: 640, h: 594, alt: "French bianca con farfalle blu dipinte, unghie azzurre e blu glitter" },
  { nome: "lavoro-03-bianco-latte-ballerina", w: 640, h: 958, alt: "Unghie lunghe a ballerina color bianco latte con un velo di glitter" },
  { nome: "lavoro-04-tema-mare", w: 640, h: 1085, alt: "Nail art a tema mare: sfumature azzurre e verde acqua, una stella marina e una conchiglia" },
  { nome: "lavoro-05-french-leopardata", w: 640, h: 1008, alt: "Unghie quadrate nude con punta leopardata" },
  { nome: "lavoro-06-rosa-fiocchi-fiore", w: 640, h: 637, alt: "Unghie a mandorla rosa con fiocchi, un fiore rosso e french bianca" },
];

/* ---------- Sezioni della home ---------- */
const prezzoRiga = (v) => `      <li class="price-item">
        <div class="price-row">
          <h4 class="price-name">${esc(v.nome)}</h4>
          <span class="price-leader" aria-hidden="true"></span>
          <p class="price-value">${esc(v.prezzo)}</p>
        </div>${v.dettagli ? `\n        <p class="price-details">${esc(v.dettagli)}</p>` : ""}
      </li>`;

const listinoHtml = `<div class="tabs" data-tabs>
  <div class="tab-list" role="tablist" aria-label="Categorie di servizi" data-tablist hidden>
${listino.map((g, i) => `    <button class="tab" type="button" role="tab" id="tab-${g.id}" aria-controls="listino-${g.id}" aria-selected="${i === 0}" tabindex="${i === 0 ? 0 : -1}">${esc(g.titolo)}</button>`).join("\n")}
  </div>
${listino
  .map(
    (g) => `  <section class="tab-panel" id="listino-${g.id}" aria-labelledby="h-${g.id}" data-panel>
    <div class="tab-panel-head">
      <h3 id="h-${g.id}" class="panel-title">${esc(g.titolo)}</h3>
      <p class="panel-intro">${esc(g.intro)}</p>
    </div>
    <ul class="price-list">
${g.voci.map(prezzoRiga).join("\n")}
    </ul>
    <p class="panel-cta"><a class="link" href="${esc(whatsappUrl(`Ciao Fabiola, vorrei prenotare un servizio (${g.titolo.toLowerCase()}).`))}" ${ext}>Prenota ${esc(g.titolo.toLowerCase())} su WhatsApp <span aria-hidden="true">→</span></a></p>
  </section>`
  )
  .join("\n")}
</div>`;

const orariHtml = `<table class="hours">
  <caption class="sr-only">Orari di apertura</caption>
  <tbody>
${[2, 3, 4, 5, 6, 0, 1]
  .map((i) => {
    const o = orari[i];
    return `    <tr data-day="${i}"><th scope="row">${o.giorno}</th><td>${o.apre ? `${o.apre}–${o.chiude}` : "Chiuso"}</td></tr>`;
  })
  .join("\n")}
  </tbody>
</table>`;

const prenotaAzioni = (cls = "") => `<div class="actions${cls ? ` ${cls}` : ""}">
  <a class="btn" href="${esc(whatsappUrl())}" ${ext}>${ico.wa}<span>Prenota su WhatsApp</span></a>
  <a class="btn btn-ghost" href="${esc(b.treatwellUrl)}" ${ext}>${ico.cal}<span>Prenota su Treatwell</span></a>
</div>`;

const jsonLd = {
  "@context": "https://schema.org",
  "@type": "NailSalon",
  name: b.nome,
  slogan: b.slogan,
  telephone: b.telefonoLink,
  image: b.sitoUrl ? `${b.sitoUrl}/assets/img/insegna-1024.jpg` : undefined,
  url: b.sitoUrl || undefined,
  address: {
    "@type": "PostalAddress",
    streetAddress: b.indirizzo,
    postalCode: b.cap,
    addressLocality: b.citta,
    addressRegion: b.provincia,
    addressCountry: "IT",
  },
  hasMap: b.mapsUrl,
  openingHoursSpecification: [
    {
      "@type": "OpeningHoursSpecification",
      dayOfWeek: ["Tuesday", "Wednesday", "Thursday", "Friday", "Saturday"],
      opens: "10:00",
      closes: "19:00",
    },
  ],
  sameAs: [instagramUrl(), b.treatwellUrl],
  priceRange: "€",
};

pagina({
  file: "index.html",
  home: true,
  title: `${b.nome} · Nail art, ricostruzione unghie ed estetica a Roma`,
  description: `Centro estetico e nail art in ${b.indirizzo} a Roma: ricostruzione unghie, semipermanente, laminazione ciglia, trattamenti viso e corpo, massaggi ed epilazione laser. Prenota su WhatsApp.`,
  path: "/",
  extra: `<link rel="preload" href="assets/img/ingresso-inizio-1280.webp" as="image" type="image/webp">
<script type="application/ld+json">${JSON.stringify(jsonLd)}</script>`,
  main: `  <section class="hero" aria-labelledby="hero-title" data-hero>
    <div class="hero-grid">
    <figure class="hero-media">
      <video class="hero-video" muted playsinline preload="none" width="1280" height="726" poster="assets/img/ingresso-inizio-1280.webp" data-poster-end="assets/img/ingresso-poster-1280.webp" aria-describedby="hero-video-desc" data-hero-video>
        <source src="assets/video/ingresso.webm" type="video/webm">
        <source src="assets/video/ingresso.mp4" type="video/mp4">
      </video>
      <figcaption id="hero-video-desc" class="sr-only">Video: si entra nel centro, si passa accanto alle poltroncine rosa e ci si avvicina alla parete di rose con l’insegna luminosa ${esc(b.nome)}.</figcaption>
      <button class="hero-replay" type="button" data-hero-replay hidden>${ico.play}<span>Rivedi l’ingresso</span></button>
    </figure>
    <div class="hero-copy">
      <div class="container">
        <div class="hero-card">
          <p class="eyebrow">Nail art ed estetica · ${esc(b.citta)}</p>
          <h1 id="hero-title" class="display">Dove la bellezza incontra l’arte della <em>cura di sé</em></h1>
          <p class="lead">Unghie, ciglia, viso e corpo, in un angolo di rose a Roma.</p>
          ${prenotaAzioni()}
          <ul class="hero-facts">
            <li><a href="#recensioni">${stelle}<span><strong>${esc(b.google.voto)}</strong> su Google · ${b.google.recensioni} recensioni</span></a></li>
            <li><span class="open-status" data-open-status>Mar–Sab 10:00–19:00</span></li>
          </ul>
        </div>
      </div>
    </div>
    </div>
  </section>

  <section class="section" id="servizi" aria-labelledby="servizi-title">
    <div class="container">
      <div class="section-head reveal">
        <p class="eyebrow">Servizi e prezzi</p>
        <h2 id="servizi-title" class="display display-md">Il listino</h2>
        <p class="lead">Scegli una categoria per vedere servizi e prezzi.</p>
      </div>
${listinoHtml}
    </div>
  </section>

  <section class="section section-blush" id="lavori" aria-labelledby="lavori-title">
    <div class="container">
      <div class="section-head reveal">
        <p class="eyebrow">I lavori</p>
        <h2 id="lavori-title" class="display display-md">Ogni mano, <em>un’opera</em></h2>
        <p class="lead">Alcune delle nail art realizzate da Fabiola. Ne trovi tante altre su <a href="${esc(instagramUrl())}" ${ext}>Instagram</a>.</p>
      </div>
      <ul class="gallery" data-gallery>
${LAVORI.map(
  (l) => `        <li class="gallery-item reveal">
          <a href="assets/img/${l.nome}-1080.webp" data-lightbox aria-label="Ingrandisci: ${esc(l.alt)}">
            ${foto({ ...l, larghezze: [640, 1080], sizes: "(min-width: 60rem) 33vw, 50vw" }).replace(/\n/g, "\n            ")}
          </a>
        </li>`
).join("\n")}
      </ul>
    </div>
  </section>

  <section class="section" id="centro" aria-labelledby="centro-title">
    <div class="container split">
      <div class="split-copy reveal">
        <p class="eyebrow">Il centro</p>
        <h2 id="centro-title" class="display display-md">Un angolo di rose in <em>Via Alba</em></h2>
        <p class="lead">Appena entri ti accolgono la parete di rose con l’insegna luminosa, il glicine e le poltroncine rosa.</p>
        <p>Un ambiente curato e accogliente, dove Fabiola si prende cura di mani, piedi, viso e corpo. Prenditi il tuo tempo: qui è tutto pensato per farti stare bene.</p>
      </div>
      <div class="split-media">
        <figure class="photo photo-main reveal">
          ${foto({ nome: "centro-sala", w: 800, h: 593, alt: "La sala del centro: parete viola con la parete di rose e l’insegna al neon, poltroncine rosa, glicine e postazione unghie", larghezze: [800, 1280], sizes: "(min-width: 60rem) 40vw, 100vw" }).replace(/\n/g, "\n          ")}
        </figure>
        <figure class="photo photo-side reveal">
          ${foto({ nome: "centro-ingresso", w: 800, h: 597, alt: "L’ingresso del centro con la postazione manicure, il banco e la zona d’attesa", larghezze: [800, 1280], sizes: "(min-width: 60rem) 26vw, 70vw" }).replace(/\n/g, "\n          ")}
        </figure>
      </div>
    </div>
  </section>

  <section class="section section-blush" id="recensioni" aria-labelledby="recensioni-title">
    <div class="container">
      <div class="section-head reveal">
        <p class="eyebrow">Recensioni</p>
        <h2 id="recensioni-title" class="display display-md">${esc(b.google.voto)} su Google</h2>
        <p class="rating">${stelle}<span>${b.google.recensioni} recensioni · aggiornato a ${esc(b.google.aggiornato)}</span></p>
      </div>
      <ul class="reviews">
${recensioni
  .map(
    (r) => `        <li class="review reveal">
          <figure>
            ${stelle}
            <blockquote><p>${esc(r.testo)}</p></blockquote>
            <figcaption>${esc(r.autore)}<span>, recensione su Google</span></figcaption>
          </figure>
        </li>`
  )
  .join("\n")}
      </ul>
      <p class="center"><a class="link" href="${esc(b.mapsUrl)}" ${ext}>Leggi tutte le recensioni su Google <span aria-hidden="true">→</span></a></p>
    </div>
  </section>

  <section class="section" id="dove" aria-labelledby="dove-title">
    <div class="container split split-top">
      <div class="reveal">
        <p class="eyebrow">Dove siamo</p>
        <h2 id="dove-title" class="display display-md">Ti aspettiamo in <em>Via Alba 46</em></h2>
        <address class="address">
          <p>${ico.pin}<span>${esc(indirizzoCompleto)}</span></p>
          <p>${ico.tel}<a href="tel:${esc(b.telefonoLink)}">${esc(b.telefono)}</a> <span class="muted">(anche WhatsApp)</span></p>
          <p>${ico.ig}<a href="${esc(instagramUrl())}" ${ext}>@${esc(b.instagram)}</a></p>
        </address>
        <div class="actions">
          <a class="btn btn-ghost" href="${esc(b.mapsUrl)}" ${ext}>${ico.pin}<span>Indicazioni stradali</span></a>
        </div>
      </div>
      <div class="hours-card reveal">
        <h3 class="panel-title">Orari</h3>
        <p class="open-status open-status-card" data-open-status aria-live="polite"></p>
${orariHtml}
      </div>
    </div>
  </section>

  <section class="section cta-final" aria-labelledby="cta-title">
    <div class="container narrow center reveal">
      <h2 id="cta-title" class="display display-md">Prenota il tuo <em>momento</em></h2>
      <p class="lead">Scrivi a Fabiola su WhatsApp con il servizio che desideri, oppure scegli giorno e ora su Treatwell.</p>
      ${prenotaAzioni("actions-center")}
      <p class="cta-call">Preferisci chiamare? <a href="tel:${esc(b.telefonoLink)}">${esc(b.telefono)}</a></p>
    </div>
  </section>

  <dialog class="lightbox" data-lightbox-dialog aria-label="Foto ingrandita">
    <img src="" alt="" data-lightbox-img>
    <button class="lightbox-close" type="button" data-lightbox-close><span aria-hidden="true">×</span><span class="sr-only">Chiudi</span></button>
    <button class="lightbox-nav lightbox-prev" type="button" data-lightbox-prev><span aria-hidden="true">‹</span><span class="sr-only">Foto precedente</span></button>
    <button class="lightbox-nav lightbox-next" type="button" data-lightbox-next><span aria-hidden="true">›</span><span class="sr-only">Foto successiva</span></button>
  </dialog>`,
});

/* ---------- Pagine legali ---------- */
const legalPage = ({ file, title, description, body }) =>
  pagina({
    file,
    title: `${title} · ${b.nome}`,
    description,
    path: `/${file}`,
    main: `  <section class="section page-top">
    <div class="container narrow legal">
      <h1 class="display display-md">${esc(title)}</h1>
${body}
    </div>
  </section>`,
  });

legalPage({
  file: "privacy.html",
  title: "Informativa sulla privacy",
  description: `Come ${b.nome} tratta i dati personali di chi visita il sito e chiede un appuntamento.`,
  body: `      <p class="legal-updated">Ultimo aggiornamento: ottobre 2026</p>
      <h2>Titolare del trattamento</h2>
      <p>${esc(b.nome)}, ${esc(indirizzoCompleto)}${b.partitaIva ? `, P.IVA ${esc(b.partitaIva)}` : ""}. Telefono e WhatsApp: <a href="tel:${esc(b.telefonoLink)}">${esc(b.telefono)}</a>.</p>
      <h2>Quali dati trattiamo</h2>
      <p>Questo sito non ha moduli, account o archivi propri e non raccoglie dati di chi lo visita. I pulsanti di prenotazione aprono WhatsApp, Treatwell o il telefono: sei tu a decidere se scriverci o chiamarci.</p>
      <p>Se ci contatti, trattiamo i dati che ci comunichi (nome, numero di telefono, servizio richiesto, contenuto del messaggio) solo per rispondere e gestire il tuo appuntamento.</p>
      <h2>Base giuridica</h2>
      <p>Il trattamento serve a rispondere alle tue richieste e a fissare l’appuntamento su tua iniziativa (art. 6, par. 1, lett. b del Regolamento UE 2016/679, GDPR).</p>
      <h2>Per quanto tempo</h2>
      <p>Conserviamo i messaggi per il tempo necessario a gestire la richiesta e l’appuntamento, salvo obblighi di legge (per esempio fiscali).</p>
      <h2>Servizi di terzi</h2>
      <p>Se scegli WhatsApp, il messaggio passa attraverso il servizio di WhatsApp Ireland Limited. Se prenoti su Treatwell, i dati vengono trattati anche da Treatwell secondo la sua informativa. Anche i link a Google Maps e Instagram portano su servizi esterni, con le rispettive informative.</p>
      <p>Il fornitore di hosting del sito può registrare dati tecnici di navigazione (come l’indirizzo IP) per motivi di sicurezza e di funzionamento. Caratteri, foto e video sono ospitati su questo sito e non vengono scaricati da servizi esterni.</p>
      <h2>I tuoi diritti</h2>
      <p>Puoi chiedere in qualsiasi momento di accedere ai tuoi dati, correggerli, cancellarli, limitarne il trattamento od opporti, scrivendoci su WhatsApp o chiamando il <a href="tel:${esc(b.telefonoLink)}">${esc(b.telefono)}</a>. Hai anche il diritto di presentare reclamo al Garante per la protezione dei dati personali (<a href="https://www.garanteprivacy.it" rel="noopener">garanteprivacy.it</a>).</p>`,
});

legalPage({
  file: "cookie.html",
  title: "Cookie",
  description: `Informazioni sui cookie del sito di ${b.nome}.`,
  body: `      <p class="legal-updated">Ultimo aggiornamento: ottobre 2026</p>
      <p>Questo sito <strong>non usa cookie</strong>: né cookie tecnici, né cookie di analisi, né cookie di profilazione. Non ci sono strumenti di statistica, pubblicità, mappe incorporate o pulsanti social che ti tracciano. Per questo non vedi un banner per il consenso.</p>
      <p>Quando apri WhatsApp, Treatwell, Google Maps o Instagram tramite i pulsanti del sito, lasci questo sito: da quel momento valgono le informative di quei servizi.</p>
      <p>Se in futuro il sito userà cookie o strumenti di statistica, questa pagina verrà aggiornata e, quando serve, ti verrà chiesto il consenso prima di attivarli.</p>`,
});

/* ---------- Pagina non trovata ---------- */
pagina({
  file: "404.html",
  title: `Pagina non trovata · ${b.nome}`,
  description: `La pagina che cerchi non esiste. Torna alla home di ${b.nome}.`,
  path: "/404.html",
  // La 404 può comparire su indirizzi annidati: i percorsi devono partire dalla radice
  base: "/",
  extra: `<meta name="robots" content="noindex">`,
  main: `  <section class="section page-top">
    <div class="container narrow center">
      <p class="eyebrow">Errore 404</p>
      <h1 class="display display-md">Questa pagina non esiste</h1>
      <p class="lead">Forse l’indirizzo è cambiato o c’è un errore di battitura.</p>
      <div class="actions actions-center">
        <a class="btn" href="index.html">Torna alla home</a>
        <a class="link" href="index.html#servizi">Servizi e prezzi</a>
      </div>
    </div>
  </section>`,
});

/* ---------- File per i motori di ricerca (solo con il dominio definitivo) ---------- */
if (b.sitoUrl) {
  const oggi = new Date().toISOString().slice(0, 10);
  writeFileSync(
    join(out, "sitemap.xml"),
    `<?xml version="1.0" encoding="UTF-8"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">
${["", "privacy.html", "cookie.html"].map((f) => `  <url><loc>${b.sitoUrl}/${f}</loc><lastmod>${oggi}</lastmod></url>`).join("\n")}
</urlset>
`
  );
  writeFileSync(join(out, "robots.txt"), `User-agent: *\nAllow: /\n\nSitemap: ${b.sitoUrl}/sitemap.xml\n`);
}

/* ---------- File statici ---------- */
for (const dir of ["css", "js", "assets"]) cpSync(join(root, dir), join(out, dir), { recursive: true });

console.log(`Sito generato in dist/: 4 pagine${b.sitoUrl ? ", sitemap.xml, robots.txt" : ""}, css, js, assets`);
