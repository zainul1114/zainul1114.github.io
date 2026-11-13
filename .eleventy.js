module.exports = function (eleventyConfig) {
  // Copy static assets into the generated website.
  eleventyConfig.addPassthroughCopy({ "src/assets": "assets" });

  // Human-readable dates for article lists.
  eleventyConfig.addFilter("readableDate", (value) => {
    if (!value) return "";
    const date = value instanceof Date ? value : new Date(value);
    if (Number.isNaN(date.getTime())) return String(value);
    return new Intl.DateTimeFormat("en-US", {
      year: "numeric", month: "long", day: "numeric", timeZone: "UTC"
    }).format(date);
  });

  // Machine-readable dates for HTML <time> elements and metadata.
  eleventyConfig.addFilter("htmlDateString", (value) => {
    if (!value) return "";
    const date = value instanceof Date ? value : new Date(value);
    if (Number.isNaN(date.getTime())) return "";
    return date.toISOString().slice(0, 10);
  });

  // Collection of Markdown tutorials.
  eleventyConfig.addCollection("tutorials", (collectionApi) =>
    collectionApi.getFilteredByGlob("src/tutorials/**/*.md").sort((a, b) => b.date - a.date)
  );

  return {
    dir: {
      input: "src",
      includes: "_includes",
      data: "_data",
      output: "_site"
    },
    templateFormats: ["md", "njk", "html"],
    markdownTemplateEngine: "njk",
    htmlTemplateEngine: "njk",
    serverOptions: {
      host: "0.0.0.0",
      port: 8080
    }
  };
};
