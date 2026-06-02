import { HERO_LOCATIONS } from "./data.js";
import { initCarousel } from "./carousel.js";

export function initHero(parallax) {
  const section = document.querySelector(".hero");
  if (!section) return;

  const bgRoot = section.querySelector(".hero__bg");
  const track = section.querySelector(".hero__cards");
  if (!bgRoot || !track) return;

  HERO_LOCATIONS.forEach((loc, i) => {
    const layer = document.createElement("div");
    layer.className = "hero__bg-layer";
    layer.dataset.parallax = "bg";
    layer.style.backgroundImage = `url("${loc.bg}")`;
    layer.dataset.index = String(i);
    layer.style.opacity = "0";
    bgRoot.appendChild(layer);

    const card = document.createElement("a");
    card.className = "location-card";
    card.href = loc.href;
    card.dataset.index = String(i);
    card.innerHTML = `
      <div class="location-card__label">
        <span>${loc.label}</span>
        <img src="assets/chevron.svg" alt="" width="12" height="12" draggable="false" />
      </div>
    `;
    track.appendChild(card);
  });

  const layers = [...bgRoot.querySelectorAll(".hero__bg-layer")];
  layers.forEach((layer) => parallax?.register(layer));
  const cards = [...track.querySelectorAll(".location-card")];

  function syncVisuals(activeIndex) {
    const center = track.scrollLeft + track.clientWidth / 2;
    const influenceRadius = track.clientWidth * 0.55;
    let strongest = activeIndex;
    let strongestVal = 0;

    cards.forEach((card, i) => {
      const cardCenter = card.offsetLeft + card.offsetWidth / 2;
      const dist = Math.abs(center - cardCenter);
      const influence = Math.max(0, 1 - dist / influenceRadius);
      layers[i].style.opacity = String(influence);
      layers[i].classList.toggle("is-active", influence > 0.08);

      if (influence > strongestVal) {
        strongestVal = influence;
        strongest = i;
      }
    });

    cards.forEach((card, i) => card.classList.toggle("is-center", i === strongest));
  }

  const defaultIndex = Math.min(1, cards.length - 1);

  const carousel = initCarousel(track, {
    items: cards,
    snap: "center",
    loop: true,
    autoplayMs: 12000,
    onActive: (index) => syncVisuals(index),
  });

  if (!carousel) return;

  carousel.setActive(defaultIndex, { smooth: false });

  track.addEventListener(
    "scroll",
    () => {
      syncVisuals(carousel.getActiveIndex());
    },
    { passive: true }
  );
}
