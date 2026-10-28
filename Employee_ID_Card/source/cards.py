"""Generates the three Tailoring Ideas employee ID card options (front + back each)."""
import base64, sys, os
sys.argv_backup = list(sys.argv)
FONTS, OUT = sys.argv[1], sys.argv[2]
sys.argv = [sys.argv[0], FONTS, OUT]
from logo import logo_svg

# ---- Card data (edit these to make a real employee's card) ----
EMP = dict(
    name="Prakriti Maharjan",
    designation="Creative &amp; Tech Operations Assistant",
    emp_id="TI-2026-007",
    blood="O+",
    phone="+977 98XXXXXXXX",
    issued="01 Nov 2026",
    valid="31 Oct 2027",
)
CO = dict(
    name="Tailoring Ideas",
    line="Marketing Services",
    addr1="Shree Laxmi Marg",
    addr2="Kathmandu 44600, Bagmati, Nepal",
    tel="+977-1-XXXXXXX",
    web="linkedin.com/company/tailoring-ideas",
)

def font_face():
    css = []
    for fam, w in [("Montserrat", 400), ("Montserrat", 500), ("Montserrat", 600), ("Montserrat", 700), ("Montserrat", 800)]:
        b64 = base64.b64encode(open(f"{FONTS}/{fam}-{w}.woff", "rb").read()).decode()
        css.append(f"@font-face{{font-family:'{fam}';font-weight:{w};src:url(data:font/woff;base64,{b64}) format('woff');}}")
    return "\n".join(css)

LOGO = logo_svg("#111111")
LOGO_W = logo_svg("#ffffff")
MONO = logo_svg("#111111", with_text=False)
MONO_W = logo_svg("#ffffff", with_text=False)

PHOTO = ('<div class="photo"><svg viewBox="0 0 70 90" preserveAspectRatio="xMidYMax slice"><rect width="70" height="90" fill="#dfe3e6"/>'
         '<circle cx="35" cy="34" r="15" fill="#b7bec4"/><path d="M6 90 C 8 64, 22 56, 35 56 C 48 56, 62 64, 64 90 Z" fill="#b7bec4"/></svg>'
         '<span>PHOTO</span></div>')

TERMS = """<ol class="terms">
<li>This card is the property of Tailoring Ideas and is non-transferable.</li>
<li>Wear this card visibly at all times inside the office premises.</li>
<li>Report loss or damage of this card to the office immediately.</li>
<li>Return this card to the office on leaving the company.</li>
</ol>"""

def rows(items, cls="rows"):
    return f'<table class="{cls}">' + "".join(f"<tr><th>{k}</th><td>:</td><td>{v}</td></tr>" for k, v in items) + "</table>"

FRONT_ROWS = [("Employee ID", EMP["emp_id"]), ("Blood Group", EMP["blood"]), ("Contact No.", EMP["phone"]), ("Valid Till", EMP["valid"])]
BACK_ROWS = [("Address", "&nbsp;"), ("Citizenship No.", "&nbsp;"), ("Emergency Contact", "&nbsp;"), ("Date of Issue", EMP["issued"])]

# ---------------- Design 1: Classic (portrait, grey header + teal) ----------------
d1_front = f"""
<div class="card p d1 front">
  <div class="hd">{LOGO}</div>
  <div class="rule"></div>
  {PHOTO}
  <div class="nm">{EMP['name']}</div>
  <div class="dg">{EMP['designation']}</div>
  {rows(FRONT_ROWS)}
  <div class="sig"><i></i>Authorized Signature</div>
  <div class="ft">{CO['addr1']}, {CO['addr2'].split(',')[0]}, Nepal</div>
</div>"""
d1_back = f"""
<div class="card p d1 back">
  <div class="bhd"><div class="m">{MONO}</div><div><b>TAILORING IDEAS</b><span>{CO['line']}</span></div></div>
  <div class="rule"></div>
  <div class="ttl">EMPLOYEE DETAILS</div>
  {rows(BACK_ROWS, "rows lines")}
  <div class="ttl">TERMS &amp; CONDITIONS</div>
  {TERMS}
  <div class="found"><b>If found, please return to:</b><br>Tailoring Ideas<br>{CO['addr1']}, {CO['addr2']}<br>Tel: {CO['tel']}</div>
  <div class="ft">{CO['web']}</div>
</div>"""

