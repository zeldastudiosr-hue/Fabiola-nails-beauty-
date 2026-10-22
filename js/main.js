// Fabiola's Nails & Beauty: interazioni del sito. Tutto il contenuto resta leggibile anche senza questo file.
(() => {
  const reduceMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
  const saveData = navigator.connection?.saveData === true;

  // Menu su mobile
  const toggle = document.querySelector("[data-nav-toggle]");
  const nav = document.querySelector("[data-nav]");
  if (toggle && nav) {
    const close = () => {
      nav.classList.remove("is-open");
      toggle.setAttribute("aria-expanded", "false");
    };
    toggle.addEventListener("click", () => {
      const open = !nav.classList.contains("is-open");
      nav.classList.toggle("is-open", open);
      toggle.setAttribute("aria-expanded", String(open));
    });
    nav.addEventListener("click", (e) => { if (e.target.closest("a")) close(); });
    document.addEventListener("keydown", (e) => {
      if (e.key === "Escape" && nav.classList.contains("is-open")) { close(); toggle.focus(); }
    });
  }

  // Intestazione con filetto dopo lo scorrimento
  const header = document.querySelector("[data-header]");
  const onScroll = () => header?.classList.toggle("is-scrolled", window.scrollY > 8);
  window.addEventListener("scroll", onScroll, { passive: true });
  onScroll();

  // 1. Apertura: l'ingresso nel centro fino all'insegna, una volta sola.
  // Con "riduci movimento" o risparmio dati si vede l'insegna ferma e il video parte solo a richiesta.
  const video = document.querySelector("[data-hero-video]");
  const replay = document.querySelector("[data-hero-replay]");
  if (video && replay) {
    const label = replay.querySelector("span");
    const showEnd = () => { video.poster = video.dataset.posterEnd; };
    const play = () => {
      replay.hidden = true;
      video.currentTime = 0;
      video.play().catch(() => {
        showEnd();
        label.textContent = "Guarda l’ingresso";
        replay.hidden = false;
      });
    };
    video.addEventListener("ended", () => {
      label.textContent = "Rivedi l’ingresso";
      replay.hidden = false;
    });
    replay.addEventListener("click", play);

    if (reduceMotion || saveData) {
      showEnd();
      label.textContent = "Guarda l’ingresso";
      replay.hidden = false;
    } else {
      video.preload = "auto";
      play();
    }

    // Fuori dallo schermo il video si ferma; riprende quando torna visibile
    if ("IntersectionObserver" in window) {
      new IntersectionObserver(([entry]) => {
        if (!entry.isIntersecting && !video.paused) { video.pause(); video.dataset.resume = "1"; }
        else if (entry.isIntersecting && video.dataset.resume) { delete video.dataset.resume; video.play().catch(() => {}); }
      }, { threshold: 0.25 }).observe(video);
    }
  }

  // 2. Listino a schede (senza JavaScript tutte le categorie restano visibili una sotto l'altra)
  const tabs = document.querySelector("[data-tabs]");
  if (tabs) {
    const list = tabs.querySelector("[data-tablist]");
    const buttons = [...list.querySelectorAll("[role=tab]")];
    const panels = [...tabs.querySelectorAll("[data-panel]")];
    panels.forEach((p, i) => {
      p.setAttribute("role", "tabpanel");
      p.setAttribute("aria-labelledby", buttons[i].id);
      p.tabIndex = 0;
    });
    list.hidden = false;
    const select = (i, { focus = false, hash = false } = {}) => {
      buttons.forEach((b, j) => {
        const on = i === j;
        b.setAttribute("aria-selected", String(on));
        b.tabIndex = on ? 0 : -1;
        panels[j].hidden = !on;
      });
      panels[i].classList.remove("is-entering");
      void panels[i].offsetWidth;
      if (!reduceMotion) panels[i].classList.add("is-entering");
      // Porta in vista la scheda scelta solo dentro la barra delle schede, senza far scorrere la pagina
      const b = buttons[i];
      if (b.offsetLeft < list.scrollLeft || b.offsetLeft + b.offsetWidth > list.scrollLeft + list.clientWidth) {
        list.scrollTo({ left: b.offsetLeft - 16, behavior: reduceMotion ? "auto" : "smooth" });
      }
      if (focus) buttons[i].focus();
      if (hash) history.replaceState(null, "", `#${panels[i].id}`);
    };
    buttons.forEach((b, i) => {
      b.addEventListener("click", () => select(i, { hash: true }));
      b.addEventListener("keydown", (e) => {
        const n = buttons.length;
        const to = { ArrowRight: (i + 1) % n, ArrowLeft: (i - 1 + n) % n, Home: 0, End: n - 1 }[e.key];
        if (to !== undefined) { e.preventDefault(); select(to, { focus: true, hash: true }); }
      });
    });
    // Collegamento diretto a una categoria, per esempio #listino-viso
    const fromHash = () => {
      const i = panels.findIndex((p) => `#${p.id}` === location.hash);
      if (i >= 0) { select(i); tabs.closest("section")?.scrollIntoView(); }
      return i >= 0;
    };
    if (!fromHash()) select(0);
    window.addEventListener("hashchange", fromHash);
  }

  // 3. Galleria con ingrandimento
  const dialog = document.querySelector("[data-lightbox-dialog]");
  const links = [...document.querySelectorAll("[data-lightbox]")];
  if (dialog && links.length && typeof dialog.showModal === "function") {
    const img = dialog.querySelector("[data-lightbox-img]");
    let current = 0;
    let opener = null;
    const show = (i) => {
      current = (i + links.length) % links.length;
      const thumb = links[current].querySelector("img");
      img.src = links[current].href;
      img.alt = thumb.alt;
    };
    const close = () => { if (dialog.open) dialog.close(); };
    links.forEach((a, i) =>
      a.addEventListener("click", (e) => {
        e.preventDefault();
        opener = a;
        show(i);
        dialog.showModal();
        history.pushState({ lightbox: true }, "");
      })
    );
    dialog.querySelector("[data-lightbox-close]").addEventListener("click", close);
    dialog.querySelector("[data-lightbox-prev]").addEventListener("click", () => show(current - 1));
    dialog.querySelector("[data-lightbox-next]").addEventListener("click", () => show(current + 1));
    dialog.addEventListener("click", (e) => { if (e.target === dialog) close(); });
    dialog.addEventListener("keydown", (e) => {
      if (e.key === "ArrowRight") show(current + 1);
      if (e.key === "ArrowLeft") show(current - 1);
    });
    // Swipe orizzontale sul telefono
    let x0 = null;
    dialog.addEventListener("touchstart", (e) => { x0 = e.touches[0].clientX; }, { passive: true });
    dialog.addEventListener("touchend", (e) => {
      if (x0 === null) return;
      const dx = e.changedTouches[0].clientX - x0;
      if (Math.abs(dx) > 50) show(current + (dx < 0 ? 1 : -1));
      x0 = null;
    });
    // Il tasto Indietro chiude la foto invece di lasciare la pagina
    dialog.addEventListener("close", () => {
      if (history.state?.lightbox) history.back();
      opener?.focus();
    });
    window.addEventListener("popstate", close);
  }

  // 4. Aperto ora: calcolato sull'ora di Roma
  const orari = window.FNB?.orari;
  const statusEls = document.querySelectorAll("[data-open-status]");
  if (orari && statusEls.length) {
    const parts = Object.fromEntries(
      new Intl.DateTimeFormat("en-GB", { timeZone: "Europe/Rome", weekday: "short", hour: "2-digit", minute: "2-digit", hour12: false })
        .formatToParts(new Date())
        .map((p) => [p.type, p.value])
    );
    const day = ["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"].indexOf(parts.weekday);
    const now = `${parts.hour}:${parts.minute}`;
    const oggi = orari[day];
    let state, text;
    if (oggi.apre && now >= oggi.apre && now < oggi.chiude) {
      state = "open";
      text = `Aperto ora · chiude alle ${oggi.chiude}`;
    } else {
      state = "closed";
      let d = day, offset = 0;
      if (oggi.apre && now < oggi.apre) text = `Chiuso ora · apre oggi alle ${oggi.apre}`;
      else {
        do { d = (d + 1) % 7; offset++; } while (!orari[d].apre);
        const quando = offset === 1 ? "domani" : orari[d].giorno.toLowerCase();
        text = `Chiuso ora · riapre ${quando} alle ${orari[d].apre}`;
      }
    }
    statusEls.forEach((el) => { el.dataset.state = state; el.textContent = text; });
    document.querySelector(`.hours tr[data-day="${day}"]`)?.classList.add("is-today");
  }

  // 5. Comparsa morbida delle sezioni
  const reveals = document.querySelectorAll(".reveal");
  if (!reduceMotion && "IntersectionObserver" in window) {
    const io = new IntersectionObserver((entries) => {
      entries.forEach((e) => { if (e.isIntersecting) { e.target.classList.add("is-visible"); io.unobserve(e.target); } });
    }, { rootMargin: "0px 0px -8% 0px" });
    reveals.forEach((el) => io.observe(el));
  } else {
    reveals.forEach((el) => el.classList.add("is-visible"));
  }

  // 6. Pulsante fisso su mobile: compare dopo l'apertura
  const sticky = document.querySelector("[data-sticky]");
  const hero = document.querySelector("[data-hero]");
  if (sticky && hero && "IntersectionObserver" in window) {
    new IntersectionObserver(([e]) => sticky.classList.toggle("is-visible", !e.isIntersecting), { threshold: 0 }).observe(hero);
  } else {
    sticky?.classList.add("is-visible");
  }
})();
