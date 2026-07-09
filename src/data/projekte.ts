// Die ausgewählten Arbeiten für den Index auf der Startseite.
// Hier pflegst du Projekte – Reihenfolge = Reihenfolge auf der Seite.
// `titel` / `kunde` / `meta` haben je eine deutsche (de) und englische (en) Fassung.
// Ist keine englische Fassung nötig (z. B. Eigennamen), einfach denselben Text eintragen.
//
// DETAILSEITE (jedes Projekt bekommt eine eigene Unterseite /arbeiten/<slug>):
// · `slug`         = Adresse der Unterseite (kleingeschrieben, mit Bindestrichen, einmalig).
// · `beschreibung` = Kurztext für Suchmaschinen/Vorschau (nicht sichtbar, wenn `fall` gesetzt ist).
// · `leistungen`   = Schlagworte (Pills) im Kopf der Detailseite.
// · `bild`         = Vorschaubild für den Index auf der Startseite (Pfad ab /public).
//
// REICHE FALLSTUDIE (empfohlen): Feld `fall` mit Bausteinen (Blöcken) füllen. Jeder Block
// ist einer von vier Typen — daraus setzt sich die Detailseite editorial zusammen:
//   { art: "bild",    … }  ein Bild auf einer „Bühne" (papier/sand/dunkel), opt. Beschriftung
//   { art: "paar",    … }  zwei Bilder nebeneinander auf einer Bühne (z. B. Mobile + Icon)
//   { art: "text",    … }  Textabschnitt mit Label; `lead:true` = große Serifen-Kursiv-Aussage
//   { art: "prozess", … }  nummerierte Schritte (Titel + Text)
// Bilder liegen in /public/projekte/<slug>/… — die Originale werden unter media/projekte/<slug>/
// archiviert (nicht ausgeliefert). Ist `fall` leer/weggelassen, greift die einfache Galerie.

export type Zwei = { de: string; en: string };
export type Buehne = "papier" | "sand" | "dunkel";

export type FallBild = {
  bild: string;
  alt: Zwei;
  /* CSS-Maximalbreite, z. B. "230px" — für kleine Assets wie Handy-Mockup/Icon */
  max?: string;
  unterschrift?: Zwei;
};

export type FallBlock =
  | { art: "bild"; label?: Zwei; bild: string; alt: Zwei; buehne?: Buehne; max?: string; unterschrift?: Zwei }
  | { art: "paar"; label?: Zwei; buehne?: Buehne; bilder: FallBild[] }
  | { art: "text"; label?: Zwei; lead?: boolean; absaetze: Zwei[] }
  | { art: "prozess"; label?: Zwei; schritte: { titel: Zwei; text: Zwei }[] };

export type Projekt = {
  /* URL der Detailseite: /arbeiten/<slug> */
  slug: string;
  /* Vorschaubild in /public/projekte/… (Pfad ab Website-Wurzel) */
  bild: string;
  titel: { de: string; en: string };
  kunde: { de: string; en: string };
  meta: { de: string; en: string };
  /* --- Detailseite --- */
  beschreibung?: { de: string; en: string };
  leistungen?: string[];
  /* Reiche Fallstudie (Blöcke). Gesetzt = editorial gestaltete Seite. */
  fall?: FallBlock[];
  /* Einfache Galerie-Alternative (nur genutzt, wenn `fall` leer ist) */
  bilder?: string[];
};

