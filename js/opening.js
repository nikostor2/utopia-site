import Swiper from "https://cdn.jsdelivr.net/npm/swiper@11/swiper-bundle.min.mjs";
import { OPENING_SLIDES } from "./data.js";

const OPENING_SWIPER = {
  slidesPerView: 1,
  slidesPerGroup: 1,
  loop: true,
  loopAdditionalSlides: 2,
  speed: 400,
  spaceBetween: 0,
};

function appendSlideVideo(slideEl, slide) {
  const video = document.createElement("video");
  video.className = "opening__bg-media";
  video.src = slide.video;
  video.muted = true;
  video.defaultMuted = true;
  video.loop = true;
  video.autoplay = false;
  video.playsInline = true;
  video.setAttribute("playsinline", "");
  video.setAttribute("webkit-playsinline", "true");
  video.preload = "auto";
  video.style.width = `${slide.mediaWidth}px`;
  video.style.left = slide.mediaLeft;
  slideEl.appendChild(video);
  return video;
}

function playActiveVideo(section) {
  section.querySelectorAll("video.opening__bg-media").forEach((node) => {
    node.pause();
  });

  const slide = section.querySelector(".opening__slider .swiper-slide-active");
  const video = slide?.querySelector("video.opening__bg-media");
  if (!video) return;

  video.muted = true;
  video.defaultMuted = true;

  const tryPlay = () => {
    const promise = video.play();
    if (promise?.catch) {
      promise.catch(() => {});
    }
  };

  if (video.readyState >= HTMLMediaElement.HAVE_CURRENT_DATA) {
    tryPlay();
    return;
  }

  video.addEventListener("loadeddata", tryPlay, { once: true });
  video.load();
}

function syncPill(pillLabel, index) {
  const label = OPENING_SLIDES[index]?.label;
  if (pillLabel && label) pillLabel.textContent = label;
}

export function initOpening() {
  const section = document.querySelector(".opening");
  if (!section) return;

  const swiperEl = section.querySelector(".opening__slider");
  const wrapper = swiperEl?.querySelector(".swiper-wrapper");
  const prevBtn = section.querySelector(".opening__nav-btn--prev");
  const nextBtn = section.querySelector(".opening__nav-btn--next");
  const pillLabel = section.querySelector(".opening__location-pill .ecosystem__location-pill__label");
  if (!swiperEl || !wrapper) return;

  const reducedMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
  let unlockedPlayback = false;

  OPENING_SLIDES.forEach((slide, i) => {
    const swiperSlide = document.createElement("div");
    swiperSlide.className = "swiper-slide";

    const inner = document.createElement("div");
    inner.className = `opening__bg-slide opening__bg-slide--${i}`;
    if (slide.video) appendSlideVideo(inner, slide);
    swiperSlide.appendChild(inner);
    wrapper.appendChild(swiperSlide);
  });

  const openingSwiper = new Swiper(swiperEl, {
    slidesPerView: OPENING_SWIPER.slidesPerView,
    slidesPerGroup: OPENING_SWIPER.slidesPerGroup,
    loop: OPENING_SWIPER.loop,
    loopAdditionalSlides: OPENING_SWIPER.loopAdditionalSlides,
    speed: reducedMotion ? 0 : OPENING_SWIPER.speed,
    spaceBetween: OPENING_SWIPER.spaceBetween,
    grabCursor: true,
    threshold: 10,
    touchAngle: 35,
    longSwipesRatio: 0.22,
    shortSwipes: true,
    preventInteractionOnTransition: true,
    touchStartPreventDefault: false,
    watchSlidesProgress: true,
    navigation: {
      prevEl: prevBtn,
      nextEl: nextBtn,
    },
    on: {
      init(swiper) {
        syncPill(pillLabel, swiper.realIndex);
        playActiveVideo(section);
      },
      slideChangeTransitionEnd(swiper) {
        syncPill(pillLabel, swiper.realIndex);
        playActiveVideo(section);
      },
    },
  });

  const unlock = () => {
    if (unlockedPlayback) return;
    unlockedPlayback = true;
    playActiveVideo(section);
  };

  section.querySelector(".opening__media")?.addEventListener("touchstart", unlock, {
    passive: true,
    once: true,
  });
  section.querySelector(".opening__media")?.addEventListener("click", unlock, { once: true });

  return openingSwiper;
}
