// „Gummi"-Renderer für das Masthead-Wort PORTFOLIO (WebGL).
//
// Warum WebGL? Die Buchstaben sollen sich wie weiches Material anfühlen:
// beim Klicken-und-Halten klebt die Schrift am Cursor und zieht sich wie
// Kaugummi mit — auch über die eigene Kontur hinaus. So eine freie Verformung
// geht nur, wenn wir die Grafiken selbst zeichnen statt fertige <img>-Ebenen
// zu verschieben.
//
// Es gibt ZWEI Leinwände, damit die Ebenen-Reihenfolge mit dem Porträt erhalten
// bleibt: „hinten" zeichnet das gefüllte Wort (liegt hinter dem Porträt),
// „vorne" zeichnet Kontur + Folien-Reveal (liegt vor dem Porträt). Beide nutzen
// exakt dasselbe Verformungsfeld und bleiben dadurch deckungsgleich.
//
// Dieses Modul zeichnet NUR. Eingaben, Physik (Feder, Zug) und Timing wohnen in
// interaktionen.js (Block 6) und kommen pro Bild über zeichne(zustand) herein.
// starteWortGummi() liefert null, wenn WebGL nicht verfügbar ist —
// interaktionen.js nutzt dann den bisherigen DOM-Weg (SVG-Maske) weiter.

// Ein Rechteck über die ganze Leinwand — die Verformung passiert im Fragment-Shader.
const ECKPUNKTE = new Float32Array([-1, -1, 1, -1, -1, 1, 1, 1]);

const VERTEX = `
attribute vec2 aPos;
varying vec2 vUv;
void main() {
  vUv = vec2(aPos.x * 0.5 + 0.5, 0.5 - aPos.y * 0.5); /* (0,0) = oben links */
  gl_Position = vec4(aPos, 0.0, 1.0);
}`;

// Gemeinsamer Shader-Kopf: Rauschen + das Verformungsfeld.
// Alle Koordinaten sind CSS-Pixel, Ursprung oben links auf der Leinwand.
const BASIS = `
#ifdef GL_FRAGMENT_PRECISION_HIGH
precision highp float;
#else
precision mediump float;
#endif
varying vec2 vUv;
uniform vec2  uFlaeche;   /* Leinwandgröße (px) */
uniform vec4  uWort;      /* Wort-Rechteck: x, y, Breite, Höhe (px) */
uniform float uZeit;      /* Sekunden */
uniform vec2  uMaus;      /* Cursor (px) */
uniform float uMagnet;    /* 0..1 — sanftes Anschmiegen beim Hover */
uniform float uMagnetR;
uniform vec2  uGriff;     /* Zentrum der Griff-Verformung (px) */
uniform vec2  uZug;       /* aktuelle Auslenkung beim Ziehen (px) */
uniform float uDruck;     /* kurzes Einquetschen beim Anfassen/Loslassen */
uniform float uGriffR;    /* Reichweite des Griffs (px) */
uniform float uWabern;    /* ständiges leichtes Wabern (px) */
uniform float uSchwapp;   /* Scroll-Schwung (px): Nachschwingen beim Scrollen */

float hasch(vec2 p) { return fract(sin(dot(p, vec2(127.1, 311.7))) * 43758.5453); }

/* weiches Wert-Rauschen, Ergebnis -1..1 */
float rauschen(vec2 p) {
  vec2 i = floor(p), f = fract(p);
  f = f * f * (3.0 - 2.0 * f);
  return mix(mix(hasch(i),                  hasch(i + vec2(1.0, 0.0)), f.x),
             mix(hasch(i + vec2(0.0, 1.0)), hasch(i + vec2(1.0, 1.0)), f.x), f.y) * 2.0 - 1.0;
}

/* Wie weit die „Materie" am Punkt p gerade verschoben ist (px).
   Gezeichnet wird rückwärts: Farbe(p) = Bild(p - verformung(p)). */
vec2 verformung(vec2 p) {
  vec2 v = vec2(0.0);

  /* 1) Kleben & Ziehen beim Gedrückthalten — Materie nahe am Griff folgt dem
        Zugvektor fast ganz, weiter entfernte immer weniger (weicher Abfall). */
  vec2 zg = p - uGriff;
  float wg = exp(-dot(zg, zg) / (uGriffR * uGriffR));
  v += uZug * wg;

  /* 2) Anfass-Quetscher: beim Drücken zieht sich die Materie kurz zum Griff
        zusammen (uDruck > 0), beim Loslassen ploppt sie kurz auf (uDruck < 0). */
  v += -zg * uDruck * wg;

  /* 3) Magnet: die Buchstaben schmiegen sich schon beim Hover leicht zum Cursor. */
  vec2 zm = p - uMaus;
  float wm = exp(-dot(zm, zm) / (uMagnetR * uMagnetR));
  v += -zm * 0.10 * uMagnet * wm;

  /* 4) Grundwabern: langsames, organisches Atmen, damit nichts starr wirkt. */
  v += uWabern * vec2(rauschen(p * 0.006 + vec2(uZeit * 0.22, 0.0)),
                      rauschen(p * 0.006 + vec2(37.3, uZeit * 0.19)));

  /* 5) Scroll-Schwung (mobil): das Wort schwingt dem Scrollen wie Wackelpudding
        nach — ungleich stark über die Breite, damit es wabert statt starr zu
        rutschen. uSchwapp federt in interaktionen.js zurück auf 0. */
  v.y += uSchwapp * (0.60 + 0.40 * rauschen(vec2(p.x * 0.009 + 3.7, uZeit * 0.9)));
  v.x += uSchwapp * 0.22 * rauschen(vec2(p.y * 0.012 + 11.3, uZeit * 0.7));
  return v;
}

/* Position im Wortbild (0..1) für den rückwärts verformten Punkt */
vec2 wortUV(vec2 q) { return (q - uWort.xy) / uWort.zw; }
`;

