import { QuartzTransformerPlugin } from "../types"
import fs from "fs"
import path from "path"

export interface Options {
    debug: boolean
}

const defaultOptions: Options = {
    debug: false,
}

export const MathBlockFixer: QuartzTransformerPlugin<Partial<Options>> = (userOpts) => {
    const opts = { ...defaultOptions, ...userOpts }

    const fixMathBlocks = (content: string, filePath: string): string => {
        const mathBlockPattern = /\$\$.*?\$\$/gs
        const endDollarPattern = /^\>?\s*\>?\s*\$\$$/;

        content = content.replace(/(\d+\.)\s?\$\$/g, '$1\n$$$$')




        function fixBlock(block: string): string {
            // Ensure $$ are on separate lines if not already
            let lines = block.split('\n');
            if (lines[0].trim() !== '\$\$') {
                lines[0] = '\$\$\n' + lines[0].trim().slice(2).trim();
            }
            if (!endDollarPattern.test(lines[lines.length - 1].trim())) {
                lines[lines.length - 1] = lines[lines.length - 1].trim().slice(0, -2).trim() + '\n\$\$';
            }
            return lines.join('\n');
        }

        content = content.replace(mathBlockPattern, (match) => fixBlock(match))

        content = content.replace(/    /g, '\t')
        content = content.replace(/ \t/g, '\t')

        let lines = content.split('\n')
        let insideCallout = false
        let insideTabBlock = false
        let insideDoubleTabBlock = false
        let insideTabbedCallout = false
        let insideTabInCallout = false
        let insideDoubleTabBlockInCallout = false
        let insideCodeBlock = false
        for (let i = 0; i < lines.length; i++) {
            let line = lines[i]

            // Toggle insideCodeBlock flag when encountering ```
            if (line.trim().startsWith('```')) {
                insideCodeBlock = !insideCodeBlock
            }

            // Skip lines inside code blocks
            if (insideCodeBlock) {
                continue
            }

            // Handle double tabs inside callout
            if (line.startsWith('>\t\t')) {
                insideDoubleTabBlockInCallout = true
            } else if (line.trim() === '' || line.trim().startsWith('#') || line.trim().startsWith('---') || line.trim().startsWith('```')) {
                insideDoubleTabBlockInCallout = false
            }
            if (insideDoubleTabBlockInCallout && !line.startsWith('>\t\t') && !/^\>\t\d+\./.test(line.trim()) && !/^\>\t\- /.test(line.trim())) {
                if (line.trim().startsWith('>\t')) {
                    lines[i] = '>\t\t' + line.trim().slice(2)
                } else if (line.trim().startsWith('>')) {
                    lines[i] = '>\t\t' + line.trim().slice(1)
                } else {
                    lines[i] = '>\t\t' + line
                }
                continue
            }

            // Handle double tabs
            if (line.startsWith('\t\t')) {
                insideDoubleTabBlock = true
            } else if (line.trim() === '' || line.trim().startsWith('#') || line.trim().startsWith('---') || line.trim().startsWith('```')) {
                insideDoubleTabBlock = false
            }
            if (insideDoubleTabBlock && !line.startsWith('\t\t') && !/^\d+\.(?!\d)/.test(line.trim()) && !/^\t\- /.test(line.trim())) {
                if (line.startsWith('\t')) {
                    lines[i] = '\t' + line
                } else {
                    lines[i] = '\t\t' + line
                }
                continue
            }

            // Handle tabbed callouts
            if (/^\t ?\>/.test(line)) {
                insideTabbedCallout = true
            } else if (line.trim() === '' || line.trim().startsWith('#') || line.trim().startsWith('---') || line.trim().startsWith('```')) {
                insideTabbedCallout = false
            }
            if (!insideTabbedCallout && /^\t ?\>/.test(line.trim())) {
                lines[i] = line.trim().slice(1)
            } else if (insideTabbedCallout && !line.startsWith('\t>')) {
                if (line.trim().startsWith('\t')) {
                    lines[i] = '>' + line
                } else if (line.trim().startsWith('>')) {
                    lines[i] = '\t' + line
                } else {
                    lines[i] = '\t>' + line
                }
                continue
            }

            // Handle tabs in callouts
            if (/^\> ?\t/.test(line) || /^\> ?\d+\./.test(line.trim())) {
                insideTabInCallout = true
            } else if (line.trim() === '' || line.trim().startsWith('#') || line.trim().startsWith('---') || line.trim().startsWith('```')) {
                insideTabInCallout = false
            }

            if (insideTabInCallout && /^\> ?\t ?/.test(line)) {
                lines[i] = line.replace(/^\> ?\t ?/, '>\t')
                continue
            }

            if (insideTabInCallout && !/^\> ?\t/.test(line.trim()) && !/^\> ?\t/.test(line) && !/^\> ?\d+\./.test(line.trim()) && !/^\- /.test(line.trim())) {
                if (/^\d+\.(?!\d)/.test(line.trim())) {
                    lines[i] = '>' + line
                } else if (line.trim().startsWith('>')) {
                    lines[i] = '>\t' + line.trim().slice(1)
                } else {
                    lines[i] = '>\t' + line
                }
                continue
            }

            // Handle callouts
            if (line.trim().startsWith('>')) {
                insideCallout = true
            } else if (line.trim() === '' || line.trim().startsWith('#') || line.trim().startsWith('---') || line.trim().startsWith('```')) {
                insideCallout = false
            }
            if (insideCallout && !line.trim().startsWith('>')) {
                lines[i] = '> ' + line
                continue
            }

            // Handle tabs
            if (/^ ?\t/.test(line) || /^\d+\.(?!\d)/.test(line.trim()) || /^\- /.test(line.trim())) { // check this one
                insideTabBlock = true
            } else if (line.trim() === '' || line.trim().startsWith('#') || line.trim().startsWith('---') || line.trim().startsWith('```')) {
                insideTabBlock = false
            }
            if (!insideTabBlock && /^ ?\t/.test(line)) {
                lines[i] = line.trim().slice(1)
            } else if (insideTabBlock && !/^ ?\t/.test(line) && !/^\d+\.(?!\d)/.test(line.trim()) && !/^\- /.test(line.trim())) {
                lines[i] = '\t' + line
                continue
            }

            if (!insideTabBlock && /^ ?\t/.test(line)) {
                console.log('Found an annoying tab in ' + filePath + ":" + i + " - ", line)
            }
        }

        return lines.join('\n')
    }

    const writeDebugFile = (content: string, filePath: string) => {
        const debugDir = path.resolve('mathblock-debug')
        if (!fs.existsSync(debugDir)) {
            fs.mkdirSync(debugDir)
        }
        const debugFilePath = path.join(debugDir, path.basename(filePath))
        fs.writeFileSync(debugFilePath, content, 'utf-8')
    }

    return {
        name: "MathBlockFixer",
        textTransform(_ctx, src) {
            // TODO: Find a way to get the file path, currently generating random file names
            const random = Math.random().toString(36).substring(7)
            const filePath = random + '.md'

            const content = fixMathBlocks(src.toString(), filePath)
            if (opts.debug) {
                writeDebugFile(content, filePath)
            }
            return content
        },
    }
}
