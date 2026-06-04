/** Final CTA background video — autoplay when visible. */
export function initCtaFinal() {
  const video = document.querySelector(".cta-final__bg video");
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
    { threshold: 0.2 }
  );

  observer.observe(video);

  const rect = video.getBoundingClientRect();
  if (rect.bottom > 0 && rect.top < window.innerHeight) {
    play();
  }
}
