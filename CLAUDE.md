# CLAUDE.md

Kurzinfos für die Arbeit an diesem Projekt, die sich **nicht** aus dem Code ergeben.
Alle Design-Entscheidungen stehen in `docs/domain-model.md`.

## Sprache & Ton
- Projekt und Kommunikation: **Deutsch**.
- Nutzerin: **Annasthasia Reichert**, Grafik- & UI-Designerin (Köln). Visuell stark, technisch Einsteigerin
  — technische Dinge einsteigerfreundlich erklären.
- Gestaltung **mutig und plakativ** statt brav, an ihrem eigenen Canva-Material orientiert — nicht neu erfinden.

## Technik & Umsetzung
- Die Website wird **direkt in Astro** sauber implementiert (echte Komponenten/Seiten), **nicht** als eine
  einzelne HTML-Datei.
- `entwurf/startseite.html` dient nur noch als **visuelle Vorlage**, die nach Astro übertragen wird.

## Server starten
- Immer denselben Port **4321** verwenden (Astro-Standard: `npm run dev`).
- Ist der Port von einem anderen Chat/Prozess belegt: **den Prozess auf dem Port beenden und Server neu
  starten** — `lsof -ti:4321 | xargs kill -9`, dann Server erneut starten. Nicht auf einen anderen Port ausweichen.

## Git-Workflow
- **Kein Git-Worktree, keine Feature-Branches, keine Pull-Requests.** Es wird immer nur in einem Chat
  gearbeitet, nichts parallel.
- Sollen Änderungen gesichert werden: **direkt auf `main` committen und immer pushen.**

## Design (Kurzfassung — Details in `docs/domain-model.md`)
- Namens-Lockup: Vorname „annasthasia" = Times New Roman italic · Nachname „reichert." = Archivo Black.
- Farben: Papier `#FCFBF9`, Sand `#D9D7D1`, Tinte `#1A1712`, Ton `#8A857B`. Kein bunter Akzent.
