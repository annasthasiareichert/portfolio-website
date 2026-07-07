// Die ausgewählten Arbeiten für den Index auf der Startseite.
// Hier pflegst du Projekte – Reihenfolge = Reihenfolge auf der Seite.
// `titel` / `kunde` / `meta` haben je eine deutsche (de) und englische (en) Fassung.
// Ist keine englische Fassung nötig (z. B. Eigennamen), einfach denselben Text eintragen.

export type Projekt = {
  /* Bild in /public/projekte/… (Pfad ab Website-Wurzel) */
  bild: string;
  titel: { de: string; en: string };
  kunde: { de: string; en: string };
  meta: { de: string; en: string };
};

export const projekte: Projekt[] = [
  {
    bild: "/projekte/p1-ticketag.jpg",
    titel: { de: "ganzheitliches rebranding", en: "full rebranding" },
    kunde: { de: "Ticket AG", en: "Ticket AG" },
    meta:  { de: "Branding, UI · 2025", en: "Branding, UI · 2025" },
  },
  {
    bild: "/projekte/p2-echory.jpg",
    titel: { de: "logo redesign", en: "logo redesign" },
    kunde: { de: "echory", en: "echory" },
    meta:  { de: "Logo · 2024", en: "Logo · 2024" },
  },
  {
    bild: "/projekte/p3-eisbaeren.jpg",
    titel: { de: "logo redesign", en: "logo redesign" },
    kunde: { de: "Eisbären Berlin", en: "Eisbären Berlin" },
    meta:  { de: "Sport, Logo · 2024", en: "Sport, Logo · 2024" },
  },
  {
    bild: "/projekte/p4-schuh3d.jpg",
    titel: { de: "3d-rendering", en: "3d rendering" },
    kunde: { de: "Schuh-Modell", en: "Shoe model" },
    meta:  { de: "3D, Produkt · 2024", en: "3D, Product · 2024" },
  },
  {
    bild: "/projekte/p5-content.jpg",
    titel: { de: "content creation", en: "content creation" },
    kunde: { de: "Verschiedene Brands", en: "Various brands" },
    meta:  { de: "Social · 2023–25", en: "Social · 2023–25" },
  },
  {
    bild: "/projekte/p6-brandassets.jpg",
    titel: { de: "brand assets", en: "brand assets" },
    kunde: { de: "ecostag / stagedates", en: "ecostag / stagedates" },
    meta:  { de: "Branding · 2024", en: "Branding · 2024" },
  },
  {
    bild: "/projekte/p7-merch.jpg",
    titel: { de: "merchandise", en: "merchandise" },
    kunde: { de: "stagedates", en: "stagedates" },
    meta:  { de: "Merch, Print · 2024", en: "Merch, Print · 2024" },
  },
  {
    bild: "/projekte/p8-private.jpg",
    titel: { de: "private projekte", en: "personal work" },
    kunde: { de: "Auswahl", en: "Selection" },
    meta:  { de: "Illustration · laufend", en: "Illustration · ongoing" },
  },
  {
    bild: "/projekte/p9-lampenwelt.jpg",
    titel: { de: "banner-gestaltung", en: "banner design" },
    kunde: { de: "Lampenwelt", en: "Lampenwelt" },
    meta:  { de: "Ausblick · 2026", en: "Preview · 2026" },
  },
];
