// Alle Bewegungen & Interaktionen der Startseite.
// Läuft im Browser, nachdem die Seite geladen ist.

import { starteWortGummi } from "./wort-gummi.js";

const reduziert = window.matchMedia("(prefers-reduced-motion: reduce)").matches;

/* 1) Erscheinen beim Scrollen */
const beobachter = new IntersectionObserver((es) => {
  es.forEach((e) => {
    if (e.isIntersecting) {
      e.target.classList.add("in-view");
      beobachter.unobserve(e.target);
    }
  });
}, { threshold: 0.15 });
document.querySelectorAll(".auftritt").forEach((el) => beobachter.observe(el));

/* 1b) Kopfzeile: am Seitenanfang mit dem Hintergrund verschmelzen (kein Streifen),
       beim Scrollen den Frosted-Streifen einblenden (Klasse .gescrollt) */
const kopfzeile = document.querySelector("header");
if (kopfzeile) {
  const kopfPruefen = () => kopfzeile.classList.toggle("gescrollt", window.scrollY > 16);
  kopfPruefen();
  window.addEventListener("scroll", kopfPruefen, { passive: true });
}

/* 2) Wegscroll des Hero + 3) Parallax */
const hero = document.getElementById("hero");
const parallaxEls = document.querySelectorAll("[data-parallax]");
if (!reduziert && hero) {
  let ticking = false;
  window.addEventListener("scroll", () => {
    if (ticking) return;
    ticking = true;
    requestAnimationFrame(() => {
      const y = window.scrollY, vh = window.innerHeight;
      const p = Math.min(y / vh, 1);
      hero.style.transform = `translateY(${-y * 0.22}px) scale(${1 - p * 0.05})`;
      hero.style.opacity = `${1 - p * 0.85}`;
      parallaxEls.forEach((el) => {
        const f = parseFloat(el.dataset.parallax);
        const mitte = el.getBoundingClientRect().top + y - vh / 2;
        el.style.transform =
          `translateY(${(y - mitte) * f}px)` +
          (el.classList.contains("drift") ? " translateX(-50%)" : "");
      });
      ticking = false;
    });
  }, { passive: true });
}

/* 4) Hover-Bild-Reveal, folgt dem Cursor */
const reveal = document.getElementById("reveal");
const platte = document.getElementById("reveal-platte");
let zielX = 0, zielY = 0, istX = 0, istY = 0, aktiv = false;
if (!reduziert && reveal && platte && window.matchMedia("(hover: hover)").matches) {
  document.querySelectorAll(".index-zeile a").forEach((a) => {
    a.addEventListener("mouseenter", () => {
      aktiv = true;
      reveal.style.backgroundImage = "url('" + a.dataset.bild + "')";
      platte.textContent = a.querySelector(".titel").textContent;
      reveal.classList.add("sichtbar");
    });
    a.addEventListener("mouseleave", () => {
      aktiv = false;
      reveal.classList.remove("sichtbar");
    });
  });
  window.addEventListener("mousemove", (e) => {
    zielX = e.clientX; zielY = e.clientY;
  }, { passive: true });
  (function animiere() {
    istX += (zielX - istX) * 0.12;
    istY += (zielY - istY) * 0.12;
    const rot = Math.max(-7, Math.min(7, (zielX - istX) * 0.14));
    reveal.style.transform =
      `translate(${istX}px, ${istY}px) translate(-50%,-50%) scale(${aktiv ? 1 : 0.9}) rotate(${rot}deg)`;
    requestAnimationFrame(animiere);
  })();
}

/* 4b) Sicherheitsnetz für evtl. verbliebene Platzhalter-Links (data-soon oder href="#"):
       nicht nach oben springen lassen. Projekte & Lebenslauf sind inzwischen echte Seiten. */
document.querySelectorAll('a[data-soon], .nav-links a[href="#"]').forEach((a) => {
  a.addEventListener("click", (e) => e.preventDefault());
});

/* 5) Sprachumschalter DE/EN */
const langButtons = document.querySelectorAll(".sprache button");
function setzeSprache(lang) {
  document.documentElement.lang = lang;
  document.querySelectorAll("[data-" + lang + "]").forEach((el) => {
    el.innerHTML = el.getAttribute("data-" + lang);
  });
  langButtons.forEach((b) => b.classList.toggle("aktiv", b.dataset.lang === lang));
}
langButtons.forEach((b) => b.addEventListener("click", () => setzeSprache(b.dataset.lang)));

