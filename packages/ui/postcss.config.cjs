// PostCSS Configuration File
// This configuration defines the plugins PostCSS will use to process CSS files.
module.exports = {
  plugins: {
    // 1. Tailwind CSS: Must run first to generate all utility classes and styles.
    tailwindcss: {
      // The 'config' key is removed, relying on Tailwind's default behavior 
      // to automatically find the tailwind.config.cjs/js file in the project root.
      // config: "tailwind.config.cjs",
    },

    // 2. Autoprefixer: Must run after Tailwind to parse the generated CSS 
    // and add necessary vendor prefixes (e.g., -webkit-, -moz-) for cross-browser compatibility.
    autoprefixer: {},
  },
}
