// Über-mich-Szene: Die 3D-Cartoon-Figur dreht sich beim Scrollen Frame für Frame
// (Bilderfolge = Video) und schraubt sich dabei langsam die Seite hinunter.
// Rückwärts-Scrollen spielt die Drehung rückwärts. Im Wechsel poppen links &
// rechts kleine Steckbrief-Hinweise auf, sobald die Figur ihre Höhe erreicht.
//
// Technik in einfachen Worten:
//  - Wir messen, wie weit die hohe Szene durch das Fenster gescrollt ist (0–1).
//  - Aus diesem Wert leiten wir ab: welches Einzelbild gezeigt wird, wie tief die
//    Figur steht und welche Hinweise sichtbar sind.
//  - Gezeichnet wird auf ein <canvas> — das ist flimmerfrei, weil wir nicht
//    ständig die Bildquelle austauschen.

const BASIS = "/about me/about-me-animation/v7M1HnXXg8ntOJn2eoAB/";
const ANZAHL = 97; // frame_0001.jpg … frame_0097.jpg

const klemm = (v, min, max) => Math.min(Math.max(v, min), max);
const misch = (a, b, t) => a + (b - a) * t;

function bildpfad(nr) {
  const name = "frame_" + String(nr).padStart(4, "0") + ".jpg";
  return encodeURI(BASIS + name); // Leerzeichen im Ordnernamen kodieren
}

