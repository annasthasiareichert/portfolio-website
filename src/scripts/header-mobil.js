// Mobile-Header: zweizeiliges „PORTFOLIO" als Gummi-Schrift.
//
// Warum ein eigenes Modul? Der Desktop-Header (interaktionen.js, Block 6) arbeitet
// mit dem einzeiligen Wort und Maus/Hover. Auf dem Handy sollen stattdessen die
// zweizeiligen Eigen-Grafiken laufen — mit Finger-Gesten statt Cursor:
//   • WAAGERECHT über die Schrift wischen → die pinke Folie taucht auf, klebt am
//     Finger, wird gezogen/verzerrt und streut Partikel.
//   • SENKRECHT (schnell) wischen → das Wort wabert dem Scrollen nach; die Seite
//     scrollt dabei ganz normal weiter (die Geste bleibt beim Browser).
//
// Gezeichnet & verformt wird mit demselben WebGL-Renderer wie am Desktop
// (wort-gummi.js). Der Desktop-Code bleibt komplett unberührt.

import { starteWortGummi } from "./wort-gummi.js";

export function starteHeaderMobil() {
  const schmal = window.matchMedia("(max-width: 760px)").matches;
  const reduziert = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
  // Auf breiten Schirmen und bei „weniger Bewegung" bleiben die statischen
  // Grafiken stehen — dann tut dieses Modul nichts.
  if (!schmal || reduziert) return;

  const masthead = document.querySelector(".masthead");
  if (!masthead) return;
  const solid   = masthead.querySelector(".pfm-solid");
  const outline = masthead.querySelector(".pfm-outline");
  const pink    = masthead.querySelector(".pfm-pink");
  const glHinten = masthead.querySelector(".pfm-gl-hinten");
  const glVorne  = masthead.querySelector(".pfm-gl-vorne");
  const canvas   = masthead.querySelector(".pfm-partikel");
  if (!solid || !outline || !pink || !glHinten || !glVorne) return;

  // Pinke Folie erst laden, wenn sie gebraucht wird (hält den ersten Aufbau leicht)
  const ladePink = () => { if (pink.dataset.src && !pink.src) pink.src = pink.dataset.src; };

  // WebGL-Renderer starten (eine pinke „Material"-Ebene). null → kein WebGL:
  // dann bleiben die statischen Grafiken einfach stehen.
  const gummi = starteWortGummi({
    solid, kontur: outline, mats: [pink],
    hinten: glHinten, vorne: glVorne,
  });
  if (!gummi) return;

  const ctx = canvas ? canvas.getContext("2d") : null;

  /* ---- Maße (Wort, Bühne, Leinwand) ------------------------------------- */
  let wortRect = solid.getBoundingClientRect();     // das zweizeilige Wort
  let mastRect = masthead.getBoundingClientRect();   // Bühne (Partikel-Koordinaten)
  let glRect   = glVorne.getBoundingClientRect();    // Gummi-Leinwand
  let dpr = Math.min(window.devicePixelRatio || 1, 2);
  const messen = () => {
    wortRect = solid.getBoundingClientRect();
    mastRect = masthead.getBoundingClientRect();
    glRect   = glVorne.getBoundingClientRect();
  };
  const groesse = () => {
    messen();
    dpr = Math.min(window.devicePixelRatio || 1, 2);
    if (canvas && ctx) {
      canvas.width = Math.round(mastRect.width * dpr);
      canvas.height = Math.round(mastRect.height * dpr);
      ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
    }
    gummi.groesse(glRect.width, glRect.height, dpr);
  };
  groesse();
  window.addEventListener("resize", groesse, { passive: true });
  window.addEventListener("scroll", messen, { passive: true });

  // Blob-Radius (aufgeblasener Reveal-Bereich): relativ zur Wortbreite
  const radiusZiel = () => Math.min(Math.max(wortRect.width * 0.17, 66), 150);

  /* ---- Zustand ---------------------------------------------------------- */
  let zx = -9999, zy = 0;          // Ziel-Blob (px im Wort)
  let bx = -9999, by = 0, br = 0;  // tatsächlicher Blob (weich nachziehend)
  let aktiv = false;               // Reveal an (während des waagerechten Wischens)
  let letzteZeit = 0;

  let mausX = -9999, mausY = 0;    // Finger auf der Leinwand
  let griffAktiv = false;
  let griffX = 0, griffY = 0;      // Haltepunkt (rutscht langsam nach)
  let griffZX = -9999, griffZY = 0;// Zentrum der Verformung (= Finger)
  let zugX = 0, zugY = 0;          // Auslenkung der Materie
  let zugVX = 0, zugVY = 0;        // Feder-Geschwindigkeit fürs Zurückwackeln
  let druck = 0;                   // Quetsch-Impuls beim Anfassen/Loslassen
  let magnet = 0;                  // Anschmiegen an den Finger
  let revealWert = 0;              // 0..1 weiches Ein-/Ausblenden der Folie
  let glAn = false;

  // Scroll-Schwung: schnelles senkrechtes Wischen (Seite scrollt) lässt das Wort
  // nachwabbeln, ohne die Scroll-Geste zu blockieren.
  let schwapp = 0, schwappV = 0;
  let letzterScrollY = window.scrollY;
  window.addEventListener("scroll", () => {
    const y = window.scrollY;
    schwappV += (y - letzterScrollY) * 5;
    letzterScrollY = y;
  }, { passive: true });

  /* ---- Partikel (wie am Desktop) --------------------------------------- */
  const partikel = [];
  const MAXP = 200;
  const spawnPartikel = (x, y, dx, dy) => {
    const tempo = Math.hypot(dx, dy);
    const anzahl = Math.min(5, 1 + Math.floor(tempo / 7));
    for (let i = 0; i < anzahl; i++) {
      if (partikel.length > MAXP) partikel.shift();
      const winkel = Math.atan2(dy, dx) + (Math.random() - 0.5) * 1.5;
      const v = tempo * (0.1 + Math.random() * 0.22) + Math.random() * 1.3;
      partikel.push({
        x, y,
        vx: Math.cos(winkel) * v + dx * 0.05,
        vy: Math.sin(winkel) * v + dy * 0.05 - 0.4,
        leben: 1,
        grosse: 1.8 + Math.random() * 3.6,
        farbe: "#ff2fa0",  // Pink passend zur Folie
      });
    }
  };

  /* ---- Finger-Gesten ---------------------------------------------------- */
  // Pro Berührung wird die ACHSE einmal festgelegt: waagerecht = Griff/Reveal,
  // senkrecht = nur Scroll (kein Eingriff). So bleibt das Seiten-Scrollen frei.
  let touchId = null, startX = 0, startY = 0, letzteX = 0, letzteY = 0, achse = null;

  const greifen = (clientX, clientY) => {
    ladePink(); messen();
    const gx = clientX - glRect.left, gy = clientY - glRect.top;
    mausX = gx; mausY = gy;
    griffX = gx; griffY = gy; griffZX = gx; griffZY = gy;
    zugVX = 0; zugVY = 0; druck = 0.25;
    zx = clientX - wortRect.left; zy = clientY - wortRect.top; bx = zx; by = zy;
    griffAktiv = true; aktiv = true;
  };
  const loslassen = () => {
    if (!griffAktiv) return;
    griffAktiv = false; aktiv = false; druck = -0.18;
  };

  masthead.addEventListener("touchstart", (e) => {
    if (touchId !== null) return;
    const t = e.changedTouches[0];
    touchId = t.identifier;
    startX = letzteX = t.clientX;
    startY = letzteY = t.clientY;
    achse = null;
  }, { passive: true });

  masthead.addEventListener("touchmove", (e) => {
    let t = null;
    for (const c of e.changedTouches) if (c.identifier === touchId) { t = c; break; }
    if (!t) return;

    // Achse beim ersten deutlichen Weg festlegen
    if (achse === null) {
      const dx = t.clientX - startX, dy = t.clientY - startY;
      if (Math.hypot(dx, dy) > 8) {
        achse = Math.abs(dx) > Math.abs(dy) ? "waagerecht" : "senkrecht";
        if (achse === "waagerecht") greifen(t.clientX, t.clientY);
      }
    }

    if (achse === "waagerecht") {
      mausX = t.clientX - glRect.left; mausY = t.clientY - glRect.top;
      zx = t.clientX - wortRect.left;  zy = t.clientY - wortRect.top;
      const px = t.clientX - mastRect.left, py = t.clientY - mastRect.top;
      spawnPartikel(px, py, t.clientX - letzteX, t.clientY - letzteY);
    }
    letzteX = t.clientX; letzteY = t.clientY;
  }, { passive: true });

  const ende = (e) => {
    for (const c of e.changedTouches) {
      if (c.identifier === touchId) { touchId = null; achse = null; loslassen(); break; }
    }
  };
  masthead.addEventListener("touchend", ende, { passive: true });
  masthead.addEventListener("touchcancel", ende, { passive: true });

  /* ---- Bild-Schleife ---------------------------------------------------- */
  const tick = (ts) => {
    const dt = letzteZeit ? Math.min((ts - letzteZeit) / 1000, 0.05) : 0;
    letzteZeit = ts;

    // Blob weich nachziehen
    bx += (zx - bx) * 0.18;
    by += (zy - by) * 0.18;
    br += ((aktiv ? radiusZiel() : 0) - br) * 0.12;

    // Gummi-Physik
    if (griffAktiv) {
      const dx = mausX - griffX, dy = mausY - griffY;
      const nachgeben = 1 / (1 + Math.hypot(dx, dy) / 420);
      zugX += (dx * nachgeben - zugX) * Math.min(1, dt * 14);
      zugY += (dy * nachgeben - zugY) * Math.min(1, dt * 14);
      zugVX = 0; zugVY = 0;
      griffX += dx * Math.min(1, dt * 0.8);
      griffY += dy * Math.min(1, dt * 0.8);
      griffZX = mausX; griffZY = mausY;
    } else {
      zugVX += (-110 * zugX - 9 * zugVX) * dt;
      zugVY += (-110 * zugY - 9 * zugVY) * dt;
      zugX += zugVX * dt; zugY += zugVY * dt;
    }
    druck += -druck * Math.min(1, dt * 5);
    const magnetZiel = griffAktiv ? 1.8 : 0;
    magnet += (magnetZiel - magnet) * Math.min(1, dt * 8);
    revealWert += ((aktiv ? 1 : 0) - revealWert) * Math.min(1, dt * 6);

    // Scroll-Schwung ausfedern
    schwappV += (-90 * schwapp - 7 * schwappV) * dt;
    schwapp += schwappV * dt;
    schwapp = Math.max(-64, Math.min(64, schwapp));

    // Auf die Leinwände umschalten, sobald Solid + Kontur als Texturen da sind
    if (!glAn && gummi.bereit()) {
      glAn = true;
      masthead.classList.add("pfm-gl-an");
    }
    if (glAn) {
      const ox = wortRect.left - glRect.left, oy = wortRect.top - glRect.top;
      gummi.zeichne({
        zeit: ts / 1000,
        wort: [ox, oy, wortRect.width, wortRect.height],
        blob: [ox + bx, oy + by, Math.max(0, br)],
        reveal: revealWert,
        matOp: [1, 0, 0, 0],  // nur Pink
        maus: [mausX, mausY],
        magnet,
        magnetR: radiusZiel() * 2.2,
        griff: [griffZX, griffZY],
        zug: [zugX, zugY],
        druck,
        griffR: Math.min(Math.max(wortRect.width * 0.42, 150), 340),
        wabern: wortRect.width * 0.003 * (1 + Math.min(Math.abs(schwapp) / 26, 2)),
        schwapp,
      });
    }

    // Partikel bewegen & zeichnen
    if (ctx) {
      ctx.clearRect(0, 0, mastRect.width, mastRect.height);
      for (let i = partikel.length - 1; i >= 0; i--) {
        const p = partikel[i];
        p.vx *= 0.94; p.vy = p.vy * 0.94 + 0.05;
        p.x += p.vx; p.y += p.vy;
        p.leben -= dt / 1.4;
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

  // Folie im Leerlauf vorladen (ruckelfreier erster Wisch)
  if ("requestIdleCallback" in window) requestIdleCallback(ladePink, { timeout: 2500 });
  else setTimeout(ladePink, 1800);
}