// Hintere Leinwand: nur das gefüllte Wort, verformt.
const FRAG_HINTEN = BASIS + `
uniform sampler2D uBild;
void main() {
  vec2 p = vUv * uFlaeche;
  vec2 w = wortUV(p - verformung(p));
  if (w.x < 0.0 || w.x > 1.0 || w.y < 0.0 || w.y > 1.0) { gl_FragColor = vec4(0.0); return; }
  gl_FragColor = texture2D(uBild, w);
}`;

// Vordere Leinwand: Kontur überall; im flüssigen Blob um den Cursor wird sie
// durch die Folien-Materialien ersetzt (wie vorher SVG-Maske + Ausstanzen).
const FRAG_VORNE = BASIS + `
uniform sampler2D uKontur;
uniform sampler2D uMat0;
uniform sampler2D uMat1;
uniform sampler2D uMat2;
uniform sampler2D uMat3;
uniform vec4  uMatOp;   /* Deckkraft je Material (Überblendung nach Verweildauer) */
uniform vec3  uBlob;    /* x, y, Radius des Reveal-Blobs (px) */
uniform float uReveal;  /* 0..1 — Reveal ein-/ausblenden */
void main() {
  vec2 p = vUv * uFlaeche;
  vec2 q = p - verformung(p);
  vec2 w = wortUV(q);
  if (w.x < 0.0 || w.x > 1.0 || w.y < 0.0 || w.y > 1.0) { gl_FragColor = vec4(0.0); return; }

  vec4 kontur = texture2D(uKontur, w);
  vec4 folie = uMatOp.x * texture2D(uMat0, w)
             + uMatOp.y * texture2D(uMat1, w)
             + uMatOp.z * texture2D(uMat2, w)
             + uMatOp.w * texture2D(uMat3, w);

  /* flüssiger Blob-Rand: Radius wird von zwei Rausch-Wellen umspült */
  float ab = length(q - uBlob.xy);
  float welle = 1.0 + 0.30 * rauschen(q * 0.012 + vec2(uZeit * 0.5, 0.0))
                    + 0.14 * rauschen(q * 0.045 + vec2(0.0, -uZeit * 0.7));
  float r = uBlob.z * welle;
  float maske = (1.0 - smoothstep(r - 14.0, r + 14.0, ab)) * uReveal;

  gl_FragColor = mix(kontur, folie, maske);
}`;

function schattierer(gl, art, quelle) {
  const s = gl.createShader(art);
  gl.shaderSource(s, quelle);
  gl.compileShader(s);
  if (!gl.getShaderParameter(s, gl.COMPILE_STATUS)) {
    throw new Error(gl.getShaderInfoLog(s) || "Shader-Fehler");
  }
  return s;
}

