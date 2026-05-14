import { QuartzConfig } from "./quartz/cfg"
import * as Plugin from "./quartz/plugins"
import fs from "fs" // Added fs import for reading files

/**
 * Quartz 4 Configuration
 *
 * See https://quartz.jzhao.xyz/configuration for more information.
 */

// --- Dynamic Macro Loading Script ---
// Adjust this path if your preamble.sty is located somewhere else
const preamblePath = "/home/sofi/Documents/PhysicsVault/preamble.sty"
const customMacros: Record<string, string> = {}

try {
  const preamble = fs.readFileSync(preamblePath, "utf8")
  // Updated regex to account for optional argument counts, e.g., \newcommand{\ip}[2]{...}
  const regex = /\\newcommand(?:\{|\s+)\\([a-zA-Z0-9]+)\}(?:\[\d+\])?\{(.*)\}/g
  let match

  while ((match = regex.exec(preamble)) !== null) {
    customMacros[`\\${match[1]}`] = match[2]
  }
  console.log(`Successfully loaded ${Object.keys(customMacros).length} macros from preamble.sty`)
} catch (e) {
  console.warn("Could not load preamble.sty. Are you sure the path is correct?")
}

// Dynamic CSS Loading Script (ADD THIS) ---
// Replace this with the absolute path to your CSS file in your vault
const vaultCssPath = "/home/sofi/Documents/PhysicsVault/.obsidian/snippets/custom_callouts.css"
// This is where Quartz will save the copied file
const quartzCssDest = "./quartz/styles/_obsidian_callouts.scss"

try {
  const cssContent = fs.readFileSync(vaultCssPath, "utf8")
  fs.writeFileSync(quartzCssDest, cssContent)
  console.log("Successfully synced custom_callouts.css from Obsidian vault")
} catch (e) {
  // FAილSAFE: If the path is wrong, create an empty file so the site doesn't crash
  fs.writeFileSync(quartzCssDest, "/* Could not load custom_callouts.css from vault. Check path in quartz.config.ts */")
  console.warn("\n⚠️ WARNING: Could not find custom_callouts.css. Check the vaultCssPath in quartz.config.ts!\n")
}


// ------------------------------------

// comment
const config: QuartzConfig = {
  configuration: {
    pageTitle: "Physics Garden",
    pageTitleSuffix: " - Physics Garden",
    enableSPA: true,
    enablePopovers: true,
    analytics: {
      provider: "plausible",
    },
    locale: "en-US",
    baseUrl: "quartz.jzhao.xyz",
    ignorePatterns: [
      ".obsidian/",
      "**/*.patch",
      // "**/*.pdf",
      "**/*.canvas",
      "_res/Clippings/",
      "_res/Excalidraw/",
      "_res/References/",
      "_res/Task trackers/",
      "_res/Templates/",
      "Journal/",
      "Research Notes/",
    ],
    defaultDateType: "created",
      generateSocialImages: true,
      theme: {
        fontOrigin: "googleFonts",
        cdnCaching: true,
        typography: {
          header: "Schibsted Grotesk",
          body: "Source Sans Pro",
          code: "IBM Plex Mono",
        },
        colors: {
          lightMode: {
            light: "#F8F8F2",         // The Dracula text color makes a great soft-white background
            lightgray: "#E2E2DF",     // Soft gray for borders and inline code backgrounds
            gray: "#999999",          // Medium gray for graph links and heavier borders
            darkgray: "#44475A",      // Dark gray/blue (your dark mode's lightgray) for highly readable body text
            dark: "#282A36",          // Your dark mode's background color becomes the bold header text
            secondary: "#8B5CF6",     // A slightly darker, more vivid version of your purple for contrast
            tertiary: "#6272A4",      // Same tertiary blue/purple for hover states
            highlight: "rgba(189, 147, 249, 0.15)", // A soft purple highlight for active links
            textHighlight: "rgba(241, 250, 140, 0.5)", // Dracula yellow for text highlighting
          },
          darkMode: {
            light: "#282A36",
            lightgray: "#44475A",
            gray: "#646464",
            darkgray: "#F8F8F2",
            dark: "#FFFFFF",
            secondary: "#bd93f9",
            tertiary: "#6272a4",
            highlight: "rgba(143, 159, 169, 0.15)",
            textHighlight: "#b3aa0288",
          },
        },
      },
  },
  plugins: {
    transformers: [
      Plugin.FrontMatter(),
      Plugin.CreatedModifiedDate({
        priority: ["frontmatter", "filesystem"],
      }),
      Plugin.SyntaxHighlighting({
        theme: {
          light: "github-light",
          dark: "github-dark",
        },
        keepBackground: false,
      }),
      Plugin.ObsidianFlavoredMarkdown({ enableInHtmlEmbed: false }),
      Plugin.GitHubFlavoredMarkdown(),
      Plugin.TableOfContents(),
      Plugin.CrawlLinks({ markdownLinkResolution: "shortest" }),
      Plugin.Description(),
      //Plugin.MathBlockFixer(),

      // Updated to use the dynamically generated customMacros object
      Plugin.Latex({
        renderEngine: "katex",
        customMacros: customMacros,
      }),

      Plugin.HardLineBreaks(),
    ],
    filters: [Plugin.ExplicitPublish()],
    emitters: [
      Plugin.AliasRedirects(),
      Plugin.ComponentResources(),
      Plugin.ContentPage(),
      Plugin.FolderPage(),
      Plugin.TagPage(),
      Plugin.ContentIndex({
        enableSiteMap: true,
        enableRSS: true,
      }),
      Plugin.Assets(),
      Plugin.Static(),
      Plugin.NotFoundPage(),
    ],
  },
}

export default config
