// Auslage — Wortliste + Bildwechsel (Menü-Prinzip).
// Rechts stehen die Asset-Wörter, links ein fester Bildplatz. Fährt man über ein
// Wort (oder tippt es an), wechselt daneben das passende Bild – immer an gleicher
// Stelle. Ruhezustand: eine dezente Auto-Schleife läuft, solange der Block sichtbar
// ist und noch niemand eingegriffen hat; beim ersten Hover/Tippen stoppt sie.

const reduziert = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
const WECHSEL_MS = 2000; // Takt der Auto-Schleife

function initEine(wrap) {
  const bilder = Array.from(wrap.querySelectorAll(".auslage-bild"));
  const worte = Array.from(wrap.querySelectorAll(".auslage-wort"));
  const cap = wrap.querySelector(".auslage-cap");
  if (bilder.length < 2 || worte.length < 2) return;

  let aktiv = 0;
  let autoTimer = null;
  let uebernommen = false; // true, sobald die Nutzerin selbst gewählt hat

  function zeige(i) {
    aktiv = i;
    bilder.forEach((b, k) => b.classList.toggle("aktiv", k === i));
    worte.forEach((w, k) => {
      const an = k === i;
      w.classList.toggle("aktiv", an);
      w.setAttribute("aria-current", an ? "true" : "false");
    });
    if (cap) {
      const de = worte[i].getAttribute("data-cap-de");
      const en = worte[i].getAttribute("data-cap-en");
      const enSprache = document.documentElement.lang === "en";
      // Beide Sprachfassungen mitschreiben, damit der DE/EN-Umschalter die
      // richtige Unterschrift des gerade aktiven Bildes zeigt.
      cap.setAttribute("data-de", de);
      cap.setAttribute("data-en", en);
      cap.innerHTML = enSprache ? en : de;
    }
  }

  function stoppeAuto() {
    if (autoTimer) { clearInterval(autoTimer); autoTimer = null; }
  }
  function starteAuto() {
    if (reduziert || uebernommen || autoTimer) return;
    autoTimer = setInterval(() => zeige((aktiv + 1) % bilder.length), WECHSEL_MS);
  }
  function uebernehmen(i) {
    uebernommen = true;
    stoppeAuto();
    zeige(i);
  }

  worte.forEach((w, i) => {
    // Maus-Hover: Zeigegeräte lösen pointerenter aus.
    w.addEventListener("pointerenter", (e) => {
      if (e.pointerType === "touch") return; // Touch wird über click bedient
      uebernehmen(i);
    });
    // Tastatur: Fokus wandert per Tab → dasselbe Verhalten wie Hover.
    w.addEventListener("focus", () => uebernehmen(i));
    // Touch & Klick: verlässlich für Finger und Tastatur (Enter/Space).
    w.addEventListener("click", () => uebernehmen(i));
  });

  // Auto-Schleife nur laufen lassen, solange der Block im Blickfeld ist.
  if (!reduziert) {
    const beobachter = new IntersectionObserver((es) => {
      es.forEach((e) => (e.isIntersecting ? starteAuto() : stoppeAuto()));
    }, { threshold: 0.35 });
    beobachter.observe(wrap);
  }
}

export function starteAuslage() {
  document.querySelectorAll("[data-auslage]").forEach(initEine);
}

// Als Modul am Seitenende geladen → DOM ist bereits geparst.
starteAuslage();
