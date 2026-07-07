# Portfolio-Website — Domänenmodell & Entscheidungen

_Hält Ubiquitous Language, Entscheidungen und Material der Konzeptphase fest._
_Stand: 2026-07-07 — **Status: von Annasthasia Reichert freigegeben (Konzeptphase abgeschlossen).**_
_Alle Entscheidungen D1–D18 sind bestätigt. Nächster Schritt: visueller Startseiten-Entwurf, dann Bau._

## Kontext & Ziel

Persönliche Portfolio-Website von **Annasthasia Reichert**, Grafik- & UI-Designerin,
zur Bewerbung auf **kreative Designpositionen**. Die Nutzerin gestaltet visuell sicher,
lernt aber den technischen Hintergrund neu und will ihn verstehen. Die Seite soll
**aus der Masse herausstechen** und schon durch ihre Aufbereitung (Inszenierung,
Scroll-Animation, Bewegung) für sich sprechen — **kein langweiliges Auflisten**.

## Ubiquitous Language (gemeinsame Begriffe)

- **Arbeiten** — die Projekt-/Werkschau (engl. Work). Hauptinhalt der Seite.
- **Projekt** — eine einzelne Arbeit. Aktuell 9 Stück (siehe unten).
- **Case Study** — die vertiefte Darstellung eines Projekts: Ziel → Prozess → Ergebnis/Anwendung.
- **Über mich** — Bio/Vorstellung; enthält später Lebenslauf und ggf. Vorstellungsvideo.
- **Kontakt** — Kontaktmöglichkeit.
- **Signature-Moment** — ein bewusst gesetzter „Wow"-Effekt (z. B. besondere Startseite, Übergang).

## Projekte (Ausgangslage — 21-seitiges Canva-Portfolio)

1. Ganzheitliches Rebranding | Ticket AG  (vollwertige Case Study: Ziel, Analyse, Logo vorher/nachher, UI-Anwendung)
2. Private Projekte
3. Logo Redesign | echory
4. Rendering eines Schuh-Modells (3D)
5. Logo Redesign | Eisbären Berlin
6. Content Creation | verschiedene Brands
7. Brand Assets | ecostag / stagedates
8. Merchandise-Gestaltung | stagedates
9. Ausblick: Banner-Gestaltung | Lampenwelt

_Projekttiefe variiert: von voller Case Study (Ticket AG) bis kompakt (Logo-Redesigns, 3D-Render, Merch)._
_Später iterativ erweiterbar._

## Ästhetische Richtung (aus Material + Referenzen)

- Editorial, ruhig, viel Weißraum; „Layout leise, Arbeiten dürfen laut sein".
- Warme Neutraltöne (Creme / Off-White) + Schwarz. Farbe kommt über die Projektinhalte.
- Typo: Serifen-Kursiv kombiniert mit fetter Grotesk.
- Lebendigkeit über Bewegung: Scroll-Animation, fliegende/schwebende Elemente, Hover-Effekte.

### Referenzen (positiv)
1. bymonolog.com — Scroll-Animationen, Logo-Gestaltung
2. hildenkaira.fi — fliegende Elemente (weniger statisch), „Our Services"-Section
3. noth.in — Hover-Effekt bei Überschrift, Scroll bewegt Bildschirm vom Nutzer weg
4. yungbld.com — Schlichtheit + farbenfrohe Inhalte
5. wallofportfolios.in/portfolios/muhidul-hasan — Schlichtheit, Ruhe, keine visuelle Überforderung

### Referenzen (negativ)
1. ryanritzenthaler.com — zu überladen, zu dominante/unruhige Schriften
2. vshslv.com — visuell überfordernd, UX nicht intuitiv

## Entscheidungen (getroffen)

- **D1 — Grundhaltung:** Im Zweifel „beeindruckend" vor „einfach wartbar" — ABER niemals in
  eine Sackgasse; muss dauerhaft selbst optimierbar/pflegbar bleiben und Projekte ergänzbar.