// Baut eine Zeichen-Seite (Leinwand + Programm) und sammelt die Uniform-Positionen ein.
function baueSeite(canvas, fragQuelle) {
  const gl = canvas.getContext("webgl", {
    alpha: true, antialias: false, depth: false, stencil: false, premultipliedAlpha: true,
  });
  if (!gl) return null;

  const prog = gl.createProgram();
  gl.attachShader(prog, schattierer(gl, gl.VERTEX_SHADER, VERTEX));
  gl.attachShader(prog, schattierer(gl, gl.FRAGMENT_SHADER, fragQuelle));
  gl.bindAttribLocation(prog, 0, "aPos");
  gl.linkProgram(prog);
  if (!gl.getProgramParameter(prog, gl.LINK_STATUS)) {
    throw new Error(gl.getProgramInfoLog(prog) || "Programm-Fehler");
  }
  gl.useProgram(prog);

  const puffer = gl.createBuffer();
  gl.bindBuffer(gl.ARRAY_BUFFER, puffer);
  gl.bufferData(gl.ARRAY_BUFFER, ECKPUNKTE, gl.STATIC_DRAW);
  gl.enableVertexAttribArray(0);
  gl.vertexAttribPointer(0, 2, gl.FLOAT, false, 0, 0);
  gl.disable(gl.DEPTH_TEST);
  gl.disable(gl.BLEND);
  gl.clearColor(0, 0, 0, 0);

  const u = {};
  const anzahl = gl.getProgramParameter(prog, gl.ACTIVE_UNIFORMS);
  for (let i = 0; i < anzahl; i++) {
    const info = gl.getActiveUniform(prog, i);
    u[info.name] = gl.getUniformLocation(prog, info.name);
  }
  // Setter, die fehlende (vom Compiler wegoptimierte) Uniforms still überspringen
  const f1 = (n, x) => { if (u[n]) gl.uniform1f(u[n], x); };
  const f2 = (n, x, y) => { if (u[n]) gl.uniform2f(u[n], x, y); };
  const f3 = (n, x, y, z) => { if (u[n]) gl.uniform3f(u[n], x, y, z); };
  const f4 = (n, x, y, z, w) => { if (u[n]) gl.uniform4f(u[n], x, y, z, w); };
  const i1 = (n, x) => { if (u[n]) gl.uniform1i(u[n], x); };

  return { gl, canvas, f1, f2, f3, f4, i1 };
}

// Leere Textur auf einer festen Einheit anlegen (1×1 transparent als Platzhalter).
function neueTextur(gl, einheit) {
  const t = gl.createTexture();
  gl.activeTexture(gl.TEXTURE0 + einheit);
  gl.bindTexture(gl.TEXTURE_2D, t);
  gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_WRAP_S, gl.CLAMP_TO_EDGE);
  gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_WRAP_T, gl.CLAMP_TO_EDGE);
  gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MIN_FILTER, gl.LINEAR);
  gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MAG_FILTER, gl.LINEAR);
  gl.texImage2D(gl.TEXTURE_2D, 0, gl.RGBA, 1, 1, 0, gl.RGBA, gl.UNSIGNED_BYTE,
    new Uint8Array([0, 0, 0, 0]));
  return { t, einheit, ok: false };
}

// Bild in die Textur laden — sofort, wenn es schon da ist, sonst sobald es lädt.
// (Die Material-Grafiken bekommen ihr src erst später von interaktionen.js.)
function fuelleTextur(gl, tex, img) {
  const rein = () => {
    try {
      gl.activeTexture(gl.TEXTURE0 + tex.einheit);
      gl.bindTexture(gl.TEXTURE_2D, tex.t);
      gl.pixelStorei(gl.UNPACK_PREMULTIPLY_ALPHA_WEBGL, true);
      gl.texImage2D(gl.TEXTURE_2D, 0, gl.RGBA, gl.RGBA, gl.UNSIGNED_BYTE, img);
      tex.ok = true;
    } catch (_) { /* z. B. Kontext gerade verloren → Fallback übernimmt */ }
  };
  if (img.complete && img.naturalWidth > 0) rein();
  else img.addEventListener("load", rein, { once: true });
}

/**
 * Startet den Gummi-Renderer.
 * @param {{solid: HTMLImageElement, kontur: HTMLImageElement,
 *          mats: HTMLImageElement[], hinten: HTMLCanvasElement,
 *          vorne: HTMLCanvasElement}} teile
 * @returns Renderer-Objekt oder null (kein WebGL → alter DOM-Weg bleibt aktiv)
 */
