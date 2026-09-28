import assert from "node:assert/strict";
import { readFile, readdir, stat } from "node:fs/promises";
import path from "node:path";
import { fileURLToPath } from "node:url";

const output = fileURLToPath(new URL("../_site/", import.meta.url));
const origin = "https://site.invalid";
const errors = new Set();
let checked = 0;

async function* files(directory) {
  for (const entry of await readdir(directory, { withFileTypes: true })) {
    const file = path.join(directory, entry.name);
    if (entry.isDirectory()) yield* files(file);
    else yield file;
  }
}

async function checkReference(reference, source, checkAnchor = false) {
  if (!reference || /^(data:|mailto:|tel:|javascript:)/i.test(reference)) return;
  const relative = path.relative(output, source).split(path.sep).join("/");
  const url = new URL(reference.replaceAll("&amp;", "&"), `${origin}/${relative}`);
  if (url.origin !== origin) return;
  const pathname = decodeURIComponent(url.pathname);
  let target = path.join(output, pathname);
  try {
    if ((await stat(target)).isDirectory()) target = path.join(target, "index.html");
    await stat(target);
    checked++;
    if (checkAnchor && url.hash && target.endsWith(".html")) {
      const html = await readFile(target, "utf8");
      const id = decodeURIComponent(url.hash.slice(1));
      if (!html.includes(`id="${id}"`) && !html.includes(`id='${id}'`)) {
        errors.add(`${relative}: missing anchor ${reference}`);
      }
    }
  } catch {
    errors.add(`${relative}: missing file ${reference}`);
  }
}

for await (const file of files(output)) {
  if (!/\.(html|css)$/.test(file)) continue;
  const text = await readFile(file, "utf8");
  if (file.endsWith(".html")) {
    assert.match(text, /<title>[^<]+<\/title>/i, `Missing title: ${file}`);
    assert.doesNotMatch(text, /\{%|\{\{/, `Unrendered template: ${file}`);
    const html = text.replace(/<!--[\s\S]*?-->/g, "");
    for (const tag of html.matchAll(/<[a-z][^>]*>/gi)) {
      for (const attr of tag[0].matchAll(/\b(href|src|poster)\s*=\s*(["'])(.*?)\2/gi)) {
        await checkReference(attr[3], file, attr[1].toLowerCase() === "href");
      }
    }
  } else {
    const css = text.replace(/\/\*[\s\S]*?\*\//g, "");
    for (const match of css.matchAll(/url\(\s*["']?([^"')]+)["']?\s*\)/g)) {
      await checkReference(match[1].trim(), file);
    }
  }
}

// The homepage embeds these standalone pages. Empty embeds can otherwise build
// successfully, so check the content and section contract explicitly.
const homepage = await readFile(path.join(output, "index.html"), "utf8");
for (const id of ["about", "news", "publications", "supervision", "teaching", "service", "talks", "grants", "tools", "cv"]) {
  assert.match(homepage, new RegExp(`<section[^>]+id="${id}"`), `Missing homepage section: ${id}`);
}
for (const content of ["publication-card", "supervision-filter-root", "filterable-teaching-section", "service-card", "grant-entry", "/tools/running-records/"]) {
  assert.ok(homepage.includes(content), `Missing embedded content: ${content}`);
}
assert.doesNotMatch(homepage, /\/tools\/word-game\//, "Word Discovery Challenge should not appear on the homepage");

if (errors.size) {
  console.error(Array.from(errors).join("\n"));
  process.exitCode = 1;
} else {
  console.log(`Site checks passed: ${checked} local references and all homepage sections.`);
}
