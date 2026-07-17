// Die ausgewählten Arbeiten für den Index auf der Startseite.
// Hier pflegst du Projekte – Reihenfolge = Reihenfolge auf der Seite.
// `titel` / `kunde` / `meta` haben je eine deutsche (de) und englische (en) Fassung.
// Ist keine englische Fassung nötig (z. B. Eigennamen), einfach denselben Text eintragen.
//
// DETAILSEITE (jedes Projekt bekommt eine eigene Unterseite /projekte/<slug>):
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
//   { art: "liste",   … }  unnummerierte Aufzählung (Label + Punkte) – z. B. Leistungen/Umfang
//   { art: "auslage", … }  Wortliste + Bildwechsel: rechts die Asset-Wörter, links ein fester
//                          Bildplatz. Hover/Tippen auf ein Wort tauscht das Bild an gleicher Stelle
//                          (Ruhezustand: dezente Auto-Schleife, stoppt beim ersten Hover).
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

/* Ein „Stück" der Auslage: ein Wort in der Liste + das Bild, das beim Hover erscheint. */
export type AuslageStueck = {
  wort: Zwei;
  bild: string;
  alt: Zwei;
  /* Kleine Bildunterschrift unter dem gewechselten Bild (optional). */
  unterschrift?: Zwei;
};

export type FallBlock =
  | { art: "bild"; label?: Zwei; bild: string; alt: Zwei; buehne?: Buehne; max?: string; unterschrift?: Zwei }
  | { art: "paar"; label?: Zwei; buehne?: Buehne; bilder: FallBild[] }
  | { art: "text"; label?: Zwei; lead?: boolean; absaetze: Zwei[] }
  | { art: "prozess"; label?: Zwei; schritte: { titel: Zwei; text: Zwei }[] }
  | { art: "liste"; label?: Zwei; punkte: Zwei[] }
  | { art: "auslage"; label?: Zwei; einleitung?: Zwei; buehne?: Buehne; stuecke: AuslageStueck[] };

