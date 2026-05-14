import { QuartzConfig } from "./quartz/cfg"
import * as Plugin from "./quartz/plugins"
import fs from "fs" // Added fs import for reading files

/**
 * Quartz 4 Configuration
 *
 * See https://quartz.jzhao.xyz/configuration for more information.
 */

// --- Dynamic Macro Loading Script ---
// Adjust this path if your preamble.tex is located somewhere else
const preamblePath = "./public/preamble.sty"
const customMacros: Record<string, string> = {}

try {
    const preamble = fs.readFileSync(preamblePath, "utf8")
    // Updated regex to account for optional argument counts, e.g., \newcommand{\ip}[2]{...}
    const regex = /\\newcommand(?:\{|\s+)\\([a-zA-Z0-9]+)\}(?:\[\d+\])?\{(.*)\}/g
    let match

    while ((match = regex.exec(preamble)) !== null) {
        customMacros[`\\${match[1]}`] = match[2]
    }
    console.log(`Successfully loaded ${Object.keys(customMacros).length} macros from preamble.tex`)
} catch (e) {
    console.warn("Could not load preamble.tex. Are you sure the path is correct?")
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