- **D2 — Framework:** Astro (zeigt sauberes HTML/CSS, lernfreundlich, stark genug für Wow-Momente). Kein Next.js.
- **D3 — Inhaltspflege:** Content Collections (Projekte als Dateien mit Ausfüll-Vorlagen). CMS später nachrüstbar.
- **D4 — Inhaltsumfang zum Start:** die 9 Projekte / 21 Seiten des Canva-Portfolios; iterativ erweiterbar.
- **D5 — Design-Referenz:** ausschließlich die o. g. Referenz-Links; das Canva-Auto-Mockup wird ignoriert.
- **D6 — Architektur:** Hybrid — filmisch inszenierte Startseite (Projekt-Index als Scroll-Erlebnis)
  + eigene Projekt-Detailseiten (Case Studies) + separate Seiten für Lebenslauf und Kontakt
  (bewusst ungestört, ohne Nebeninhalte).
- **D7 — Vorstellungsvideo (Phase 2):** Einbettung eines *nicht gelisteten* YouTube-Videos.
  Player wird gestalterisch beruhigt; Vimeo als spätere Alternative offen.
- **D8 — Sitemap & Navigation:** Start · Arbeiten (Projekte auf der Startseite → eigene Projektseiten) ·
  Über mich (persönlich + Video) · Lebenslauf · Kontakt (ungestört). Über mich und Lebenslauf **getrennt**.
- **D9 — Lebenslauf-Seite:** frei/editorial gestaltete Web-Darstellung des Werdegangs (nicht tabellarisch)
  **plus** Button „Lebenslauf als PDF herunterladen" (Original-Layout der Nutzerin).

## Benötigtes Material (Sammelliste)

- Original-Bilder/Vektoren der 9 Projekte in voller Qualität (via Canva-Export).
- Lebenslauf-Inhalte (Stationen, Skills) — evtl. teils in Canva „Über mich".
- Lebenslauf als PDF in Originalform (für Download-Button).
- Später: Vorstellungsvideo (unlisted YouTube).

- **D10 — Zweisprachigkeit (von Beginn an):** Deutsch = Default, Englisch umschaltbar per Toggle.
  Sprache steckt in der URL (DE auf Root, EN unter `/en/…`), damit der englische Link **direkt teilbar**
  ist. Inhalte werden DE/EN nebeneinander gepflegt. EN-Erstfassungen entwirft Claude, Nutzerin gibt frei.

- **D11 — Kontaktseite:** kein Formular (Phase 1); klickbare E-Mail (mailto) + LinkedIn-Button.
  Weitere Profile (Instagram/Behance) optional nachrüstbar.
- **D12 — Rechtsseiten:** Impressum + Datenschutzerklärung werden gestaltet angelegt (Fußzeile).
  Nutzerin füllt echte/geprüfte Inhalte (Impressum) bzw. Generator-Text (Datenschutz). Keine Rechtsberatung durch Claude.

