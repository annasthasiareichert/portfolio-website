// Filter der Projekte-Übersicht.
// Oben eine Leiste mit Pillen (je eine Kategorie/Label) plus „Alle".
// · Mehrfachauswahl: jede Pille lässt sich einzeln an-/abwählen.
// · Ein Projekt ist sichtbar, sobald MINDESTENS EIN seiner Labels aktiv ist.
// · Standard: alles aktiv → alle Projekte sichtbar.
// · „Alle": ist alles aktiv, schaltet der Klick alles AUS; sonst alles AN.
// Sprachwechsel (DE/EN) läuft unabhängig über data-de/data-en; damit auch der
// Projektzähler nach dem Umschalten stimmt, aktualisieren wir beide Attribute mit.

const leiste = document.querySelector("[data-projekt-filter]");
if (leiste) {
  const alleKnopf = leiste.querySelector("[data-alle]");
  const pillen = Array.from(leiste.querySelectorAll(".filter-pille[data-label]"));
  const karten = Array.from(document.querySelectorAll(".pl-karte"));
  const leerHinweis = document.querySelector(".projekte-leer");
  const zaehler = document.getElementById("projekte-zaehler");

  // aktive Label-Ids (Start: alle)
  const aktiv = new Set(pillen.map((p) => p.dataset.label));

  const setzeGedrueckt = (knopf, an) => {
    knopf.classList.toggle("aktiv", an);
    knopf.setAttribute("aria-pressed", an ? "true" : "false");
  };

  const aktualisieren = () => {
    // „Alle" spiegelt: sind gerade alle Pillen aktiv?
    setzeGedrueckt(alleKnopf, aktiv.size === pillen.length);

    // Sichtbarkeit je Karte (OR-Logik über die Labels)
    let sichtbar = 0;
    karten.forEach((k) => {
      const labels = (k.dataset.labels || "").split(" ").filter(Boolean);
      const zeigen = labels.some((l) => aktiv.has(l));
      k.hidden = !zeigen;
      if (zeigen) sichtbar++;
    });

    // Leer-Hinweis
    if (leerHinweis) leerHinweis.hidden = sichtbar !== 0;

    // Zähler aktualisieren (Text + beide Sprach-Attribute)
    if (zaehler) {
      const n = String(sichtbar).padStart(2, "0");
      const de = `${n} Projekte`;
      const en = `${n} Projects`;
      zaehler.setAttribute("data-de", de);
      zaehler.setAttribute("data-en", en);
      zaehler.textContent = document.documentElement.lang === "en" ? en : de;
    }
  };

  // Einzelne Pille umschalten
  pillen.forEach((p) => {
    p.addEventListener("click", () => {
      const id = p.dataset.label;
      if (aktiv.has(id)) aktiv.delete(id);
      else aktiv.add(id);
      setzeGedrueckt(p, aktiv.has(id));
      aktualisieren();
    });
  });

  // „Alle" — komplett an oder aus
  alleKnopf.addEventListener("click", () => {
    const allesAn = aktiv.size === pillen.length;
    pillen.forEach((p) => {
      if (allesAn) aktiv.delete(p.dataset.label);
      else aktiv.add(p.dataset.label);
      setzeGedrueckt(p, !allesAn);
    });
    aktualisieren();
  });

  aktualisieren();
}