# ---------------- Design 2: Landscape (horizontal, common office format) ----------------
d2_front = f"""
<div class="card l d2 front">
  <div class="hd">
    <div class="lg">{LOGO}</div>
    <div class="co"><b>TAILORING IDEAS</b><span>{CO['line']}</span><span class="ad">{CO['addr1']}, {CO['addr2']}</span></div>
  </div>
  <div class="band">EMPLOYEE IDENTITY CARD</div>
  <div class="bd">
    {PHOTO}
    <div class="info">
      <div class="nm">{EMP['name']}</div>
      <div class="dg">{EMP['designation']}</div>
      {rows(FRONT_ROWS)}
    </div>
  </div>
  <div class="sig"><i></i>Authorized Signature</div>
  <div class="ft"></div>
</div>"""
d2_back = f"""
<div class="card l d2 back">
  <div class="cols">
    <div class="c1">
      <div class="ttl">EMPLOYEE DETAILS</div>
      {rows(BACK_ROWS, "rows lines")}
      <div class="ttl">TERMS &amp; CONDITIONS</div>
      {TERMS}
    </div>
    <div class="c2">
      <div class="lg">{LOGO}</div>
      <div class="found"><b>If found, please return to:</b><br>Tailoring Ideas<br>{CO['addr1']},<br>{CO['addr2']}<br>Tel: {CO['tel']}</div>
    </div>
  </div>
  <div class="ft">{CO['web']}</div>
</div>"""

# ---------------- Design 3: Monochrome (portrait, black / grey like the logo) ----------------
d3_front = f"""
<div class="card p d3 front">
  <div class="hd">{LOGO}</div>
  {PHOTO}
  <div class="nm">{EMP['name']}</div>
  <div class="dg">{EMP['designation']}</div>
  {rows(FRONT_ROWS)}
  <div class="sig"><i></i>Authorized Signature</div>
  <div class="ft">STAFF</div>
</div>"""
d3_back = f"""
<div class="card p d3 back">
  <div class="bhd">{MONO_W}<div><b>TAILORING IDEAS</b><span>{CO['line']}</span></div></div>
  <div class="in">
    {rows(BACK_ROWS, "rows lines")}
    <div class="ttl">TERMS &amp; CONDITIONS</div>
    {TERMS}
    <div class="found"><b>If found, please return to:</b><br>Tailoring Ideas<br>{CO['addr1']}, {CO['addr2']}<br>Tel: {CO['tel']}</div>
  </div>
  <div class="ft">{CO['web']}</div>
</div>"""