/* 6) Masthead-Wort „PORTFOLIO" (noth.in-Effekt):
      Grundzustand = flache schwarze Grafik über dem Porträt. Rund um den Cursor
      bläht sich ein KLEINER, stark „flüssiger" (gooey) Bereich zu aufgeblasener
      Folienschrift auf; die schwarze Schrift wird dort ausgestanzt.
      WELCHER Stil erscheint, hängt von der VERWEILDAUER des Cursors ab (nicht von
      der Stelle im Wort): pink → pink-hell → chrom → holo, jeder Stil wird lange
      gehalten und dann übergeblendet. Zusätzlich fliegen Partikel mit der Bewegung.
      Auf Touch-Geräten läuft ein sanfter Auto-Sweep, damit der Effekt auch dort lebt.

      NEU — das Wort ist „Gummi": Wenn WebGL verfügbar ist, zeichnet wort-gummi.js
      alle Wort-Ebenen auf zwei Leinwände und verformt sie organisch. Die Schrift
      wabert ständig ganz leicht, schmiegt sich beim Hover zum Cursor, und beim
      KLICKEN-UND-HALTEN klebt sie am Cursor: Ziehen nimmt die Materie mit (auch
      über die Kontur hinaus), Loslassen federt wackelnd zurück. Die Physik dazu
      (Zug, Feder, Quetscher) steht hier unten; gezeichnet wird im Modul.
      Ohne WebGL läuft alles wie bisher über die DOM-Ebenen + SVG-Maske. */
