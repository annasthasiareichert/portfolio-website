// Ankunft des Karten-Flugs von der Startseite (Gegenstück zu faecher.js).
//
// Ablauf über beide Seiten hinweg — soll sich wie EIN durchgehender Flug anfühlen:
//   Startseite : Karte schwebt groß zur Bildschirmmitte, Papier-Vorhang blendet ein,
//                das End-Rechteck wird als „kartenflug" in sessionStorage übergeben.
//   Detailseite: Ein Inline-Schnipsel ([slug].astro) baut noch VOR dem ersten Malen
//                eine Papier-Deckschicht (html.karten-ankunft) und die Karte an exakt
//                dem übergebenen Rechteck wieder auf (.ankunft-karte).
//   Hier       : Papier blendet aus → die Seite liegt sichtbar darunter, und die Karte
//                fliegt an ihren echten Platz — das erste Bild der Fallstudie/Galerie —
//                und blendet dort weich ins Original über.
//
// Gibt es keinen Flug (direkter Aufruf, reduzierte Bewegung), passiert hier nichts.

const html = document.documentElement;
const karte = document.querySelector(".ankunft-karte");

function aufraeumen() {
  document.querySelectorAll(".ankunft-karte").forEach((el) => el.remove());
  html.classList.remove("karten-ankunft", "karten-ankunft-frei");
  try { sessionStorage.removeItem("kartenflug"); } catch (_) {}
}

if (karte) {
  const ziel = document.querySelector(".fall-buehne img, .projekt-figur img, .projekt-vorschau img");

  const flieg = async () => {
    // Ziel-Bild fertig laden lassen: ohne Maße im Markup hätte ein ungeladenes
    // Bild Höhe 0 und das Ziel-Rechteck wäre falsch. Notbremse nach 900 ms.
    if (ziel && !ziel.complete) {
      await new Promise((weiter) => {
        ziel.addEventListener("load", weiter, { once: true });
        ziel.addEventListener("error", weiter, { once: true });
        setTimeout(weiter, 900);
      });
    }
    // Zwei Frames warten, bis das Layout wirklich steht
    await new Promise((weiter) => requestAnimationFrame(() => requestAnimationFrame(weiter)));

    // Papier-Deckschicht ausblenden — die Detailseite erscheint unter der Karte
    html.classList.add("karten-ankunft-frei");

    const zr = ziel ? ziel.getBoundingClientRect() : null;
    // Nur anfliegen, wenn das Ziel brauchbar im Sichtfeld liegt — sonst einfach ausblenden
    const passt = zr && zr.width > 40 && zr.height > 40 && zr.top < window.innerHeight * 0.85;

    if (passt) {
      const radius = getComputedStyle(ziel).borderRadius;
      const flug = karte.animate(
        [
          {
            left: karte.style.left, top: karte.style.top,
            width: karte.style.width, height: karte.style.height,
            borderRadius: "12px",
          },
          {
            left: `${zr.left}px`, top: `${zr.top}px`,
            width: `${zr.width}px`, height: `${zr.height}px`,
            borderRadius: radius && radius !== "0px" ? radius : "4px",
          },
        ],
        { duration: 620, easing: "cubic-bezier(0.2, 0.8, 0.2, 1)", fill: "forwards" }
      );
      await flug.finished.catch(() => {});
    }

    // Weich ins echte Bild überblenden (bzw. ohne Ziel: einfach ausblenden)
    const fade = karte.animate(
      [{ opacity: 1 }, { opacity: 0 }],
      { duration: 320, easing: "ease", fill: "forwards", delay: passt ? 80 : 0 }
    );
    await fade.finished.catch(() => {});
    aufraeumen();
  };

  // Sicherheitsnetz: egal was passiert, nach 3 s ist die Seite frei
  const notbremse = setTimeout(aufraeumen, 3000);
  flieg().finally(() => clearTimeout(notbremse));
} else {
  // Kein Flug angekommen — sicherstellen, dass keine Deckschicht stehen bleibt
  aufraeumen();
}

// Zurück über den Verlauf (bfcache): Reste des Übergangs entfernen
window.addEventListener("pageshow", (e) => {
  if (e.persisted) aufraeumen();
});
