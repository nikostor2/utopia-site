const ECOSYSTEM_GRADIENT =
  "linear-gradient(180deg, rgba(51, 47, 46, 0) 86.13%, #332f2e 108.21%)";

const loaded = new Map();

function cacheKey(url) {
  return url;
}

/** Decode image off the critical path, then apply as CSS background. */
export function loadBackgroundImage(el, url, gradient = ECOSYSTEM_GRADIENT) {
  if (!el || !url) return Promise.resolve();

  const key = cacheKey(url);
  if (loaded.get(key) === "done" && el.dataset.loadedUrl === url) {
    return Promise.resolve();
  }

  if (loaded.get(key) === "pending") {
    return loaded.get(`${key}:promise`);
  }

  const promise = new Promise((resolve) => {
    const img = new Image();
    img.decoding = "async";

    img.onload = () => {
      el.style.backgroundImage = gradient ? `${gradient}, url("${url}")` : `url("${url}")`;
      el.dataset.loadedUrl = url;
      el.classList.remove("is-loading");
      el.classList.add("is-ready");
      loaded.set(key, "done");
      resolve();
    };

    img.onerror = () => {
      el.classList.remove("is-loading");
      loaded.set(key, "error");
      resolve();
    };

    el.classList.add("is-loading");
    img.src = url;
  });

  loaded.set(key, "pending");
  loaded.set(`${key}:promise`, promise);
  return promise;
}

/** Warm cache without touching DOM (hero neighbors, next location). */
export function prefetchImage(url) {
  if (!url) return;
  const key = cacheKey(url);
  if (loaded.has(key)) return;
  loaded.set(key, "prefetch");
  const img = new Image();
  img.decoding = "async";
  img.onload = () => loaded.set(key, "done");
  img.onerror = () => loaded.delete(key);
  img.src = url;
}

export function prefetchImages(urls) {
  urls.forEach(prefetchImage);
}

export { ECOSYSTEM_GRADIENT };