export type Projekt = {
  /* URL der Detailseite: /projekte/<slug> */
  slug: string;
  /* Vorschaubild in /public/projekte/… (Pfad ab Website-Wurzel) */
  bild: string;
  titel: { de: string; en: string };
  kunde: { de: string; en: string };
  meta: { de: string; en: string };
  /* Kategorien/Labels — Grundlage für die Filter auf der Projekte-Übersicht.
     Reihenfolge der ersten Nennung = Reihenfolge in der Filterleiste. */
  labels?: Zwei[];
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
    slug: "brand-assets-ecostag",
    bild: "/projekte/karten/brand-assets.webp",
    titel: { de: "Brand Assets", en: "Brand Assets" },
    kunde: { de: "ecostag / stagedates", en: "ecostag / stagedates" },
    meta:  { de: "Branding · 2024", en: "Branding · 2024" },
    labels: [{ de: "Branding", en: "Branding" }],
    beschreibung: {
      de: "Brand Assets für ecostag / stagedates – konsistente Bausteine für die Markenwelt.",
      en: "Brand assets for ecostag / stagedates – consistent building blocks for the brand world.",
    },
    leistungen: ["Branding", "Brand Assets"],
    fall: [
      {
        art: "text",
        label: { de: "Rolle", en: "Role" },
        lead: true,
        absaetze: [
          {
            de: "Grafik- & UI-Designerin bei ecostag für die Marke stagedates – eigenverantwortliche Umsetzung sämtlicher benötigter grafischer Assets.",
            en: "Graphic & UI designer at ecostag for the stagedates brand – independently producing all required graphic assets.",
          },
        ],
      },
      {
        art: "liste",
        label: { de: "Schwerpunkte", en: "Focus" },
        punkte: [
          { de: "Verantwortung für die Bildsprache auf Social-Media-Plattformen wie LinkedIn und Instagram", en: "Ownership of the visual language across social platforms such as LinkedIn and Instagram" },
          { de: "Grafische Arbeiten zur Unterstützung des Social-Media-Teams", en: "Graphic work supporting the social media team" },
          { de: "Digitale Banner für Newsletter-Kampagnen", en: "Digital banners for newsletter campaigns" },
          { de: "Digitale und Print-Grafiken, u. a. für interne Mitarbeiterevents", en: "Digital and print graphics, e.g. for internal employee events" },
        ],
      },
    ],
  },
  {
    slug: "eisbaeren-berlin-logo",
    bild: "/projekte/karten/eisbaeren.webp",
    titel: { de: "Logo Redesign", en: "Logo Redesign" },
    kunde: { de: "Eisbären Berlin", en: "Eisbären Berlin" },
    meta:  { de: "Logo · 2024", en: "Logo · 2024" },
    labels: [{ de: "Logo", en: "Logo" }],
    beschreibung: {
      de: "Logo-Redesign im Sport-Kontext für die Eisbären Berlin.",
      en: "Logo redesign in a sports context for Eisbären Berlin.",
    },
    leistungen: ["Sport-Branding", "Logo-Design"],
    fall: [
      {
        art: "text",
        label: { de: "Kontext", en: "Context" },
        lead: true,
        absaetze: [
          {
            de: "Prüfungsleistung im Modul „Visuelle Kommunikation“ meines Bachelorstudiums Design- und Projektmanagement.",
            en: "Coursework for the module “Visual Communication” in my Design & Project Management bachelor’s degree.",
          },
        ],
      },
      {
        art: "text",
        label: { de: "Ziel", en: "Objective" },
        absaetze: [
          {
            de: "Neugestaltung eines bereits vorhandenen Sportvereins-Logos – die Kombination aus Tiermotiv und Schrift.",
            en: "Redesigning an existing sports club logo – the combination of an animal motif and lettering.",
          },
        ],
      },
      {
        art: "liste",
        label: { de: "Vorgehen", en: "Approach" },
        punkte: [
          { de: "Skizzieren der Ideen", en: "Sketching the ideas" },
          { de: "Recherche zur aktuellen und vorherigen Logogestaltung", en: "Researching the current and previous logo designs" },
          { de: "Kombination neuer Ideen mit bewährten Elementen aus der Logo-Historie", en: "Combining new ideas with proven elements from the logo’s history" },
          { de: "Grafische Ausarbeitung der Bildmarke", en: "Crafting the graphic mark" },
          { de: "Auswahl und Platzierung passender typografischer Elemente", en: "Selecting and placing suitable typographic elements" },
          { de: "Farbwahl: bewusste Abstufungen der drei Grundfarben – im Anwendungskontext mit sehr deutlichem Farbkontrast", en: "Colour choice: deliberate variations of the three base colours – with strong contrast in application" },
        ],
      },
    ],
  },
  {
    slug: "echory-logo-redesign",
    bild: "/projekte/karten/echory.webp",
    titel: { de: "Logo Redesign", en: "Logo Redesign" },
    kunde: { de: "echory", en: "echory" },
    meta:  { de: "Logo · 2024", en: "Logo · 2024" },
    labels: [{ de: "Logo", en: "Logo" }],
    beschreibung: {
      de: "Logo-Redesign für echory – eine klare, moderne Bildmarke.",
      en: "Logo redesign for echory – a clean, modern brand mark.",
    },
    leistungen: ["Logo-Design"],
    fall: [
      {
        art: "text",
        label: { de: "Ziel", en: "Objective" },
        lead: true,
        absaetze: [
          {
            de: "Logo-Redesign für die Marke echoryflow – eine klare, moderne Bildmarke.",
            en: "Logo redesign for the echoryflow brand – a clear, modern brand mark.",
          },
        ],
      },
      {
        art: "liste",
        label: { de: "Vorgehen", en: "Approach" },
        punkte: [
          { de: "Definition einer konsistenten visuellen Sprache auf Grundlage eines vorab erarbeiteten Markenkerns", en: "Defining a consistent visual language based on a previously developed brand core" },
          { de: "Erarbeitung eines individuellen Logos auf Basis der Kernelemente der Markenidentität: Present. Confident. Precise.", en: "Developing a bespoke logo from the core elements of the brand identity: Present. Confident. Precise." },
        ],
      },
    ],
  },
  {
    slug: "content-creation",
    bild: "/projekte/karten/content.webp",
    titel: { de: "Content Creation", en: "Content Creation" },
    kunde: { de: "Verschiedene Brands", en: "Various brands" },
    meta:  { de: "Social · 2023–25", en: "Social · 2023–25" },
    labels: [{ de: "Social", en: "Social" }],
    beschreibung: {
      de: "Content Creation für verschiedene Brands – Social-Media-Gestaltung über mehrere Formate.",
      en: "Content creation for various brands – social media design across multiple formats.",
    },
    leistungen: ["Social Media", "Content Creation"],
    fall: [
      {
        art: "text",
        label: { de: "Rolle", en: "Role" },
        lead: true,
        absaetze: [
          {
            de: "Bachelorandin bei LIEBERMANN communications – Betreuung der Instagram-Auftritte verschiedener Kunden aus der Beauty-, Fitness- und Lifestyle-Branche.",
            en: "Bachelor’s intern at LIEBERMANN communications – managing the Instagram presences of various clients from the beauty, fitness and lifestyle sectors.",
          },
        ],
      },
      {
        art: "liste",
        label: { de: "Aufgaben", en: "Responsibilities" },
        punkte: [
          { de: "Ideengenerierung", en: "Idea generation" },
          { de: "Recherche zu inhaltlichen Schwerpunktthemen", en: "Research into key content topics" },
          { de: "Beobachtung von Trends", en: "Trend monitoring" },
          { de: "Volle Verantwortung für Redaktionspläne", en: "Full responsibility for editorial planning" },
          { de: "Fotografie und Bildnachbearbeitung", en: "Photography and image retouching" },
          { de: "Erstellung visueller Inhalte unter Berücksichtigung des Corporate Designs", en: "Creating visual content in line with the corporate design" },
        ],
      },
      {
        art: "liste",
        label: { de: "Betreute Accounts", en: "Managed accounts" },
        punkte: [
          { de: "@alphabiol_beauty", en: "@alphabiol_beauty" },
          { de: "@justfit_fitnessclubs", en: "@justfit_fitnessclubs" },
          { de: "@liebermann_communications", en: "@liebermann_communications" },
        ],
      },
    ],
  },
  {
    slug: "ticket-ag-rebranding",
    bild: "/projekte/karten/ticket-ag.webp",
    titel: { de: "Rebranding", en: "Full Rebranding" },
    kunde: { de: "Ticket AG", en: "Ticket AG" },
    meta:  { de: "Branding, UI · 2025", en: "Branding, UI · 2025" },
    labels: [{ de: "Branding", en: "Branding" }, { de: "UI", en: "UI" }],
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
    slug: "private-projekte",
    bild: "/projekte/karten/private.webp",
    titel: { de: "Private Projekte", en: "Personal Work" },
    kunde: { de: "Auswahl", en: "Selection" },
    meta:  { de: "Illustration · laufend", en: "Illustration · ongoing" },
    labels: [{ de: "Illustration", en: "Illustration" }],
    beschreibung: {
      de: "Eine Auswahl persönlicher Illustrationsprojekte – laufend erweitert.",
      en: "A selection of personal illustration projects – ongoing.",
    },
    leistungen: ["Illustration"],
    fall: [
      {
        art: "text",
        label: { de: "Über", en: "About" },
        lead: true,
        absaetze: [
          {
            de: "Freizeit-Projekte für Freunde und Verwandte – zu verschiedenen Anlässen und mit unterschiedlichen ästhetischen Ansprüchen.",
            en: "Personal projects for friends and family – for a range of occasions and aesthetic briefs.",
          },
        ],
      },
      {
        art: "liste",
        label: { de: "Formate", en: "Formats" },
        punkte: [
          { de: "Save-the-Date-Karten", en: "Save-the-date cards" },
          { de: "Einladungen", en: "Invitations" },
          { de: "Gutscheine", en: "Vouchers" },
          { de: "u. v. m.", en: "and much more" },
        ],
      },
    ],
  },
  {
    slug: "merchandise-stagedates",
    bild: "/projekte/karten/merch.webp",
    titel: { de: "Merchandise", en: "Merchandise" },
    kunde: { de: "stagedates", en: "stagedates" },
    meta:  { de: "Merch, Print · 2024", en: "Merch, Print · 2024" },
    labels: [{ de: "Merch", en: "Merch" }, { de: "Print", en: "Print" }],
    beschreibung: {
      de: "Merchandise- und Print-Gestaltung für stagedates.",
      en: "Merchandise and print design for stagedates.",
    },
    leistungen: ["Merchandise", "Print"],
    fall: [
      {
        art: "text",
        label: { de: "Rolle", en: "Role" },
        lead: true,
        absaetze: [
          {
            de: "Grafik- & UI-Designerin bei ecostag für die Marke stagedates – selbstständige Planung und Umsetzung eines Merchandise-Konzepts zur Repräsentation des Unternehmens auf dem Reeperbahn-Festival 2024.",
            en: "Graphic & UI designer at ecostag for the stagedates brand – independently planning and delivering a merchandise concept to represent the company at Reeperbahn Festival 2024.",
          },
        ],
      },
      {
        art: "liste",
        label: { de: "Umfang", en: "Scope" },
        punkte: [
          { de: "Inhaltliche und grafische Umsetzung eines informativen Flyers", en: "Content and design of an informative flyer" },
          { de: "Betreuung einer OOH-Beamerkampagne", en: "Overseeing an out-of-home projection campaign" },
          { de: "Mitarbeiter-Shirts für einen einheitlichen Auftritt beim Juicy Beats Festival", en: "Staff shirts for a unified appearance at Juicy Beats Festival" },
          { de: "Inhaltliche und grafische Umsetzung verschiedener Sticker", en: "Content and design of various stickers" },
          { de: "Recherche, Umsetzung und Druckvorbereitung gebrandeter Werbeartikel (Stifte, Blöcke, Feuerzeuge, Luftballons u. a.)", en: "Research, production and print preparation of branded merchandise (pens, notepads, lighters, balloons and more)" },
        ],
      },
      {
        art: "auslage",
        label: { de: "Die Werbeartikel", en: "The merch" },
        einleitung: {
          de: "Fahr über ein Wort – der passende Artikel erscheint daneben.",
          en: "Hover over a word – the matching item appears beside it.",
        },
        buehne: "sand",
        stuecke: [
          {
            wort: { de: "Feuerzeuge & Kugelschreiber", en: "Lighters & pens" },
            bild: "/projekte/merchandise-stagedates/feuerzeuge-kugelschreiber.webp",
            alt: { de: "Gebrandete Feuerzeuge und Kugelschreiber für stagedates", en: "Branded stagedates lighters and pens" },
            unterschrift: { de: "Gebrandete Feuerzeuge & Kugelschreiber", en: "Branded lighters & pens" },
          },
          {
            wort: { de: "Flyer", en: "Flyer" },
            bild: "/projekte/merchandise-stagedates/flyer.webp",
            alt: { de: "Informativer Flyer für stagedates", en: "Informative stagedates flyer" },
            unterschrift: { de: "Informativer Flyer", en: "Informative flyer" },
          },
          {
            wort: { de: "Liegestühle", en: "Deck chairs" },
            bild: "/projekte/merchandise-stagedates/liegestuehle.webp",
            alt: { de: "Gebrandete Liegestühle für stagedates", en: "Branded stagedates deck chairs" },
            unterschrift: { de: "Gebrandete Liegestühle", en: "Branded deck chairs" },
          },
          {
            wort: { de: "T-Shirt", en: "T-shirt" },
            bild: "/projekte/merchandise-stagedates/t-shirt.webp",
            alt: { de: "Mitarbeiter-Shirt für einen einheitlichen Auftritt", en: "Staff shirt for a unified appearance" },
            unterschrift: { de: "Mitarbeiter-Shirt", en: "Staff shirt" },
          },
          {
            wort: { de: "Sticker", en: "Stickers" },
            bild: "/projekte/merchandise-stagedates/sticker.webp",
            alt: { de: "Verschiedene gebrandete Sticker", en: "Various branded stickers" },
            unterschrift: { de: "Gebrandete Sticker", en: "Branded stickers" },
          },
        ],
      },
    ],
  },
  {
    slug: "3d-rendering-schuh",
    bild: "/projekte/karten/schuh-3d.webp",
    titel: { de: "3D-Rendering", en: "3D Rendering" },
    kunde: { de: "Schuh-Modell", en: "Shoe model" },
    meta:  { de: "3D · 2024", en: "3D · 2024" },
    labels: [{ de: "3D", en: "3D" }],
    beschreibung: {
      de: "Fotorealistisches 3D-Rendering eines Schuh-Modells zur Produktvisualisierung.",
      en: "Photorealistic 3D rendering of a shoe model for product visualisation.",
    },
    leistungen: ["3D-Rendering", "Produktvisualisierung"],
    fall: [
      {
        art: "text",
        label: { de: "Kontext", en: "Context" },
        lead: true,
        absaetze: [
          {
            de: "Prüfungsleistung im Modul „Digitale Illustration“ meines Bachelorstudiums Design- und Projektmanagement.",
            en: "Coursework for the module “Digital Illustration” in my Design & Project Management bachelor’s degree.",
          },
        ],
      },
      {
        art: "text",
        label: { de: "Ziel", en: "Objective" },
        absaetze: [
          {
            de: "Grafische Ausarbeitung eines existierenden Schuh-Modells.",
            en: "A graphic rendering of an existing shoe model.",
          },
        ],
      },
      {
        art: "liste",
        label: { de: "Vorgehen", en: "Approach" },
        punkte: [
          { de: "Iterative Erarbeitung der Renderings von der Skizze bis zum finalen Entwurf", en: "Iterative development of the renderings from sketch to final design" },
          { de: "Individuelle farbliche Gestaltung", en: "Bespoke colour design" },
          { de: "Aufwertung der Komposition mittels Komplementärkontrast (Blau/Orange)", en: "Elevating the composition with complementary contrast (blue/orange)" },
          { de: "Entwicklung eines passenden Claims: „Never Take Them Off“ – passend zur Kooperation mit der Marke Off-White", en: "Developing a fitting claim: “Never Take Them Off” – in keeping with the collaboration with Off-White" },
          { de: "Gestaltung eines Posters", en: "Designing a poster" },
        ],
      },
    ],
  },
  {
    slug: "lampenwelt-banner",
    bild: "/projekte/karten/lampenwelt.webp",
    titel: { de: "Banner-Gestaltung", en: "Banner Design" },
    kunde: { de: "Lampenwelt", en: "Lampenwelt" },
    meta:  { de: "Ausblick · 2026", en: "Preview · 2026" },
    labels: [{ de: "Banner", en: "Banner" }],
    beschreibung: {
      de: "Banner-Gestaltung für Lampenwelt (Ausblick 2026).",
      en: "Banner design for Lampenwelt (preview 2026).",
    },
    leistungen: ["Banner", "Display"],
    fall: [
      {
        art: "text",
        label: { de: "Ausblick", en: "Preview" },
        lead: true,
        absaetze: [
          {
            de: "Ausblick auf meine Arbeit als Art Director bei lampenwelt.de: eigeninitiative Gestaltung einer Grafik zur Bewerbung einer potenziellen Herbst-Rabattaktion – für Newsletter und Online-Shop.",
            en: "A preview of my work as art director at lampenwelt.de: a self-initiated graphic promoting a potential autumn discount campaign – for the newsletter and online shop.",
          },
        ],
      },
      {
        art: "liste",
        label: { de: "Vorgehen", en: "Approach" },
        punkte: [
          { de: "Einbindung und Kombination zweier Produkte in eine Bildkomposition", en: "Integrating and combining two products into one image composition" },
          { de: "Farbliche Gestaltung und bewusste Produktauswahl passend zum Herbst-Thema", en: "Colour design and deliberate product selection to suit the autumn theme" },
          { de: "Berücksichtigung und Adaption der bisherigen Gestaltungsgrundlagen", en: "Respecting and adapting the existing design foundations" },
          { de: "Einhaltung des Corporate Designs", en: "Adhering to the corporate design" },
          { de: "Aufgreifen der Produktfarben in den Design-Elementen zur Abrundung des Gesamtbildes", en: "Echoing the product colours in the design elements to round off the overall look" },
          { de: "Adaption der Gestaltung auf zwei verschiedene Formatgrößen", en: "Adapting the design to two different format sizes" },
        ],
      },
    ],
  },
];