export function starteUeberMich() {
  const szene = document.querySelector("#szene");
  if (!szene) return;

  const reduziert = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
  const mqMobil = window.matchMedia("(max-width: 820px)");
  let mobil = mqMobil.matches; // Karten überlagern die Figur → gleitendes Fenster
  mqMobil.addEventListener("change", (e) => { mobil = e.matches; });

  const figurWrap = szene.querySelector(".figur-wrap");
  const canvas = szene.querySelector(".figur-canvas");
  const scrollHinweis = szene.querySelector(".scroll-hinweis");
  const hinweise = Array.from(szene.querySelectorAll(".hinweis"));
  const ctx = canvas.getContext("2d");

  // Papierton der Seite — damit das Weiß der JPGs randlos verschmilzt.
  const PAPIER =
    getComputedStyle(document.documentElement).getPropertyValue("--papier").trim() ||
    "#FCFBF9";

  // Szene sichtbar machen.
  szene.hidden = false;

  // --- Bilder vorladen -----------------------------------------------------
  const bilder = new Array(ANZAHL).fill(null);
  let geladen = 0;

  function naechstesVorhandene(index) {
    for (let d = 0; d < ANZAHL; d++) {
      if (bilder[index - d]) return bilder[index - d];
      if (bilder[index + d]) return bilder[index + d];
    }
    return null;
  }

  for (let i = 0; i < ANZAHL; i++) {
    const img = new Image();
    img.decoding = "async";
    img.onload = () => {
      bilder[i] = img;
      geladen++;
      if (geladen === 1 || i === 0) zeichne(letzterFrame >= 0 ? letzterFrame : 0);
    };
    img.src = bildpfad(i + 1);
  }

  // --- Canvas an Displaygröße & Pixeldichte anpassen -----------------------
  let dpr = 1;
  function messeCanvas() {
    const rect = canvas.getBoundingClientRect();
    dpr = Math.min(window.devicePixelRatio || 1, 2);
    canvas.width = Math.max(1, Math.round(rect.width * dpr));
    canvas.height = Math.max(1, Math.round(rect.height * dpr));
  }

  let letzterFrame = -1;
  function zeichne(frame) {
    const img = bilder[frame] || naechstesVorhandene(frame);
    if (!img) return;
    const w = canvas.width, h = canvas.height;

    // 1) Fläche mit Papierton füllen (deckend → keine sichtbaren Kanten).
    ctx.globalCompositeOperation = "source-over";
    ctx.fillStyle = PAPIER;
    ctx.fillRect(0, 0, w, h);

    // 2) Weicher Bodenschatten unter den Füßen (für Tiefe/Erdung).
    const schatten = ctx.createRadialGradient(
      w / 2, h * 0.9, 0, w / 2, h * 0.9, w * 0.34);
    schatten.addColorStop(0, "rgba(26,23,18,0.30)");
    schatten.addColorStop(1, "rgba(26,23,18,0)");
    ctx.save();
    ctx.translate(w / 2, h * 0.9);
    ctx.scale(1, 0.09);              // flache Ellipse
    ctx.translate(-w / 2, -h * 0.9);
    ctx.fillStyle = schatten;
    ctx.fillRect(0, h * 0.8, w, h * 0.2);
    ctx.restore();

    // 3) Figur per Multiply darüber: Weiß × Papier = Papier, Figur bleibt.
    ctx.globalCompositeOperation = "multiply";
    ctx.drawImage(img, 0, 0, w, h); // Canvas hat dasselbe Seitenverhältnis (1080×1920)
    ctx.globalCompositeOperation = "source-over";

    letzterFrame = frame;
  }

  // --- Fortschritt berechnen & alles darstellen ----------------------------
  function fortschritt() {
    const gesamt = szene.offsetHeight - window.innerHeight;
    if (gesamt <= 0) return 0;
    const oben = szene.getBoundingClientRect().top;
    return klemm(-oben / gesamt, 0, 1);
  }

  function stelleDar() {
    const p = fortschritt();

    // 1) Passendes Einzelbild (0 … ANZAHL-1)
    const frame = Math.round(p * (ANZAHL - 1));
    if (frame !== letzterFrame) zeichne(frame);

    // 2) Schraube: Figur wandert langsam nach unten (+ minimales Ein-/Ausatmen).
    // Startet knapp über der Mitte und sinkt deutlich ab — Kopf/Füße bleiben frei.
    const drift = misch(-2, 16, p);           // vh, oben → unten
    const skala = 1 - Math.sin(p * Math.PI) * 0.03;
    figurWrap.style.transform =
      `translate(-50%, calc(-50% + ${drift}vh)) scale(${skala})`;

    // 3) Scroll-Aufforderung nur ganz am Anfang zeigen
    if (scrollHinweis) scrollHinweis.classList.toggle("weg", p > 0.03);

    // 4) Hinweise im Wechsel auf-/zuklappen (reversibel beim Hochscrollen).
    //    Desktop: neben der Figur ist Platz → einmal aufgeploppt, bleiben sie.
    //    Mobil: Karten überlagern die Figur → gleitendes Fenster, immer nur die
    //    aktuelle Karte, danach blendet sie wieder aus (Figur bleibt sichtbar).
    for (const h of hinweise) {
      const at = parseFloat(h.dataset.at || "0");
      const an = mobil ? (p >= at && p < at + 0.18) : p >= at;
      h.classList.toggle("sichtbar", an);
    }
  }

  // --- Scroll/Resize an den Bildschirmtakt koppeln -------------------------
  let geplant = false;
  function anfordern() {
    if (geplant) return;
    geplant = true;
    requestAnimationFrame(() => {
      geplant = false;
      stelleDar();
    });
  }

  messeCanvas();

  // Reduzierte Bewegung: keine Scroll-Animation. Szene wird zu einem ruhigen,
  // nicht scrollenden Standbild (Frame 1) mit allen Hinweisen sichtbar.
  if (reduziert) {
    szene.classList.add("statisch");
    if (scrollHinweis) scrollHinweis.classList.add("weg");
    for (const h of hinweise) h.classList.add("sichtbar");
    figurWrap.style.transform = "translate(-50%, -50%)";
    zeichne(0);
    window.addEventListener("resize", () => {
      messeCanvas();
      zeichne(0);
    }, { passive: true });
    return;
  }

  window.addEventListener("scroll", anfordern, { passive: true });
  window.addEventListener("resize", () => {
    messeCanvas();
    zeichne(letzterFrame >= 0 ? letzterFrame : 0);
    anfordern();
  }, { passive: true });

  // Sprachumschaltung (DE/EN) kann set:html der Hinweise tauschen — Layout danach
  // neu darstellen, damit nichts springt.
  window.addEventListener("sprache-gewechselt", anfordern);

  stelleDar();
}
