#!/usr/bin/env node
/**
 * After `next build`, list HTML/assets under out/ for service-worker precache.
 */
const fs = require("fs");
const path = require("path");

const outDir = path.join(process.cwd(), "out");
const isGh = process.env.GITHUB_PAGES === "true";
const repo =
  process.env.GITHUB_REPOSITORY?.split("/")[1] ?? "ai-hand-cal";
const basePath = isGh ? `/${repo}` : "";

function walk(dir, files = []) {
  if (!fs.existsSync(dir)) return files;
  for (const name of fs.readdirSync(dir)) {
    const full = path.join(dir, name);
    const st = fs.statSync(full);
    if (st.isDirectory()) walk(full, files);
    else files.push(full);
  }
  return files;
}

const all = walk(outDir);
const urls = [];

for (const file of all) {
  const rel = path.relative(outDir, file).split(path.sep).join("/");
  if (rel === "sw.js" || rel === "precache.json") continue;
  if (
    !rel.endsWith(".html") &&
    !rel.endsWith(".js") &&
    !rel.endsWith(".css") &&
    !rel.endsWith(".woff2") &&
    !rel.endsWith(".woff") &&
    !rel.endsWith(".svg") &&
    !rel.endsWith(".png") &&
    !rel.endsWith(".webmanifest") &&
    !rel.endsWith(".ico") &&
    rel !== ".nojekyll"
  ) {
    continue;
  }
  if (rel === ".nojekyll") continue;

  let url = `${basePath}/${rel}`.replace(/\\/g, "/");
  // Prefer clean trailing-slash routes for HTML
  if (url.endsWith("/index.html")) {
    url = url.slice(0, -"index.html".length);
  } else if (url.endsWith(".html")) {
    url = url.slice(0, -".html".length) + "/";
  }
  urls.push(url);
}

// Dedupe
const unique = [...new Set(urls)].sort();
fs.writeFileSync(
  path.join(outDir, "precache.json"),
  JSON.stringify({ basePath, urls: unique }, null, 2),
);
console.log(`precache: ${unique.length} urls (basePath=${basePath || "/"})`);
