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

  // PDFs, BibTeX, and other files served from /_pages/
  eleventyConfig.addPassthroughCopy("_pages/*.pdf");
  eleventyConfig.addPassthroughCopy("_pages/*.bib");
  eleventyConfig.addPassthroughCopy("_pages/*.txt");

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