CSS = r"""
:root{--ink:#111;--teal:#0090b8;--teal-d:#006f8f;--grey:#e6e6e6;--mid:#6b7075;--line:#c9cdd1}
*{box-sizing:border-box;margin:0;padding:0}
.card{position:relative;overflow:hidden;background:#fff;color:var(--ink);font-family:'Montserrat',Arial,sans-serif;
  text-align:left;border-radius:3mm;-webkit-print-color-adjust:exact;print-color-adjust:exact}
.card.p{width:54mm;height:85.6mm}
.card.l{width:85.6mm;height:54mm}
.card svg{display:block}
.photo{position:relative;background:#dfe3e6;overflow:hidden}
.photo svg{width:100%;height:100%}
.photo span{position:absolute;left:0;right:0;bottom:1.2mm;text-align:center;font-size:4.2pt;letter-spacing:.6mm;color:#7d858c;font-weight:600}
.photo img{position:absolute;inset:0;width:100%;height:100%;object-fit:cover}
.rows{border-collapse:collapse;font-size:5.6pt;line-height:1.35}
.rows th{text-align:left;font-weight:600;white-space:nowrap;padding-right:1mm}
.rows td:nth-child(2){padding-right:1mm;font-weight:600}
.rows td{font-weight:500}
.rows.lines td:last-child{border-bottom:.2mm dotted #8a9096;width:100%}
.sig{position:absolute;font-size:4.4pt;color:var(--mid);text-align:center;width:20mm}
.sig i{display:block;border-top:.25mm solid var(--ink);margin-bottom:.6mm}
.terms{font-size:4.6pt;line-height:1.4;padding-left:3mm;color:#333}
.terms li{margin-bottom:.3mm}
.found{font-size:4.8pt;line-height:1.45;color:#222}
.ttl{font-size:5pt;font-weight:700;letter-spacing:.35mm}

/* ---- D1 ---- */
.d1 .hd{height:21mm;background:var(--grey);display:flex;justify-content:center;align-items:center}
.d1 .hd svg{height:17.5mm}
.d1 .rule{height:1.3mm;background:var(--teal)}
.d1 .photo{width:20mm;height:25mm;margin:3mm auto 0;border:.6mm solid #fff;outline:.25mm solid var(--line)}
.d1 .nm{text-align:center;font-weight:700;font-size:8.2pt;text-transform:uppercase;margin-top:2.2mm;letter-spacing:.1mm}
.d1 .dg{margin:1.1mm auto 0;width:max-content;max-width:46mm;text-align:center;background:var(--teal);color:#fff;font-size:5.2pt;font-weight:600;
  padding:.7mm 2.4mm;border-radius:1mm;line-height:1.3}
.d1.front .rows{margin:2.4mm 0 0 5mm}
.d1.front .sig{right:3.5mm;bottom:7.6mm}
.d1 .ft{position:absolute;left:0;right:0;bottom:0;height:5.6mm;background:var(--ink);color:#fff;font-size:4.7pt;display:flex;align-items:center;justify-content:center;letter-spacing:.1mm}
.d1 .bhd{height:13mm;background:var(--grey);display:flex;align-items:center;gap:2mm;padding:0 4mm}
.d1 .bhd .m svg{height:9mm}
.d1 .bhd b{display:block;font-size:7pt;letter-spacing:.3mm}
.d1 .bhd span{display:block;margin-top:.5mm;font-size:5pt;color:var(--mid)}
.d1.back .ttl{margin:2.6mm 4mm 1.2mm;color:var(--teal-d)}
.d1.back .rows{margin:0 4mm;width:calc(100% - 8mm)}
.d1.back .rows th{font-weight:600}
.d1.back .rows tr{height:3.4mm}
.d1.back .terms{margin:0 4mm}
.d1.back .found{margin:2.4mm 4mm 0;padding-top:2mm;border-top:.25mm solid var(--line)}

/* ---- D2 ---- */
.d2 .hd{height:14.5mm;display:flex;align-items:center;gap:2.4mm;padding:0 4mm}
.d2 .hd .lg svg{height:12mm}
.d2 .hd .lg{padding-right:2.4mm;border-right:.3mm solid var(--line)}
.d2 .co b{display:block;font-size:10pt;font-weight:800;letter-spacing:.35mm}
.d2 .co span{display:block;font-size:5.4pt;color:var(--teal-d);font-weight:600;margin-top:.3mm}
.d2 .co span.ad{color:var(--mid);font-weight:500;font-size:4.9pt}
.d2 .band{height:4.4mm;background:var(--teal);color:#fff;font-size:5.6pt;font-weight:700;letter-spacing:.8mm;display:flex;align-items:center;justify-content:center}
.d2 .bd{display:flex;gap:3.2mm;padding:2.6mm 4mm 0}
.d2 .photo{width:19mm;height:24mm;flex:none;border:.25mm solid var(--line)}
.d2 .nm{font-weight:700;font-size:8.4pt;text-transform:uppercase;letter-spacing:.1mm}
.d2 .dg{font-size:5.4pt;color:var(--teal-d);font-weight:600;margin:.5mm 0 1.6mm}
.d2.front .sig{right:4mm;bottom:3.8mm}
.d2 .ft{position:absolute;left:0;right:0;bottom:0;height:1.8mm;background:var(--ink)}
.d2 .cols{display:flex;height:calc(100% - 5mm)}
.d2 .c1{flex:1;padding:3mm 3mm 0 4mm}
.d2 .c1 .ttl{color:var(--teal-d);margin-bottom:1mm}
.d2 .c1 .ttl+.terms{margin-top:0}
.d2 .c1 .rows{width:100%;margin-bottom:2.2mm}
.d2 .c1 .rows tr{height:3.3mm}
.d2 .c2{width:30mm;background:var(--grey);padding:3.4mm 3mm 0;text-align:center}
.d2 .c2 .lg svg{height:15mm;margin:0 auto 2.2mm}
.d2 .c2 .found{font-size:4.5pt}
.d2.back .ft{height:5mm;font-size:4.7pt;color:#fff;display:flex;align-items:center;justify-content:center}

/* ---- D3 ---- */
.d3{border:.35mm solid var(--ink)}
.d3 .hd{display:flex;justify-content:center;padding-top:3.2mm}
.d3 .hd svg{height:16.5mm}
.d3 .photo{width:20mm;height:25mm;margin:2.4mm auto 0;border:.4mm solid var(--ink)}
.d3 .nm{text-align:center;font-weight:700;font-size:8.2pt;text-transform:uppercase;margin-top:2mm}
.d3 .dg{margin-top:1.2mm;background:var(--grey);text-align:center;font-size:5.3pt;font-weight:600;padding:.8mm 3mm;line-height:1.3}
.d3.front .rows{margin:2.2mm 0 0 5mm}
.d3.front .sig{right:3.5mm;bottom:7.6mm}
.d3 .ft{position:absolute;left:0;right:0;bottom:0;height:6.2mm;background:var(--ink);color:#fff;display:flex;align-items:center;justify-content:center;font-size:8pt;font-weight:700;letter-spacing:2.2mm;padding-left:2.2mm}
.d3 .bhd{background:var(--ink);color:#fff;display:flex;align-items:center;gap:2mm;padding:2.4mm 4mm}
.d3 .bhd svg{height:9mm}
.d3 .bhd b{display:block;font-size:7pt;letter-spacing:.3mm}
.d3 .bhd span{display:block;margin-top:.5mm;font-size:5pt;color:#c9c9c9}
.d3 .in{padding:3mm 4mm 0}
.d3.back .rows{width:100%}
.d3.back .rows tr{height:3.5mm}
.d3.back .ttl{margin:3mm 0 1.2mm}
.d3.back .found{margin-top:2.4mm;padding:1.8mm 2mm;background:var(--grey)}
.d3.back .ft{font-size:4.7pt;font-weight:500;letter-spacing:.1mm;padding-left:0;height:5.6mm}
"""