- **D13 — Motion:** Kalibrierung **7/10** („selbstbewusst choreografiert, aber ruhig"). Vokabular: geglättetes
  Scrollen, Erscheinen beim Scrollen, Hover-Effekte, sparsame schwebende Elemente, 1–2 Signature-Momente
  (z. B. noth.in „Wegscroll"). Rahmen-Prinzipien: (1) Bewegung dient dem Inhalt, (2) `prefers-reduced-motion`
  respektieren, (3) mobil bewusst reduziert.

- **D14 — Impressumsdaten (bestätigt):**
  - Name: **Annasthasia Leandra Reichert**
  - Anschrift (privat, öffentlich im Impressum): **Lenbachstraße 9, 50733 Köln**
  - E-Mail: **annasthasiareichert@gmx.de** (zugleich klickbare Kontakt-E-Mail der Seite)
  - Telefon: **0172 5401188** (wird angegeben)
  - USt-IdNr.: keine → entfällt

- **D15 — Hosting & Domain:** Code in **GitHub** (Backup + Versionsverlauf), Hosting **Cloudflare Pages**
  (kostenlos, automatisches Deploy bei Änderung). Eigene Domain **annasthasiareichert.de** (Nutzerin registriert selbst).
  US-Hosting akzeptiert; in Datenschutzerklärung offenzulegen.

- **D16 — Inhaltsmodell „Projekt":**
  - **Eckdaten (Felder):** Titel · Kunde/Kontext · Jahr · Rolle/Leistung · Kategorie/Tags · Teaser · Titelbild.
    Optionale Felder verfügbar: Live-Link, Auszeichnung.
  - **Case-Study-Körper:** flexible, wiederverwendbare **Bausteine** (Textabschnitt · großes/randloses Bild ·
    Vorher-Nachher · Galerie/Raster · Zitat/Kernaussage · zwei Bilder nebeneinander), pro Projekt frei kombinierbar.
  - **Zwei Projekt-Typen** aus denselben Bausteinen: (1) **erzählte Case Study** (linear, mit Prozess),
    (2) **Sammlung** (Raster unabhängiger Einzelstücke, jedes mit eigener optionaler Bildunterschrift — z. B. Freizeitprojekte).

- **D17 — Homepage-Kreativkonzept:** **Blend A+B.** Rückgrat = „Editorial Index": Serif-Kursiv-Hero auf
  Creme-Fläche, Projekte als große Titel-Liste mit **Hover-Bild-Reveal** (noth.in) und **Wegscroll**-Übergang
  in die Case Study. Dazu **gezielte B-Momente**: wenige schwebende Fragmente (hildenkaira) + 1–2 sanfte
  Parallax-/Szenen-Auftritte (bymonolog). Ruhig bei 7/10. → Nächster Schritt: echter visueller Entwurf.

- **D18 — Statistik:** **Cloudflare Web Analytics** (kostenlos, **cookie-los, ohne Cookie-Banner**),
  keine personenbezogene Nachverfolgung. In Datenschutzerklärung nennen.

## Umsetzungsstand

- **2026-07-07 — Startseiten-Entwurf v1 gebaut** (Nächster-Schritt 1): `entwurf/startseite.html`,
  Blend A+B (Wegscroll-Hero, Hover-Bild-Reveal-Index, Parallax-Drift, DE/EN, reduced-motion, mobil reduziert).
  Rückmeldung Nutzerin: Richtung ok, aber **zu wenig persönlich**.

- **2026-07-07 — Startseiten-Entwurf v2** (aktueller Stand): auf die **eigene Handschrift der Nutzerin**
  umgebaut. **Verbindliche Stilquelle: ihr Canva-Lebenslauf, design_id `DAGVCFQl1Ro`, insb. Seite 3 & 4.**
  Übernommen: Namens-Lockup (Schreibschrift-Vorname über fettem, kleingeschriebenem Nachnamen mit Punkt),
  Überschriften-Motiv „kleingeschrieben + fett + Punkt", *kursive Serife* für Eigennamen/Kundennamen,
  Greige/Weiß/Schwarz-Palette, Outline-Pill-Badge, Karopapier-Textur in Bandecken, ihr **Portrait** im Hero
  (freigestellt aus CV-Seite 3, `entwurf/portrait.png`). Projektbilder weiterhin Platzhalter.
  → Status: wartet auf nächstes Feedback.

## Offene Design-Details (in v2 gesetzt — Freigabe ausstehend)

- **D-Farbe — Palette (aus CV gemessen):** `--papier #FCFBF9` (Weiß), `--sand #D9D7D1` (Greige/Taupe-Band),
  `--tinte #1A1712` (Schwarz), `--ton #8A857B` (Grau). **Kein bunter Akzent** (CV ist bewusst neutral).
  Terrakotta-Akzent aus v1 **verworfen**.
- **D-Schrift — Dreiklang (lizenzfrei, OFL, später selbst gehostet):**
  - Schreibschrift (Namens-Lockup) = **Kaushan Script** — Platzhalter, der die CV-Schreibschrift *nachempfindet*;
    exakte CV-Schrift ist eine Canva-Font. Alternativen bei Bedarf: Yellowtail, Great Vibes, Sacramento.
  - Fette Grotesk (Nachname, Überschriften, Projekttitel) = **Archivo** (800–900).
  - Serifen-Kursiv (Eigennamen, editoriale Zeilen) = **Newsreader** italic.
- Favicon + Social-Vorschaubild. — offen.

## Nächste Schritte

1. **Visueller Entwurf der Startseite** (Blend A+B) zum Ansehen und Feinschleifen — vor dem eigentlichen Bau.
2. Danach: technisches Grundgerüst (Astro, zweisprachig-fähig, Content Collections).
3. Projekte befüllen (Assets via Canva-Export), Über-mich/Lebenslauf, Rechtsseiten, Kontakt.
4. Live: GitHub + Cloudflare Pages + Domain annasthasiareichert.de.

## Bildpipeline (Prozess, keine offene Entscheidung)

Original-Assets werden bei Bedarf direkt aus Canva exportiert (hohe Auflösung) und für Web optimiert.
