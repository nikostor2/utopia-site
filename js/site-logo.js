/** Fixed logo — white emblem on hero; black wordmark on 56px glass bar after scroll. */
export function initSiteLogo() {
  const hero = document.querySelector(".hero");
  const logo = document.querySelector(".site-logo");
  if (!hero || !logo) return;

  const setCompact = (compact) => {
    logo.classList.toggle("is-compact", compact);
    document.body.classList.toggle("is-past-hero", compact);
  };

  const observer = new IntersectionObserver(
    ([entry]) => {
      setCompact(!entry.isIntersecting);
    },
    { threshold: 0, rootMargin: "0px 0px -55% 0px" }
  );

  observer.observe(hero);

  const sync = () => {
    const rect = hero.getBoundingClientRect();
    setCompact(rect.bottom <= window.innerHeight * 0.45);
  };

  sync();
  window.addEventListener("resize", sync, { passive: true });
}