const pf = document.querySelector("[data-pf]");
const masthead = document.querySelector(".masthead");
if (pf && masthead && !reduziert) {
  const mats = Array.from(pf.querySelectorAll(".pf-mat"));
  const canvas = masthead.querySelector(".pf-partikel");
  const ctx = canvas ? canvas.getContext("2d") : null;
  const hoverGeraet = window.matchMedia("(hover: hover)").matches;

  // WebGL-Gummi starten (null → alter DOM-Weg bleibt aktiv)
  const glVorne = masthead.querySelector(".pf-gl-vorne");
  const gummi = glVorne
    ? starteWortGummi({
        solid: masthead.querySelector(".pf-solid"),
        kontur: pf.querySelector(".pf-outline"),
        mats,
        hinten: masthead.querySelector(".pf-gl-hinten"),
        vorne: glVorne,
      })
    : null;
  let glAn = false;      // true, sobald die Leinwände die <img>-Ebenen ersetzen
  let gummiTot = false;  // WebGL-Kontext verloren → dauerhaft zurück zum DOM-Weg
  if (gummi) gummi.beiVerlust(() => {
    gummiTot = true; glAn = false;
    masthead.classList.remove("wort-gl");
  });

  // Wie lange ein Stil gehalten wird, bis der nächste kommt (Sekunden)
  const HALTEN = 2.4;      // ← größer = Stile wechseln seltener
  const UEBERBLEND = 0.55; // Dauer der Überblendung zwischen zwei Stilen
  const farben = ["#ff2fa0", "#ff8dd0", "#e9edf2", "#8a7bff"]; // pink · pink-hell · chrom · holo

  // Material-Grafiken erst bei Bedarf laden (hält den ersten Seitenaufbau leicht)
  let geladen = false;
  const ladeMaterialien = () => {
    if (geladen) return;
    geladen = true;
    mats.forEach((m) => { if (m.dataset.src) m.src = m.dataset.src; });
  };

  // Maße von Wort (für die Cursor-Position), Bühne (Partikel) und Gummi-Leinwand
  let pfRect = pf.getBoundingClientRect();
  let mastRect = masthead.getBoundingClientRect();
  let glRect = glVorne ? glVorne.getBoundingClientRect() : mastRect;
  let dpr = Math.min(window.devicePixelRatio || 1, 2);
  const messen = () => {
    pfRect = pf.getBoundingClientRect();
    mastRect = masthead.getBoundingClientRect();
    if (glVorne) glRect = glVorne.getBoundingClientRect();
  };
  const groesseCanvas = () => {
    messen();
    dpr = Math.min(window.devicePixelRatio || 1, 2);
    if (canvas) {
      canvas.width = Math.round(mastRect.width * dpr);
      canvas.height = Math.round(mastRect.height * dpr);
      ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
    }
    if (gummi && !gummiTot) gummi.groesse(glRect.width, glRect.height, dpr);
  };
  groesseCanvas();
  window.addEventListener("resize", groesseCanvas, { passive: true });
  window.addEventListener("scroll", messen, { passive: true });

  // Blob-Radius (klein, responsiv). ← kleiner Wert = kleinerer aufgeblasener Bereich
  const radiusZiel = () => Math.min(Math.max(window.innerWidth * 0.07, 56), 128);

  let zx = -9999, zy = 0;              // Ziel-Position des Blobs (px im Wort)
  let bx = -9999, by = 0, br = 0;      // tatsächliche Blob-Position + Radius
  let aktiv = false;
  let verweil = 0;                     // aufsummierte Verweildauer auf dem Wort (s)
  let aktuellerStil = 0;
  let autoT = 0;                       // Phase für den Touch-Auto-Sweep
  let letzteZeit = 0;

  // „Gummi"-Zustand (nur mit WebGL benutzt) — alles in px auf der Gummi-Leinwand
  let mausX = -9999, mausY = 0;        // Cursor auf der Leinwand
  let griffAktiv = false;              // gerade gedrückt gehalten?
  let griffX = 0, griffY = 0;          // wo festgehalten wurde (rutscht langsam nach)
  let griffZX = -9999, griffZY = 0;    // Zentrum der Verformung (= Cursor beim Halten)
  let zugX = 0, zugY = 0;              // aktuelle Auslenkung der Materie
  let zugVX = 0, zugVY = 0;            // Feder-Geschwindigkeit fürs Zurückwackeln
  let druck = 0;                       // Quetsch-Impuls beim Anfassen/Loslassen
  let magnet = 0;                      // 0..1 Hover-Anschmiegen
  let revealWert = 0;                  // 0..1 weiches Ein-/Ausblenden des Reveals

  // Stil nach Verweildauer wählen (Reihenfolge fest, Überblendung am Ende der
  // Haltezeit). Liefert die Deckkraft je Material — angewendet wird sie unten:
  // im DOM-Weg auf die <img>, im WebGL-Weg als Shader-Uniform.
  const stilAnteile = (v) => {
    const n = mats.length;
    const phase = v / HALTEN;
    const cur = Math.floor(phase) % n;
    const naechster = (cur + 1) % n;
    const frac = phase - Math.floor(phase);
    const tf = UEBERBLEND / HALTEN;
    const anteil = frac > 1 - tf ? (frac - (1 - tf)) / tf : 0; // 0…1 Überblendung
    aktuellerStil = anteil > 0.5 ? naechster : cur;
    return mats.map((_, i) => (i === cur ? 1 - anteil : i === naechster ? anteil : 0));
  };

  // Partikel
  const partikel = [];
  const MAXP = 260;
  const spawnPartikel = (x, y, dx, dy) => {
    const tempo = Math.hypot(dx, dy);
    const anzahl = Math.min(5, 1 + Math.floor(tempo / 7));
    for (let i = 0; i < anzahl; i++) {
      if (partikel.length > MAXP) partikel.shift();
      const winkel = Math.atan2(dy, dx) + (Math.random() - 0.5) * 1.5;
      const v = tempo * (0.1 + Math.random() * 0.22) + Math.random() * 1.3;
      const farbe = aktuellerStil === 3
        ? "hsl(" + Math.floor(Math.random() * 360) + ",90%,66%)" // holo → bunt
        : farben[aktuellerStil];
      partikel.push({
        x, y,
        vx: Math.cos(winkel) * v + dx * 0.05,
        vy: Math.sin(winkel) * v + dy * 0.05 - 0.4,
        leben: 1,
        grosse: 1.8 + Math.random() * 3.8,
        farbe,
      });
    }
  };

  let letzteMX = 0, letzteMY = 0, habePrev = false;
  if (hoverGeraet) {
    pf.addEventListener("pointerenter", (e) => {
      ladeMaterialien(); messen();
      zx = e.clientX - pfRect.left; zy = e.clientY - pfRect.top;
      bx = zx; by = zy; // Blob am Cursor einblenden, nicht hereinfliegen
      aktiv = true; pf.classList.add("aktiv");
    });
    pf.addEventListener("pointermove", (e) => {
      zx = e.clientX - pfRect.left; zy = e.clientY - pfRect.top;
      const mx = e.clientX - mastRect.left, my = e.clientY - mastRect.top;
      if (habePrev) spawnPartikel(mx, my, mx - letzteMX, my - letzteMY);
      letzteMX = mx; letzteMY = my; habePrev = true;
    }, { passive: true });
    pf.addEventListener("pointerleave", () => {
      aktiv = false; pf.classList.remove("aktiv"); habePrev = false;
    });
  } else {
    // Touch / kein Hover: sanfter Dauer-Sweep über das Wort
    ladeMaterialien();
    aktiv = true; pf.classList.add("aktiv");
  }

  // Klicken-und-Halten: die Schrift am Cursor festhalten und mitziehen.
  // Nur sinnvoll, wenn der WebGL-Gummi läuft (der DOM-Weg kann nicht verformen).
  if (gummi) {
    // Cursor-Position auf der Gummi-Leinwand immer mitschreiben
    pf.addEventListener("pointermove", (e) => {
      mausX = e.clientX - glRect.left;
      mausY = e.clientY - glRect.top;
    }, { passive: true });

    pf.addEventListener("pointerdown", (e) => {
      ladeMaterialien(); messen();
      mausX = e.clientX - glRect.left;
      mausY = e.clientY - glRect.top;
      griffAktiv = true;
      griffX = mausX; griffY = mausY;
      griffZX = mausX; griffZY = mausY;
      zugVX = 0; zugVY = 0;
      druck = 0.25; // kurzes Einquetschen beim Anfassen
      pf.classList.add("gegriffen");
      // Zeiger „einfangen": Bewegungen kommen weiter bei uns an,
      // auch wenn der Cursor das Wort beim Ziehen verlässt
      try { pf.setPointerCapture(e.pointerId); } catch (_) {}
      // Maus: keine native Bild-Zieh-Geste/Textauswahl starten
      if (e.pointerType !== "touch") e.preventDefault();
    });

    const loslassen = () => {
      if (!griffAktiv) return;
      griffAktiv = false;
      druck = -0.18; // kleiner „Plopp" beim Loslassen
      pf.classList.remove("gegriffen");
    };
    window.addEventListener("pointerup", loslassen, { passive: true });
    window.addEventListener("pointercancel", loslassen, { passive: true });
  }

  const tick = (ts) => {
    const dt = letzteZeit ? Math.min((ts - letzteZeit) / 1000, 0.05) : 0;
    letzteZeit = ts;

    if (aktiv) verweil += dt; // Verweildauer läuft nur, solange der Cursor auf dem Wort ist

    // Touch-Auto-Sweep: Zielpunkt über das Wort schicken + Partikel streuen
    if (!hoverGeraet && aktiv) {
      const vorX = zx, vorY = zy;
      autoT += dt * 0.6;
      zx = pfRect.width * (0.5 + 0.42 * Math.sin(autoT));
      zy = pfRect.height * (0.5 + 0.22 * Math.sin(autoT * 1.7));
      const mx = (pfRect.left - mastRect.left) + zx, my = (pfRect.top - mastRect.top) + zy;
      spawnPartikel(mx, my, zx - vorX, zy - vorY);
    }

    // Blob weich nachziehen
    bx += (zx - bx) * 0.16;
    by += (zy - by) * 0.16;
    br += ((aktiv ? radiusZiel() : 0) - br) * 0.12;

    const ops = stilAnteile(verweil);

    // „Gummi"-Physik: Zug zum Cursor bzw. Zurückfedern nach dem Loslassen
    if (gummi && !gummiTot) {
      if (griffAktiv) {
        // Zugvektor = Cursor minus Haltepunkt; je weiter gezogen wird, desto
        // mehr „rutscht" das Material (Gummi-Widerstand statt harter Kopplung)
        const dx = mausX - griffX, dy = mausY - griffY;
        const nachgeben = 1 / (1 + Math.hypot(dx, dy) / 420);
        zugX += (dx * nachgeben - zugX) * Math.min(1, dt * 14);
        zugY += (dy * nachgeben - zugY) * Math.min(1, dt * 14);
        zugVX = 0; zugVY = 0;
        // Haltepunkt gibt ganz langsam nach — wie Kaugummi, der sich setzt
        griffX += dx * Math.min(1, dt * 0.8);
        griffY += dy * Math.min(1, dt * 0.8);
        griffZX = mausX; griffZY = mausY;
      } else {
        // gedämpfte Feder: schnappt mit ein, zwei Wacklern zurück in Form
        zugVX += (-110 * zugX - 9 * zugVX) * dt;
        zugVY += (-110 * zugY - 9 * zugVY) * dt;
        zugX += zugVX * dt; zugY += zugVY * dt;
      }
      druck += -druck * Math.min(1, dt * 5);
      magnet += ((hoverGeraet && aktiv && !griffAktiv ? 1 : 0) - magnet) * Math.min(1, dt * 8);
      revealWert += ((aktiv ? 1 : 0) - revealWert) * Math.min(1, dt * 6);

      // Umschalten auf die Leinwände, sobald Solid + Kontur als Texturen da sind
      if (!glAn && gummi.bereit()) {
        glAn = true;
        masthead.classList.add("wort-gl");
      }
      if (glAn) {
        const ox = pfRect.left - glRect.left, oy = pfRect.top - glRect.top;
        gummi.zeichne({
          zeit: ts / 1000,
          wort: [ox, oy, pfRect.width, pfRect.height],
          blob: [ox + bx, oy + by, Math.max(0, br)],
          reveal: revealWert,
          matOp: ops,
          maus: [mausX, mausY],
          magnet,
          magnetR: radiusZiel() * 1.6,
          griff: [griffZX, griffZY],
          zug: [zugX, zugY],
          druck,
          griffR: Math.min(Math.max(pfRect.width * 0.13, 110), 240),
          wabern: pfRect.width * 0.0022,
        });
      }
    }

    // DOM-Weg (ohne WebGL bzw. bis die Leinwände bereit sind):
    // SVG-Masken-Kreis + Material-Deckkraft direkt an den Elementen setzen
    if (!glAn) {
      const parken = !aktiv && br < 0.6;
      pf.style.setProperty("--cx", (parken ? -9999 : bx) + "px");
      pf.style.setProperty("--cy", by + "px");
      pf.style.setProperty("--r", Math.max(0, br) + "px");
      mats.forEach((m, i) => { m.style.opacity = String(ops[i]); });
    }

    // Partikel bewegen & zeichnen (mit sanftem Glühen für mehr Dynamik)
    if (ctx) {
      ctx.clearRect(0, 0, mastRect.width, mastRect.height);
      for (let i = partikel.length - 1; i >= 0; i--) {
        const p = partikel[i];
        p.vx *= 0.94; p.vy = p.vy * 0.94 + 0.05; // leichte Schwerkraft
        p.x += p.vx; p.y += p.vy;
        p.leben -= dt / 1.4; // ~1,4 s Lebensdauer
        if (p.leben <= 0) { partikel.splice(i, 1); continue; }
        ctx.globalAlpha = Math.max(0, p.leben);
        ctx.fillStyle = p.farbe;
        ctx.shadowColor = p.farbe;
        ctx.shadowBlur = 8;
        ctx.beginPath();
        ctx.arc(p.x, p.y, p.grosse * (0.4 + 0.6 * p.leben), 0, Math.PI * 2);
        ctx.fill();
      }
      ctx.globalAlpha = 1;
      ctx.shadowBlur = 0;
    }

    requestAnimationFrame(tick);
  };
  requestAnimationFrame(tick);

  // Materialien nach dem ersten Aufbau im Leerlauf vorladen (ruckelfreier erster Hover)
  if ("requestIdleCallback" in window) requestIdleCallback(ladeMaterialien, { timeout: 2500 });
  else setTimeout(ladeMaterialien, 1800);
}