export const projekte: Projekt[] = [
  {
    slug: "ticket-ag-rebranding",
    bild: "/projekte/karten/ticket-ag.webp",
    titel: { de: "ganzheitliches rebranding", en: "full rebranding" },
    kunde: { de: "Ticket AG", en: "Ticket AG" },
    meta:  { de: "Branding, UI · 2025", en: "Branding, UI · 2025" },
    beschreibung: {
      de: "Ganzheitliches Rebranding für die Ticket AG – von der Markenstrategie über die visuelle Identität bis zum UI-Design der Ticketing-Plattform.",
      en: "A full rebranding for Ticket AG – from brand strategy and visual identity to the UI design of the ticketing platform.",
    },
    leistungen: ["Strategie", "Branding", "Visual Identity", "Design-System", "UI-Design"],
    fall: [
      {
        art: "bild",
        bild: "/projekte/ticket-ag/desktop.webp",
        alt: { de: "Ticket AG – die neue Ticketing-Plattform auf Laptop und Smartphone", en: "Ticket AG – the new ticketing platform on laptop and smartphone" },
        buehne: "sand",
        unterschrift: { de: "Die neue All-in-One-Ticketing-Plattform.", en: "The new all-in-one ticketing platform." },
      },
      {
        art: "text",
        label: { de: "Ziel", en: "Objective" },
        lead: true,
        absaetze: [
          {
            de: "Ganzheitliche Evolution der Markenidentität der Ticket AG zur Steigerung von Brand Integrity und Glaubwürdigkeit. Durch eine geschärfte visuelle und verbale Sprache entstand ein Markenerlebnis, das Sicherheit und Verlässlichkeit in den Mittelpunkt stellt – und die Marke als vertrauenswürdige Instanz in einem kompetitiven Marktumfeld nachhaltig verankert.",
            en: "A holistic evolution of Ticket AG's brand identity to strengthen brand integrity and credibility. A sharpened visual and verbal language created a brand experience built around safety and reliability – anchoring the brand as a trustworthy player in a competitive market.",
          },
        ],
      },
      {
        art: "prozess",
        label: { de: "Vorgehen", en: "Approach" },
        schritte: [
          {
            titel: { de: "Bestandsaufnahme — Strategische Analyse & Research", en: "Audit — strategic analysis & research" },
            text:  { de: "Umfassende Analyse des Status quo und Identifikation der Pain Points. Wettbewerbs-Benchmarking und Zielgruppen-Analyse.", en: "A thorough analysis of the status quo and identification of pain points. Competitive benchmarking and audience research." },
          },
          {
            titel: { de: "Brand-DNA & Marktpositionierung", en: "Brand DNA & market positioning" },
            text:  { de: "Schärfung von Vision, Mission und Markenidentität. Definition der strategischen Marktpositionierung für zukünftiges Wachstum.", en: "Sharpening vision, mission and brand identity. Defining a strategic market position for future growth." },
          },
          {
            titel: { de: "Konzeption & Design-Sprache (Visual Identity)", en: "Concept & design language (visual identity)" },
            text:  { de: "Logo, Farbsystem, Typografie und Bildsprache. Aufbau eines Design-Systems für digitale und physische Anwendungen.", en: "Logo, colour system, typography and imagery. Building a design system for digital and physical applications." },
          },
          {
            titel: { de: "Implementierung", en: "Implementation" },
            text:  { de: "Erstellung von Brand Guidelines (Styleguide) zur Sicherung der Konsistenz. Begleitung des Rollouts.", en: "Creating brand guidelines (styleguide) to safeguard consistency. Supporting the rollout." },
          },
        ],
      },
      {
        art: "bild",
        label: { de: "Logo — vorher / nachher", en: "Logo — before / after" },
        bild: "/projekte/ticket-ag/logo-evolution.webp",
        alt: { de: "Logo-Evolution: von der alten Wortmarke TICKET AG zur neuen Wortmarke ti3ket", en: "Logo evolution: from the old TICKET AG wordmark to the new ti3ket wordmark" },
        buehne: "papier",
        max: "860px",
        unterschrift: { de: "Vom kantigen Kürzel zur klaren, selbstbewussten Wortmarke.", en: "From an angular monogram to a clear, confident wordmark." },
      },
      {
        art: "paar",
        label: { de: "Digitale Anwendung", en: "Digital application" },
        buehne: "sand",
        bilder: [
          { bild: "/projekte/ticket-ag/desktop.webp", alt: { de: "Desktop-Ansicht der neuen ticket.ag-Plattform", en: "Desktop view of the new ticket.ag platform" }, max: "540px", unterschrift: { de: "Desktop", en: "Desktop" } },
          { bild: "/projekte/ticket-ag/mobile.webp", alt: { de: "Mobile Ansicht der neuen ticket.ag-Website", en: "Mobile view of the new ticket.ag website" }, max: "150px", unterschrift: { de: "Mobile", en: "Mobile" } },
          { bild: "/projekte/ticket-ag/app-icon.webp", alt: { de: "App-Icon der neuen Marke", en: "App icon of the new brand" }, max: "84px", unterschrift: { de: "App-Icon", en: "App icon" } },
        ],
      },
      {
        art: "bild",
        label: { de: "Bildwelt", en: "Imagery" },
        bild: "/projekte/ticket-ag/bildwelt.webp",
        alt: { de: "Bildwelt der Marke: Schwarz-Weiß-Fotografie von Konzerten und Bühnen", en: "Brand imagery: black-and-white photography of concerts and stages" },
        buehne: "sand",
        unterschrift: { de: "Emotion, Energie und Live-Momente – die fotografische Bildwelt.", en: "Emotion, energy and live moments – the brand's photographic imagery." },
      },
    ],
  },
  {
    slug: "echory-logo-redesign",
    bild: "/projekte/karten/echory.webp",
    titel: { de: "logo redesign", en: "logo redesign" },
    kunde: { de: "echory", en: "echory" },
    meta:  { de: "Logo · 2024", en: "Logo · 2024" },
    beschreibung: {
      de: "Logo-Redesign für echory – eine klare, moderne Bildmarke.",
      en: "Logo redesign for echory – a clean, modern brand mark.",
    },
    leistungen: ["Logo-Design"],
  },
  {
    slug: "eisbaeren-berlin-logo",
    bild: "/projekte/karten/eisbaeren.webp",
    titel: { de: "logo redesign", en: "logo redesign" },
    kunde: { de: "Eisbären Berlin", en: "Eisbären Berlin" },
    meta:  { de: "Sport, Logo · 2024", en: "Sport, Logo · 2024" },
    beschreibung: {
      de: "Logo-Redesign im Sport-Kontext für die Eisbären Berlin.",
      en: "Logo redesign in a sports context for Eisbären Berlin.",
    },
    leistungen: ["Sport-Branding", "Logo-Design"],
  },
  {
    slug: "3d-rendering-schuh",
    bild: "/projekte/karten/schuh-3d.webp",
    titel: { de: "3d-rendering", en: "3d rendering" },
    kunde: { de: "Schuh-Modell", en: "Shoe model" },
    meta:  { de: "3D, Produkt · 2024", en: "3D, Product · 2024" },
    beschreibung: {
      de: "Fotorealistisches 3D-Rendering eines Schuh-Modells zur Produktvisualisierung.",
      en: "Photorealistic 3D rendering of a shoe model for product visualisation.",
    },
    leistungen: ["3D-Rendering", "Produktvisualisierung"],
  },
  {
    slug: "content-creation",
    bild: "/projekte/karten/content.webp",
    titel: { de: "content creation", en: "content creation" },
    kunde: { de: "Verschiedene Brands", en: "Various brands" },
    meta:  { de: "Social · 2023–25", en: "Social · 2023–25" },
    beschreibung: {
      de: "Content Creation für verschiedene Brands – Social-Media-Gestaltung über mehrere Formate.",
      en: "Content creation for various brands – social media design across multiple formats.",
    },
    leistungen: ["Social Media", "Content Creation"],
  },
  {
    slug: "brand-assets-ecostag",
    bild: "/projekte/karten/brand-assets.webp",
    titel: { de: "brand assets", en: "brand assets" },
    kunde: { de: "ecostag / stagedates", en: "ecostag / stagedates" },
    meta:  { de: "Branding · 2024", en: "Branding · 2024" },
    beschreibung: {
      de: "Brand Assets für ecostag / stagedates – konsistente Bausteine für die Markenwelt.",
      en: "Brand assets for ecostag / stagedates – consistent building blocks for the brand world.",
    },
    leistungen: ["Branding", "Brand Assets"],
  },
  {
    slug: "merchandise-stagedates",
    bild: "/projekte/karten/merch.webp",
    titel: { de: "merchandise", en: "merchandise" },
    kunde: { de: "stagedates", en: "stagedates" },
    meta:  { de: "Merch, Print · 2024", en: "Merch, Print · 2024" },
    beschreibung: {
      de: "Merchandise- und Print-Gestaltung für stagedates.",
      en: "Merchandise and print design for stagedates.",
    },
    leistungen: ["Merchandise", "Print"],
  },
  {
    slug: "private-projekte",
    bild: "/projekte/karten/private.webp",
    titel: { de: "private projekte", en: "personal work" },
    kunde: { de: "Auswahl", en: "Selection" },
    meta:  { de: "Illustration · laufend", en: "Illustration · ongoing" },
    beschreibung: {
      de: "Eine Auswahl persönlicher Illustrationsprojekte – laufend erweitert.",
      en: "A selection of personal illustration projects – ongoing.",
    },
    leistungen: ["Illustration"],
  },
  {
    slug: "lampenwelt-banner",
    bild: "/projekte/karten/lampenwelt.webp",
    titel: { de: "banner-gestaltung", en: "banner design" },
    kunde: { de: "Lampenwelt", en: "Lampenwelt" },
    meta:  { de: "Ausblick · 2026", en: "Preview · 2026" },
    beschreibung: {
      de: "Banner-Gestaltung für Lampenwelt (Ausblick 2026).",
      en: "Banner design for Lampenwelt (preview 2026).",
    },
    leistungen: ["Banner", "Display"],
  },
];
