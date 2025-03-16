import re
import sys

def convert_latex_to_katex(latex):
    macros = {}

    # Regex pattern to match \newcommand and \renewcommand
    pattern = re.compile(r'\\(?:newcommand|renewcommand)\{(\\\w+)\}(\[\d+\])?\{(.+)\}')

    for match in pattern.finditer(latex):
        cmd, num_args, definition = match.groups()

        # Escape backslashes for KaTeX format
        definition = definition.replace('\\', '\\\\')

        macros[cmd] = definition

    return macros

def generate_katex_config(macros):
    config_lines = ["customMacros: {"]
    for key, value in macros.items():
        config_lines.append(f'    "\\{key}": "{value}",')
    config_lines.append("},")
    return "\n".join(config_lines)

def main():
    if len(sys.argv) != 2:
        print("Usage: python script.py preamble.sty")
        sys.exit(1)

    sty_file = sys.argv[1]
    try:
        with open(sty_file, "r", encoding="utf-8") as file:
            latex_macros = file.read()

        katex_macros = convert_latex_to_katex(latex_macros)
        katex_config = generate_katex_config(katex_macros)

        print(katex_config)
    except FileNotFoundError:
        print(f"Error: File '{sty_file}' not found.")
        sys.exit(1)

if __name__ == "__main__":
    main()
