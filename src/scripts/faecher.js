// Der Karten-Fächer der Startseite (Abschnitt „ausgewählte arbeiten").
// Drei Dinge passieren hier, alle nur als Zugabe – ohne JS bleiben die Karten
// ganz normale Links auf die Projektseiten:
//   1) Hover  → großer Projekttitel hinter den Karten + Kundenname darunter
//   2) Maus   → die ganze Kartenreihe kippt ganz leicht in 3D mit (Tiefe)
//   3) Klick  → die Karte schwebt heran und blendet in die Detailseite über
// Auf Touch-Geräten (Karussell) bleibt alles ruhig: nur normale Links.

const reduziert = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
const zeigeGeraet = window.matchMedia("(hover: hover)").matches;

const buehne = document.getElementById("faecher");
const karten = document.getElementById("faecher-karten");
const wort = document.getElementById("faecher-wort");
const kundeZeile = document.getElementById("faecher-kunde");

if (buehne && karten && wort && kundeZeile) {
  const links = Array.from(karten.querySelectorAll(".fk-a"));

  // Aktuelle Sprache (der globale Umschalter setzt <html lang>). Wir schreiben
  // beide Fassungen als data-Attribute mit – so nimmt der Umschalter Titel &
  // Kunde beim Sprachwechsel automatisch mit.
  const lang = () => (document.documentElement.lang === "en" ? "en" : "de");
  const setzeText = (el, de, en) => {
    el.dataset.de = de;
    el.dataset.en = en;
    el.textContent = lang() === "en" ? en : de;
  };

  /* 0) Titel-Wort an der Unterkante verankern ------------------------------
        Das Wort soll fast komplett ÜBER den Karten schweben und nur ein kleines
        Stück (~0,35em) hinter der Kartenoberkante abtauchen. Dafür messen wir
        die ruhende Trefferfläche der mittleren Karte (.fk-a — bewegt sich nie)
        und setzen `bottom` des Wortes passend. Läuft einmal beim Start und bei
        jeder Größenänderung. */
  const setzeWortAnker = () => {
    const mitteA = links[Math.floor(links.length / 2)];
    if (!mitteA) return;
    const kartenTop = mitteA.getBoundingClientRect().top;
    const buehneR = buehne.getBoundingClientRect();
    const eintauchen = parseFloat(getComputedStyle(wort).fontSize) * 0.35;
    wort.style.bottom = `${buehneR.bottom - (kartenTop + eintauchen)}px`;
  };
  setzeWortAnker();
  window.addEventListener("resize", setzeWortAnker, { passive: true });

  /* 1) Hover → Titel & Kunde einblenden ----------------------------------- */
  if (zeigeGeraet) {
    // Ruhezustand: der Titel der mittleren Karte steht dezent als Wasserzeichen
    const mitte = links[Math.floor(links.length / 2)];
    if (mitte) {
      setzeText(wort, mitte.dataset.titelDe, mitte.dataset.titelEn);
      wort.classList.add("ruht");
    }

    links.forEach((a) => {
      a.addEventListener("mouseenter", () => {
        setzeText(wort, a.dataset.titelDe, a.dataset.titelEn);
        setzeText(kundeZeile, a.dataset.kundeDe, a.dataset.kundeEn);
        wort.classList.remove("ruht");
        wort.classList.add("aktiv");
        kundeZeile.classList.add("aktiv");
      });
      a.addEventListener("mouseleave", () => {
        // Titel bleibt (zuletzt berührt), fällt aber dezent ins Wasserzeichen zurück
        wort.classList.remove("aktiv");
        wort.classList.add("ruht");
        kundeZeile.classList.remove("aktiv");
      });
    });
  }

  /* 2) Maus → Kartenreihe kippt leicht in 3D mit --------------------------
        Bewusst dezent und träge: Der Tilt bewegt auch die Trefferflächen der
        Karten — je kleiner/weicher er ist, desto ruhiger fühlt sich Hover an. */
  if (zeigeGeraet && !reduziert) {
    karten.style.transition = "transform 0.6s cubic-bezier(0.2, 0.8, 0.2, 1)";
    const NEIGUNG = 3.5; // Grad max.
    buehne.addEventListener("pointermove", (e) => {
      const r = buehne.getBoundingClientRect();
      const nx = (e.clientX - r.left) / r.width - 0.5;  // −0.5 … 0.5
      const ny = (e.clientY - r.top) / r.height - 0.5;
      karten.style.transform =
        `rotateY(${nx * NEIGUNG}deg) rotateX(${-ny * NEIGUNG * 0.6}deg)`;
    }, { passive: true });
    buehne.addEventListener("pointerleave", () => {
      karten.style.transform = "rotateY(0deg) rotateX(0deg)";
    });
  }

  /* 3) Klick → filmischer Übergang zur Detailseite: die anderen Karten
        zerstreuen sich, die geklickte schwebt groß heran, ein Papier-Vorhang
        blendet auf, dann folgt die Navigation. Läuft in jedem Browser gleich.
        Bei reduzierter Bewegung: normale Navigation. */
  links.forEach((a) => {
    a.addEventListener("click", (e) => {
      // Neuer-Tab-Gesten (Cmd/Ctrl/Shift/Mittelklick) normal durchlassen
      if (e.metaKey || e.ctrlKey || e.shiftKey || e.button !== 0) return;
      if (reduziert) return; // → normale Navigation
      e.preventDefault();
      fliegeZuDetail(a);
    });
  });

  function fliegeZuDetail(a) {
    const fk = a.closest(".fk");
    const karte = a.querySelector(".fk-karte");
    const r = karte.getBoundingClientRect();
    const vw = window.innerWidth, vh = window.innerHeight;
    const mitteX = vw / 2;

    // 1) Die anderen Karten zerstreuen sich nach außen-oben (leicht gestaffelt)
    links.forEach((other, i) => {
      if (other === a) return;
      const ofk = other.closest(".fk");
      const or = ofk.getBoundingClientRect();
      const seite = (or.left + or.width / 2) < mitteX ? -1 : 1;
      const streu = 150 + Math.abs((or.left + or.width / 2) - mitteX) * 0.5;
      ofk.classList.add("zerstreut");
      ofk.style.transitionDelay = (i % 4) * 0.03 + "s";
      ofk.style.transform = `translate(${seite * streu}px, ${-120 - streu * 0.35}px) rotate(${seite * 16}deg)`;
      ofk.style.opacity = "0";
    });

    // 2) Geklickte Karte: Original ausblenden, Klon schwebt groß nach vorn/oben
    a.classList.add("faehrt-weg");
    fk.style.opacity = "0";
    const flug = document.createElement("div");
    flug.style.cssText =
      `position:fixed;left:${r.left}px;top:${r.top}px;width:${r.width}px;height:${r.height}px;` +
      `background-image:url('${a.dataset.bild}');background-size:cover;background-position:center;` +
      "border-radius:12px;z-index:95;pointer-events:none;transform-origin:center;" +
      "box-shadow:0 60px 100px -30px rgba(26,23,18,.6);" +
      "transition:transform .58s cubic-bezier(.5,0,.15,1);will-change:transform;";
    document.body.appendChild(flug);
    const zielBreite = Math.min(vw * 0.5, 460);
    const skala = zielBreite / r.width;
    const zx = vw / 2 - (r.left + r.width / 2);
    const zy = vh * 0.38 - (r.top + r.height / 2);

    // Staffelstab für die Detailseite: Dort baut ein Inline-Schnipsel die Karte
    // an GENAU diesem End-Rechteck wieder auf und lässt sie ins erste Projektbild
    // weiterfliegen (scripts/ankunft.js) — so wirkt der Seitenwechsel wie EIN Flug.
    try {
      const zielHoehe = r.height * skala;
      sessionStorage.setItem("kartenflug", JSON.stringify({
        slug: a.dataset.slug,
        bild: a.dataset.bild,
        rect: {
          left: vw / 2 - zielBreite / 2,
          top: vh * 0.38 - zielHoehe / 2,
          width: zielBreite,
          height: zielHoehe,
        },
        t: Date.now(),
      }));
    } catch (_) { /* Speicher gesperrt → Übergang endet einfach im Vorhang */ }

    // 3) Papier-Vorhang überbrückt den Seitenwechsel
    const vorhang = document.createElement("div");
    vorhang.className = "uebergang-vorhang";
    document.body.appendChild(vorhang);

    let weg = false;
    const los = () => { if (weg) return; weg = true; window.location.href = a.href; };
    flug.addEventListener("transitionend", los, { once: true });
    requestAnimationFrame(() => {
      flug.style.transform = `translate(${zx}px, ${zy}px) scale(${skala})`;
      vorhang.classList.add("an");
    });
    setTimeout(los, 660); // Sicherheitsnetz, falls transitionend ausbleibt
  }

  // Zurück über den Verlauf (bfcache): evtl. „zerstreute" Karten zurücksetzen,
  // damit der Fächer beim Wiederkommen sauber dasteht.
  window.addEventListener("pageshow", (e) => {
    if (!e.persisted) return;
    try { sessionStorage.removeItem("kartenflug"); } catch (_) {}
    document.querySelectorAll(".fk.zerstreut").forEach((el) => {
      el.classList.remove("zerstreut");
      el.style.transform = ""; el.style.opacity = ""; el.style.transitionDelay = "";
    });
    document.querySelectorAll(".fk-a.faehrt-weg").forEach((el) => {
      el.classList.remove("faehrt-weg");
      const p = el.closest(".fk"); if (p) p.style.opacity = "";
    });
    document.querySelectorAll(".uebergang-vorhang").forEach((v) => v.remove());
  });
}
