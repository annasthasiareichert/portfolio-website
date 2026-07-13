// Inhalte des Lebenslaufs — extrahiert aus der Canva-Vorlage (DAHMEbrT2ts).
// Wird auf /lebenslauf ausgegeben. Reihenfolge der Stationen = Reihenfolge auf der Seite
// (oben = aktuellste). Das PDF unter /dokumente/ wird direkt aus derselben Canva-Datei
// exportiert — bei Änderungen also am besten beides pflegen.

export type Station = {
  zeitraum: string;
  rolle: string;
  art?: string;           // z. B. „Vollzeit", „Werkstudium"
  firma: string;
  ort: string;
  punkte: string[];
};

export type Bildungsweg = {
  abschluss: string;
  fach: string;
  ort: string;
};

/* Kurzprofil (Über-mich-Text aus dem CV) */
export const profil =
  "Mit 5 Jahren Erfahrung im Grafikdesign und 1,5 Jahren im UI-Design schlage ich die " +
  "Brücke zwischen klassischer Gestaltung und digitalen Erlebnissen. Zu meinen größten " +
  "Erfolgen zählt das eigenverantwortliche Rebranding der Ticket AG. Kenntnisse der Adobe " +
  "Creative Cloud, Canva, Figma sowie Framer und KI-Tools bilden die Basis meiner Arbeit. " +
  "Angetrieben von meiner Leidenschaft für visuelle Identitäten suche ich eine erfüllende " +
  "Herausforderung mit viel Raum für persönliche und fachliche Weiterentwicklung.";

export const untertitel = "Art Direction · Grafikdesign · Branding";

/* Berufserfahrung — aktuellste zuerst */
export const stationen: Station[] = [
  {
    zeitraum: "03.2024 – 11.2025",
    rolle: "Grafik- & UI-Designerin",
    art: "Vollzeit",
    firma: "ecostag GmbH",
    ort: "Dortmund",
    punkte: [
      "Eigenständige Entwicklung eines ganzheitlichen Rebrandings für die Ticket AG",
      "Planung & Umsetzung responsiver Landingpages und Websites mit Framer und Webflow",
      "Gestaltung von Print- und Digitalmaterialien wie Flyern, Plakaten, Merchandise und Social-Media-Grafiken inkl. Druckvorbereitung mit Budgetverantwortung",
      "Gestaltung nutzerzentrierter Interfaces für Web- und App-Anwendungen mit Figma",
      "Agiles Projektmanagement nach SCRUM-Methodik mittels Jira",
      "Steuerung externer Agenturen",
      "Erste Erfahrungen im Erstellen von Motion Designs mittels Adobe After Effects",
    ],
  },
  {
    zeitraum: "03.2021 – 10.2023",
    rolle: "Employer Branding & Content Marketing Managerin",
    art: "Werkstudium",
    firma: "e.pilot GmbH",
    ort: "Köln",
    punkte: [
      "Planung & Umsetzung responsiver Landingpages und Websites im Zuge eines Markenrelaunchs",
      "Ownerin des Bereichs Employer Branding",
      "Entwicklung und Implementierung einer Social-Media-Strategie inkl. laufender, KPI-basierter Optimierung für TikTok, Instagram und LinkedIn",
      "Agiles Projektmanagement nach SCRUM-Methodik mittels Jira und Steuerung externer Agenturen",
      "Gestaltung von Digitalmaterialien wie Social-Media-Grafiken, Thumbnails und Youtube-Bannern",
      "Kreation kampagnenbezogener Digital-/Printmaterialien wie Plakaten, Roll-Ups und Flyern",
    ],
  },
  {
    zeitraum: "10.2019 – 04.2020",
    rolle: "Social Media & Influencer Marketing Managerin",
    art: "Bachelorandin",
    firma: "LIEBERMANN communications",
    ort: "Bergisch Gladbach",
    punkte: [
      "Trend-Analysen sowie Umsetzung von Content-Formaten für die Instagram-Accounts der Marken ALPHABIOL, JustFit",
      "Eigenständige Produkt-Fotografie & Bearbeitung sowie Videodreh und -schnitt für ALPHABIOL, JustFit",
      "Betreuung von Influencer-Kampagnen inkl. Briefingerstellung und KPI-Analysen für JustFit und PAEDIPROTECT",
      "Projektmanagement inkl. Pflege der Boards sowie Überwachung von Prozessen und Deadlines",
      "Gestaltung von Digitalmaterialien wie Social-Media-Grafiken, Thumbnails und Youtube-Bannern",
    ],
  },
  {
    zeitraum: "10.2018 – 10.2019",
    rolle: "Social Media Managerin & Grafik-Designerin",
    art: "Werkstudium",
    firma: "KUHBAR Stammhaus GmbH",
    ort: "Dortmund",
    punkte: [
      "Kreation von Printmedien wie Flyern, Postkarten oder Postern",
      "Eigenständige Produkt-Fotografie & Bildbearbeitung sowie Videodreh und -schnitt für den Instagram-Account",
      "Agentursteuerung und gemeinsame Content-Erstellung",
      "Umsetzung einer Influencer-Kampagne zur Bekanntmachung der KUHBAR-App",
    ],
  },
];

/* Ausbildung */
export const ausbildung: Bildungsweg[] = [
  {
    abschluss: "Master of Engineering",
    fach: "Digitale Technologien",
    ort: "Fachhochschule Südwestfalen, Soest",
  },
  {
    abschluss: "Bachelor of Arts",
    fach: "Design- & Projektmanagement",
    ort: "Fachhochschule Südwestfalen, Soest",
  },
];

/* Kenntnisse & Fähigkeiten */
export const faehigkeiten = {
  professionell: [
    "UI Design (Mobile & Web)", "UX Design", "Corporate Design", "Content Management",
    "Online Marketing", "Social Media", "Grafikdesign", "Visual Identity",
    "Email-Marketing", "Projektmanagement", "Branding", "Brand Management",
    "Art Direction", "Claude Code", "ChatGPT", "Gemini/Nano Banana",
  ],
  technisch: [
    "Adobe Creative Cloud (Illustrator, InDesign, Photoshop)", "Figma", "Framer", "Canva",
    "Hubspot", "Jira", "Wordpress", "Webflow", "Microsoft 365", "Brevo",
  ],
  sprachen: [
    "Deutsch (Muttersprache)", "Englisch (B2)", "Italienisch (Grundkenntnisse)",
  ],
};

/* Interessen */
export const interessen = {
  kreativ: "Malen, Nähen, Tufting, Töpfern, Interior Design & Design-Klassiker",
  sportlich: "Cycling, Ski, Laufen (Berlin-Marathon 2026)",
};

/* Pfad zum herunterladbaren PDF (aus Canva exportiert) */
export const pdfPfad = "/dokumente/lebenslauf-annasthasia-reichert.pdf";
