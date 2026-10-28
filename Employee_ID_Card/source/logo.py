"""Builds the Tailoring Ideas 'Ti' logo as a self-contained SVG (text converted to paths)."""
import sys
from fontTools.ttLib import TTFont
from fontTools.pens.svgPathPen import SVGPathPen
from fontTools.pens.transformPen import TransformPen

FONTS = sys.argv[1]

def text_path(font_file, text, size, x_center, baseline, tracking=0.0, sx=1.0):
    f = TTFont(font_file)
    gs = f.getGlyphSet(); cmap = f.getBestCmap(); upm = f['head'].unitsPerEm
    s = size / upm
    names = [cmap[ord(c)] for c in text]
    adv = [gs[n].width * s * sx for n in names]
    total = sum(adv) + tracking * (len(names) - 1)
    x = x_center - total / 2
    d = []
    for n, a in zip(names, adv):
        pen = SVGPathPen(gs)
        gs[n].draw(TransformPen(pen, (s * sx, 0, 0, -s, x, baseline)))
        d.append(pen.getCommands())
        x += a + tracking
    return " ".join(d)

def logo_svg(fg="#111", bulb_fill="none", with_text=True):
    # Monogram: T (needle across the bar, thread loop), i with a light-bulb dot
    parts = []
    parts.append(f'<rect x="22" y="72" width="118" height="17" fill="{fg}"/>')        # T bar
    parts.append(f'<rect x="71" y="89" width="20" height="148" fill="{fg}"/>')         # T stem
    parts.append(f'<rect x="150" y="108" width="19" height="129" fill="{fg}"/>')       # i stem
    # needle lying along the top of the T bar
    parts.append(f'<path d="M28 66.2 L128 64.2 L128 67.8 Z" fill="{fg}"/>')
    parts.append(f'<ellipse cx="124" cy="66" rx="4.2" ry="2.2" fill="none" stroke="{fg}" stroke-width="1.3"/>')
    # thread rising from the needle's eye into a loop
    parts.append(f'<path d="M124 66 C 128 52, 134 42, 141 34 C 147 27, 156 22, 160 28 C 164 34, 156 42, 150 36 C 145 31, 151 21, 160 18" '
                 f'fill="none" stroke="{fg}" stroke-width="1.4" stroke-linecap="round"/>')
    # light bulb as the dot of the i
    parts.append(f'<path d="M159.5 101 L159.5 97 C 159.5 93, 150 90, 150 81 A 9.5 9.5 0 1 1 169 81 C 169 90, 159.5 93, 159.5 97" '
                 f'fill="{bulb_fill}" stroke="{fg}" stroke-width="1.6" stroke-linejoin="round"/>')
    parts.append(f'<path d="M154.5 98 H164.5 M155.5 101.5 H163.5" stroke="{fg}" stroke-width="1.6" stroke-linecap="round"/>')
    parts.append(f'<path d="M156 84 L158 79 L159.5 83 L161 79 L163 84" fill="none" stroke="{fg}" stroke-width="1" stroke-linejoin="round"/>')
    h = 250
    if with_text:
        parts.append(f'<path d="{text_path(FONTS + "/Montserrat-400.woff", "TAILORING", 31, 96, 278, tracking=-1.2, sx=0.8)}" fill="{fg}"/>')
        parts.append(f'<path d="{text_path(FONTS + "/Montserrat-500.woff", "IDEAS", 10.5, 96, 298, tracking=5)}" fill="{fg}"/>')
        h = 302
    return f'<svg xmlns="http://www.w3.org/2000/svg" viewBox="-12 6 216 {h}">' + "".join(parts) + "</svg>"

if __name__ == "__main__":
    out = sys.argv[2]
    open(out + "/logo_black.svg", "w").write(logo_svg("#111111"))
    open(out + "/logo_white.svg", "w").write(logo_svg("#ffffff"))
    open(out + "/monogram_black.svg", "w").write(logo_svg("#111111", with_text=False))
