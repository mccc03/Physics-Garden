import { QuartzConfig } from "./quartz/cfg"
import * as Plugin from "./quartz/plugins"

/**
 * Quartz 4 Configuration
 *
 * See https://quartz.jzhao.xyz/configuration for more information.
 */
const config: QuartzConfig = {
  configuration: {
    pageTitle: "Quartz 4",
    pageTitleSuffix: "",
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
      "**/*.pdf",
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
            light: "#faf8f8",
            lightgray: "#e5e5e5",
            gray: "#b8b8b8",
            darkgray: "#4e4e4e",
            dark: "#2b2b2b",
            secondary: "#284b63",
            tertiary: "#84a59d",
            highlight: "rgba(143, 159, 169, 0.15)",
            textHighlight: "#fff23688",
          },
          darkMode: {
            light: "#161618",
            lightgray: "#393639",
            gray: "#646464",
            darkgray: "#d4d4d4",
            dark: "#ebebec",
            secondary: "#7b97aa",
            tertiary: "#84a59d",
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
      Plugin.MathBlockFixer({ debug: false }),
      Plugin.Latex({
        renderEngine: "katex",
        customMacros: {
          "\\ip": "\\left\\langle\\smash{#1}\\middle\\vert\\smash{#2}\\right\\rangle",
          "\\op": "\\left\\lvert\\smash{#1}\\middle\\rangle\\!\\middle\\langle\\smash{#2}\\right\\rvert",
          "\\ev": "\\vphantom{#2}\\left\\langle{#1}\\middle\\vert\\smash{#2}\\middle\\vert{#1}\\right\\rangle",
          "\\matel": "\\vphantom{#2}\\left\\langle{#1}\\middle\\vert\\smash{#2}\\middle\\vert{#3}\\right\\rangle",
          "\\highlight": "%\\colorbox{red!50}{$\\displaystyle#1$}",
          "\\tr": "\\mathrm{tr}",
          "\\abs": "\\left\\vert{#1}\\right\\vert",
          "\\norm": "\\left\\lVert{#1}\\right\\rVert",
          "\\id": "\\mathrm{Id}",
          "\\chid": "\\mathbb{1}",
          "\\logbit": "\\log _2",
          "\\mod": "\\mathrm{mod}_{{#1}}\\left[{#2}\\right]",
          "\\comm": "\\left[{#1},{#2}\\right]",
          "\\anticomm": "\\left\\{{#1},{#2}\\right\\}",
          "\\ketvec": "\\left\\lvert\\smash{#1}\\right\\rangle\\left.\\vphantom{#1}\\right\\rangle",
          "\\bravec": "\\left\\langle\\vphantom{#1}\\right.\\left\\langle\\smash{#1}\\right\\rvert",
          "\\corr": "\\left\\langle {#1} \\right\\rangle",
        },
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