export function starteWortGummi(teile) {
  let seiteH, seiteV;
  try {
    seiteH = baueSeite(teile.hinten, FRAG_HINTEN);
    seiteV = baueSeite(teile.vorne, FRAG_VORNE);
  } catch (_) {
    return null;
  }
  if (!seiteH || !seiteV) return null;

  // Texturen: hinten nur das Solid, vorne Kontur + vier Materialien
  const texSolid = neueTextur(seiteH.gl, 0);
  fuelleTextur(seiteH.gl, texSolid, teile.solid);
  seiteH.i1("uBild", 0);

  const texKontur = neueTextur(seiteV.gl, 0);
  fuelleTextur(seiteV.gl, texKontur, teile.kontur);
  seiteV.i1("uKontur", 0);
  const texMats = teile.mats.map((img, i) => {
    const t = neueTextur(seiteV.gl, i + 1);
    fuelleTextur(seiteV.gl, t, img);
    seiteV.i1("uMat" + i, i + 1);
    return t;
  });

  // Bei Kontextverlust (selten, z. B. GPU-Reset) sagt uns der Browser Bescheid —
  // interaktionen.js schaltet dann zurück auf die DOM-Ebenen.
  let verlustMelden = null;
  const verloren = (e) => {
    e.preventDefault();
    if (verlustMelden) { verlustMelden(); verlustMelden = null; }
  };
  teile.hinten.addEventListener("webglcontextlost", verloren);
  teile.vorne.addEventListener("webglcontextlost", verloren);

  let cssB = 0, cssH = 0; // Leinwandgröße in CSS-px (für die Shader-Koordinaten)

  const setzeGemeinsam = (s, z) => {
    s.f2("uFlaeche", cssB, cssH);
    s.f4("uWort", z.wort[0], z.wort[1], z.wort[2], z.wort[3]);
    s.f1("uZeit", z.zeit);
    s.f2("uMaus", z.maus[0], z.maus[1]);
    s.f1("uMagnet", z.magnet);
    s.f1("uMagnetR", z.magnetR);
    s.f2("uGriff", z.griff[0], z.griff[1]);
    s.f2("uZug", z.zug[0], z.zug[1]);
    s.f1("uDruck", z.druck);
    s.f1("uGriffR", z.griffR);
    s.f1("uWabern", z.wabern);
    s.f1("uSchwapp", z.schwapp);
  };

  return {
    /** true, sobald Solid + Kontur als Texturen bereitstehen (dann umschalten). */
    bereit: () => texSolid.ok && texKontur.ok,

    /** Callback für den (seltenen) Verlust des WebGL-Kontexts. */
    beiVerlust: (cb) => { verlustMelden = cb; },

    /** Leinwände an die aktuelle Größe anpassen (CSS-px + Geräte-Pixel-Faktor). */
    groesse: (breite, hoehe, dpr) => {
      cssB = breite; cssH = hoehe;
      for (const s of [seiteH, seiteV]) {
        s.canvas.width = Math.max(1, Math.round(breite * dpr));
        s.canvas.height = Math.max(1, Math.round(hoehe * dpr));
        s.gl.viewport(0, 0, s.canvas.width, s.canvas.height);
      }
    },

    /** Ein Bild zeichnen. zustand kommt komplett aus interaktionen.js. */
    zeichne: (z) => {
      if (seiteH.gl.isContextLost() || seiteV.gl.isContextLost()) return;

      // hinten: gefülltes Wort
      setzeGemeinsam(seiteH, z);
      seiteH.gl.clear(seiteH.gl.COLOR_BUFFER_BIT);
      seiteH.gl.drawArrays(seiteH.gl.TRIANGLE_STRIP, 0, 4);

      // vorne: Kontur + Reveal. Materialien, die noch nicht geladen sind, zählen
      // nicht mit — sonst würde der Blob die Kontur ausstanzen und Leere zeigen.
      const eff = z.matOp.map((o, i) => (texMats[i].ok ? o : 0));
      const soll = z.matOp[0] + z.matOp[1] + z.matOp[2] + z.matOp[3];
      const ist = eff[0] + eff[1] + eff[2] + eff[3];
      const reveal = z.reveal * (soll > 0.001 ? Math.min(1, ist / soll) : 0);

      setzeGemeinsam(seiteV, z);
      seiteV.f4("uMatOp", eff[0], eff[1], eff[2], eff[3]);
      seiteV.f3("uBlob", z.blob[0], z.blob[1], z.blob[2]);
      seiteV.f1("uReveal", reveal);
      seiteV.gl.clear(seiteV.gl.COLOR_BUFFER_BIT);
      seiteV.gl.drawArrays(seiteV.gl.TRIANGLE_STRIP, 0, 4);
    },
  };
}
