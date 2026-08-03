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

  // Estimate an unannounced deadline from the same date in the next year.
  eleventyConfig.addFilter("nextYear", (isoDate) => {
    const match = String(isoDate).match(/^(\d{4})-(\d{2})-(\d{2})$/);
    if (!match) return isoDate;

    const [, year, month, day] = match;
    const nextYear = Number(year) + 1;
    const lastDayOfMonth = new Date(Date.UTC(nextYear, Number(month), 0)).getUTCDate();

    return `${nextYear}-${month}-${String(Math.min(Number(day), lastDayOfMonth)).padStart(2, "0")}`;
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
