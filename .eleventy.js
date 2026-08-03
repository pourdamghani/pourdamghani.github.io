const fs = require("node:fs");
const path = require("node:path");
const markdownIt = require("markdown-it");
const yaml = require("js-yaml");

module.exports = function (eleventyConfig) {
  // Load YAML data files (Eleventy only supports JSON/JS by default)
  eleventyConfig.addDataExtension("yml", (contents) => yaml.load(contents));
  eleventyConfig.addDataExtension("yaml", (contents) => yaml.load(contents));

  // Static asset passthrough
  eleventyConfig.addPassthroughCopy("assets");
  eleventyConfig.addPassthroughCopy("images");
  eleventyConfig.addPassthroughCopy("CNAME");
  eleventyConfig.addPassthroughCopy("robots.txt");
  eleventyConfig.addPassthroughCopy("llms.txt");

  // Keep legacy /_pages/ asset URLs working.
  eleventyConfig.addPassthroughCopy("_pages/*.pdf");
  eleventyConfig.addPassthroughCopy("_pages/*.bib");
  eleventyConfig.addPassthroughCopy("_pages/*.txt");

  // Also publish those assets at the site root, e.g. /sand26ba.pdf.
  for (const file of fs.readdirSync("_pages")) {
    if (/\.(pdf|bib|txt)$/i.test(file)) {
      eleventyConfig.addPassthroughCopy({
        [path.join("_pages", file)]: file,
      });
    }
  }

  // Allow raw HTML inside Markdown
  const md = markdownIt({ html: true, typographer: true });
  eleventyConfig.setLibrary("md", md);

  // Simple slugify filter (matches Jekyll's default behaviour)
  eleventyConfig.addFilter("slugify", (str) =>
    String(str)
      .toLowerCase()
      .replace(/[^\w\s-]/g, "")
      .trim()
      .replace(/[\s_]+/g, "-")
  );

  // Estimate the next unannounced deadline on the prior cycle's month and day.
  eleventyConfig.addFilter("nextDeadline", (isoDate) => {
    const match = String(isoDate).match(/^(\d{4})-(\d{2})-(\d{2})$/);
    if (!match) return isoDate;

    const [, year, month, day] = match;
    const now = new Date();
    const today = `${now.getFullYear()}-${String(now.getMonth() + 1).padStart(2, "0")}-${String(now.getDate()).padStart(2, "0")}`;
    let expectedYear = Number(year) + 1;
    let expectedDeadline;

    do {
      const lastDayOfMonth = new Date(Date.UTC(expectedYear, Number(month), 0)).getUTCDate();
      expectedDeadline = `${expectedYear}-${month}-${String(Math.min(Number(day), lastDayOfMonth)).padStart(2, "0")}`;
      expectedYear += 1;
    } while (expectedDeadline < today);

    return expectedDeadline;
  });

  return {
    dir: {
      input: ".",
      output: "_site",
      includes: "_includes",
      layouts: "_layouts",
      data: "_data",
    },
    templateFormats: ["md", "njk"],
    markdownTemplateEngine: "njk",
  };
};
