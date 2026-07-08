// Die ausgewählten Arbeiten für den Index auf der Startseite.
// Hier pflegst du Projekte – Reihenfolge = Reihenfolge auf der Seite.
// `titel` / `kunde` / `meta` haben je eine deutsche (de) und englische (en) Fassung.
// Ist keine englische Fassung nötig (z. B. Eigennamen), einfach denselben Text eintragen.
//
// DETAILSEITE (jedes Projekt bekommt eine eigene Unterseite /arbeiten/<slug>):
// · `slug`         = Adresse der Unterseite (kleingeschrieben, mit Bindestrichen, einmalig).
// · `beschreibung` = Einleitungstext der Detailseite. Die kurzen Sätze unten sind nur ein
//                    Startpunkt – ersetze sie durch deine echte Case-Study.
// · `leistungen`   = Schlagworte (Pills) auf der Detailseite.
// · `bilder`       = zusätzliche Bilder für die Galerie (Pfade ab /public). Leer lassen =
//                    es wird nur das Vorschaubild `bild` gezeigt. Lege neue Bilder in
//                    /public/projekte/ ab und trage sie hier ein.

export type Projekt = {
  /* URL der Detailseite: /arbeiten/<slug> */
  slug: string;
  /* Bild in /public/projekte/… (Pfad ab Website-Wurzel) */
  bild: string;
  titel: { de: string; en: string };
  kunde: { de: string; en: string };
  meta: { de: string; en: string };
  /* --- Detailseite (optional) --- */
  beschreibung?: { de: string; en: string };
  leistungen?: string[];
  bilder?: string[];
};

export const projekte: Projekt[] = [
  {
    slug: "ticket-ag-rebranding",
    bild: "/projekte/p1-ticketag.jpg",
    titel: { de: "ganzheitliches rebranding", en: "full rebranding" },
    kunde: { de: "Ticket AG", en: "Ticket AG" },
    meta:  { de: "Branding, UI · 2025", en: "Branding, UI · 2025" },
    beschreibung: {
      de: "Ein ganzheitliches Rebranding für die Ticket AG – von der visuellen Identität bis zum UI-Design der Plattform.",
      en: "A full rebranding for Ticket AG – from the visual identity to the UI design of the platform.",
    },
    leistungen: ["Branding", "UI-Design"],
  },
  {
    slug: "echory-logo-redesign",
    bild: "/projekte/p2-echory.jpg",
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
    bild: "/projekte/p3-eisbaeren.jpg",
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
    bild: "/projekte/p4-schuh3d.jpg",
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
    bild: "/projekte/p5-content.jpg",
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
    bild: "/projekte/p6-brandassets.jpg",
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
    bild: "/projekte/p7-merch.jpg",
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
    bild: "/projekte/p8-private.jpg",
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
    bild: "/projekte/p9-lampenwelt.jpg",
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