DESIGNS = [
    ("1", "Classic", "Portrait · grey logo header with brand teal (from the LinkedIn banner)", d1_front, d1_back),
    ("2", "Landscape", "Horizontal · logo and company name header, teal title band", d2_front, d2_back),
    ("3", "Monochrome", "Portrait · black, white and grey only, matching the logo · STAFF footer", d3_front, d3_back),
]

def page(body, extra_css=""):
    return f"""<!doctype html><html lang="en"><head><meta charset="utf-8"><meta name="viewport" content="width=device-width,initial-scale=1">
<title>Tailoring Ideas ID Cards</title><style>{font_face()}{CSS}{extra_css}</style></head><body>{body}</body></html>"""

OVERVIEW_CSS = """
body{background:#eceef0;font-family:'Montserrat',Arial,sans-serif;color:#111;padding:10mm 8mm}
h1{font-size:15pt;font-weight:700;margin-bottom:1.5mm}
.sub{font-size:8.5pt;color:#555;margin-bottom:8mm;max-width:190mm;line-height:1.5}
.opt{background:#fff;border-radius:3mm;padding:6mm 7mm 7mm;margin-bottom:7mm;box-shadow:0 .4mm 1.5mm rgba(0,0,0,.08)}
.opt h2{font-size:11pt;margin-bottom:1mm}.opt h2 em{font-style:normal;color:#0090b8}
.opt p{font-size:7.5pt;color:#666;margin-bottom:5mm}
.pair{display:flex;gap:9mm;flex-wrap:wrap;align-items:flex-start}
.face{text-align:center}.face small{display:block;font-size:6.5pt;color:#888;margin-top:2mm;letter-spacing:.4mm}
.face .card{box-shadow:0 .6mm 2.5mm rgba(0,0,0,.25);zoom:1.6}
"""

def overview():
    body = ['<h1>Tailoring Ideas · Employee ID Card Options</h1>',
            '<div class="sub">Three options, front and back, at standard ID card size (CR80: 85.6 × 54 mm). The name and details are sample text. Choose one and the final print files will be set up from it.</div>']
    for n, title, desc, f, b in DESIGNS:
        body.append(f'<section class="opt" id="opt{n}"><h2><em>Option {n}</em> · {title}</h2><p>{desc}</p><div class="pair">'
                    f'<div class="face" id="o{n}f">{f}<small>FRONT</small></div><div class="face" id="o{n}b">{b}<small>BACK</small></div></div></section>')
    return page("".join(body), OVERVIEW_CSS)

def print_page(f, b, landscape):
    size = "85.6mm 54mm" if landscape else "54mm 85.6mm"
    css = f"@page{{size:{size};margin:0}}body{{margin:0}}.card{{border-radius:0;page-break-after:always;border-width:0}}.d3{{border:.35mm solid #111}}"
    return page(f + b, css)

if __name__ == "__main__":
    os.makedirs(OUT, exist_ok=True)
    open(f"{OUT}/Tailoring_Ideas_ID_Card_Options.html", "w").write(overview())
    for n, title, _, f, b in DESIGNS:
        open(f"{OUT}/print_option{n}.html", "w").write(print_page(f, b, n == "2"))
    for name, svg in [("logo_black", LOGO), ("logo_white", LOGO_W), ("monogram_black", MONO)]:
        open(f"{OUT}/{name}.svg", "w").write(svg)
