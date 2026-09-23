/* Hand Cal offline service worker */
const CACHE = "handcal-v2";

function basePath() {
  const p = self.location.pathname.replace(/\/sw\.js$/, "");
  return p === "/" ? "" : p;
}

async function cacheUrl(cache, url) {
  try {
    const res = await fetch(url, { cache: "reload" });
    if (res.ok) await cache.put(url, res);
  } catch {
    /* ignore individual failures */
  }
}

async function precache() {
  const base = basePath();
  const cache = await caches.open(CACHE);
  let urls = [`${base}/`, `${base}/track/`, `${base}/daily/`];

  try {
    const res = await fetch(`${base}/precache.json`, { cache: "no-store" });
    if (res.ok) {
      const data = await res.json();
      urls = data.urls || urls;
      urls.push(`${base}/precache.json`);
    }
  } catch {
    /* fall back to shell only */
  }

  urls.push(`${base}/manifest.webmanifest`);
  urls.push(`${base}/icon-192.png`);
  urls.push(`${base}/icon-512.png`);
  urls.push(`${base}/apple-touch-icon.png`);

  const unique = [...new Set(urls)];
  // Batch to avoid overwhelming the browser
  const chunk = 20;
  for (let i = 0; i < unique.length; i += chunk) {
    const slice = unique.slice(i, i + chunk);
    await Promise.all(slice.map((u) => cacheUrl(cache, u)));
  }
}

self.addEventListener("install", (event) => {
  event.waitUntil(
    precache()
      .then(() => self.skipWaiting())
      .catch(() => self.skipWaiting()),
  );
});

self.addEventListener("activate", (event) => {
  event.waitUntil(
    caches
      .keys()
      .then((keys) =>
        Promise.all(keys.filter((k) => k !== CACHE).map((k) => caches.delete(k))),
      )
      .then(() => self.clients.claim()),
  );
});

self.addEventListener("fetch", (event) => {
  const req = event.request;
  if (req.method !== "GET") return;

  const url = new URL(req.url);
  if (url.origin !== self.location.origin) return;

  if (req.mode === "navigate") {
    event.respondWith(
      (async () => {
        const cached =
          (await caches.match(req)) ||
          (await caches.match(req.url)) ||
          (await caches.match(
            req.url.endsWith("/") ? `${req.url}index.html` : `${req.url}/`,
          ));
        if (cached) return cached;
        try {
          return await fetch(req);
        } catch {
          const base = basePath();
          return (
            (await caches.match(`${base}/`)) ||
            new Response("오프라인입니다. 온라인일 때 앱을 한 번 열어 주세요.", {
              status: 503,
              headers: { "Content-Type": "text/plain; charset=utf-8" },
            })
          );
        }
      })(),
    );
    return;
  }

  event.respondWith(
    caches.match(req).then((cached) => {
      if (cached) return cached;
      return fetch(req)
        .then((res) => {
          if (res.ok) {
            const copy = res.clone();
            caches.open(CACHE).then((c) => c.put(req, copy));
          }
          return res;
        })
        .catch(() => cached);
    }),
  );
});
