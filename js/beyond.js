/** Autoplay yacht card video when visible (Safari-friendly). */
export function initBeyond() {
  const video = document.querySelector(".beyond__card--yacht .beyond__video");
  if (!video) return;

  video.muted = true;
  video.defaultMuted = true;
  video.setAttribute("playsinline", "");
  video.setAttribute("webkit-playsinline", "true");

  function play() {
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
    { threshold: 0.25, rootMargin: "0px" }
  );

  observer.observe(video);

  if (video.getBoundingClientRect().bottom > 0 && video.getBoundingClientRect().top < window.innerHeight) {
    play();
  }
}
