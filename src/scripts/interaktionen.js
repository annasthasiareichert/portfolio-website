// Alle Bewegungen & Interaktionen der Startseite.
// Läuft im Browser, nachdem die Seite geladen ist.

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
      Auf Touch-Geräten läuft ein sanfter Auto-Sweep, damit der Effekt auch dort lebt. */
const pf = document.querySelector("[data-pf]");
const masthead = document.querySelector(".masthead");
if (pf && masthead && !reduziert) {
  const mats = Array.from(pf.querySelectorAll(".pf-mat"));
  const canvas = masthead.querySelector(".pf-partikel");
  const ctx = canvas ? canvas.getContext("2d") : null;
  const hoverGeraet = window.matchMedia("(hover: hover)").matches;

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

  // Maße von Wort (für die Cursor-Position) und Bühne (für die Partikel-Leinwand)
  let pfRect = pf.getBoundingClientRect();
  let mastRect = masthead.getBoundingClientRect();
  let dpr = Math.min(window.devicePixelRatio || 1, 2);
  const groesseCanvas = () => {
    if (!canvas) return;
    mastRect = masthead.getBoundingClientRect();
    dpr = Math.min(window.devicePixelRatio || 1, 2);
    canvas.width = Math.round(mastRect.width * dpr);
    canvas.height = Math.round(mastRect.height * dpr);
    ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
  };
  const messen = () => { pfRect = pf.getBoundingClientRect(); mastRect = masthead.getBoundingClientRect(); };
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

  // Stil nach Verweildauer wählen (Reihenfolge fest, Überblendung am Ende der Haltezeit)
  const setzeStilNachVerweil = (v) => {
    const n = mats.length;
    const phase = v / HALTEN;
    const cur = Math.floor(phase) % n;
    const naechster = (cur + 1) % n;
    const frac = phase - Math.floor(phase);
    const tf = UEBERBLEND / HALTEN;
    const anteil = frac > 1 - tf ? (frac - (1 - tf)) / tf : 0; // 0…1 Überblendung
    mats.forEach((m, i) => {
      m.style.opacity = i === cur ? String(1 - anteil) : i === naechster ? String(anteil) : "0";
    });
    aktuellerStil = anteil > 0.5 ? naechster : cur;
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
    const parken = !aktiv && br < 0.6;
    pf.style.setProperty("--cx", (parken ? -9999 : bx) + "px");
    pf.style.setProperty("--cy", by + "px");
    pf.style.setProperty("--r", Math.max(0, br) + "px");

    setzeStilNachVerweil(verweil);

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
