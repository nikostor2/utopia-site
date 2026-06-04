function attachLazyVideo(video) {
  video.muted = true;
  video.defaultMuted = true;
  video.setAttribute("playsinline", "");
  video.setAttribute("webkit-playsinline", "true");

  const src = video.dataset.src;
  if (!src) return;

  let loaded = false;

  function ensureSrc() {
    if (loaded) return;
    loaded = true;
    video.src = src;
    video.load();
  }

  function play() {
    ensureSrc();
    const p = video.play();
    if (p?.catch) p.catch(() => {});
  }

  function pause() {
    if (!video.paused) video.pause();
  }

  const observer = new IntersectionObserver(
    (entries) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting) play();
        else pause();
      });
    },
    { threshold: 0.2, rootMargin: "120px" }
  );

  observer.observe(video);
}

/** Autoplay Beyond card videos when visible (Safari-friendly). */
export function initBeyond() {
  document.querySelectorAll(".beyond__video").forEach(attachLazyVideo);
}
