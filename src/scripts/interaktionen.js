// Alle Bewegungen & Interaktionen der Startseite.
// Läuft im Browser, nachdem die Seite geladen ist.

const reduziert = window.matchMedia("(prefers-reduced-motion: reduce)").matches;

/* 1) Erscheinen beim Scrollen */
const beobachter = new IntersectionObserver((es) => {
  es.forEach((e) => {
    if (e.isIntersecting) {
      e.target.classList.add("in-view");
      beobachter.unobserve(e.target);
    }
  });
}, { threshold: 0.15 });
document.querySelectorAll(".auftritt").forEach((el) => beobachter.observe(el));

/* 2) Wegscroll des Hero + 3) Parallax */
const hero = document.getElementById("hero");
const parallaxEls = document.querySelectorAll("[data-parallax]");
if (!reduziert && hero) {
  let ticking = false;
  window.addEventListener("scroll", () => {
    if (ticking) return;
    ticking = true;
    requestAnimationFrame(() => {
      const y = window.scrollY, vh = window.innerHeight;
      const p = Math.min(y / vh, 1);
      hero.style.transform = `translateY(${-y * 0.22}px) scale(${1 - p * 0.05})`;
      hero.style.opacity = `${1 - p * 0.85}`;
      parallaxEls.forEach((el) => {
        const f = parseFloat(el.dataset.parallax);
        const mitte = el.getBoundingClientRect().top + y - vh / 2;
        el.style.transform =
          `translateY(${(y - mitte) * f}px)` +
          (el.classList.contains("drift") ? " translateX(-50%)" : "");
      });
      ticking = false;
    });
  }, { passive: true });
}

/* 4) Hover-Bild-Reveal, folgt dem Cursor */
const reveal = document.getElementById("reveal");
const platte = document.getElementById("reveal-platte");
let zielX = 0, zielY = 0, istX = 0, istY = 0, aktiv = false;
if (!reduziert && reveal && platte && window.matchMedia("(hover: hover)").matches) {
  document.querySelectorAll(".index-zeile a").forEach((a) => {
    a.addEventListener("mouseenter", () => {
      aktiv = true;
      reveal.style.backgroundImage = "url('" + a.dataset.bild + "')";
      platte.textContent = a.querySelector(".titel").textContent;
      reveal.classList.add("sichtbar");
    });
    a.addEventListener("mouseleave", () => {
      aktiv = false;
      reveal.classList.remove("sichtbar");
    });
  });
  window.addEventListener("mousemove", (e) => {
    zielX = e.clientX; zielY = e.clientY;
  }, { passive: true });
  (function animiere() {
    istX += (zielX - istX) * 0.12;
    istY += (zielY - istY) * 0.12;
    const rot = Math.max(-7, Math.min(7, (zielX - istX) * 0.14));
    reveal.style.transform =
      `translate(${istX}px, ${istY}px) translate(-50%,-50%) scale(${aktiv ? 1 : 0.9}) rotate(${rot}deg)`;
    requestAnimationFrame(animiere);
  })();
}

/* 4b) Platzhalter-Links (Projekte, Lebenslauf) noch ohne Zielseite:
       nicht nach oben springen lassen, bis die echten Seiten gebaut sind */
document.querySelectorAll('a[data-soon], .nav-links a[href="#"]').forEach((a) => {
  a.addEventListener("click", (e) => e.preventDefault());
});

/* 4c) Cursor-Label über dem Masthead ("annasthasia reichert" am Cursor) */
const masthead = document.querySelector(".masthead");
const cursorLabel = document.getElementById("cursor-label");
if (masthead && cursorLabel && !reduziert && window.matchMedia("(hover: hover)").matches) {
  const setzePos = (e) => {
    cursorLabel.style.left = e.clientX + "px";
    cursorLabel.style.top = e.clientY + "px";
  };
  masthead.addEventListener("mouseenter", (e) => {
    setzePos(e);
    cursorLabel.classList.add("sichtbar");
  });
  masthead.addEventListener("mousemove", setzePos, { passive: true });
  masthead.addEventListener("mouseleave", () => cursorLabel.classList.remove("sichtbar"));
}

/* 5) Sprachumschalter DE/EN */
const langButtons = document.querySelectorAll(".sprache button");
function setzeSprache(lang) {
  document.documentElement.lang = lang;
  document.querySelectorAll("[data-" + lang + "]").forEach((el) => {
    el.innerHTML = el.getAttribute("data-" + lang);
  });
  langButtons.forEach((b) => b.classList.toggle("aktiv", b.dataset.lang === lang));
}
langButtons.forEach((b) => b.addEventListener("click", () => setzeSprache(b.dataset.lang)));
