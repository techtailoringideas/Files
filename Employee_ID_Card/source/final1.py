"""Option 1 (front only) - plain print-shop style employee ID card for Tailoring Ideas."""
import sys, os
FONTS, OUT = sys.argv[1], sys.argv[2]
sys.argv = [sys.argv[0], FONTS, OUT]
from logo import logo_svg

# ---- Edit these for each employee ----
EMP = dict(
    name="Prakriti Maharjan",
    designation="Creative &amp; Tech Operations Assistant",
    id_no="TI-007",
    blood="O+ve",
    phone="98XXXXXXXX",
    valid="2084-07-14",
)

LOGO = logo_svg("#111111")

CARD = f"""
<div class="card">
  <svg class="wave" viewBox="0 0 540 250" preserveAspectRatio="none">
    <defs><linearGradient id="g" x1="0" y1="0" x2="1" y2="1"><stop offset="0" stop-color="#00a0c6"/><stop offset="1" stop-color="#00799f"/></linearGradient></defs>
    <path d="M0 0 H540 V170 C 430 230, 300 160, 170 205 C 100 228, 40 222, 0 210 Z" fill="#111"/>
    <path d="M0 0 H540 V150 C 430 210, 300 140, 170 185 C 100 208, 40 202, 0 190 Z" fill="url(#g)"/>
  </svg>
  <div class="hd">
    <div class="lg">{LOGO}</div>
    <div class="co">
      <div class="cn">TAILORING IDEAS</div>
      <div class="ms">Marketing Services</div>
      <div class="ad">Shree Laxmi Marg, Kathmandu, Nepal</div>
    </div>
  </div>
  <div class="tag">IDENTITY CARD</div>
  <div class="photo">PHOTO</div>
  <div class="nm">{EMP['name']}</div>
  <div class="dg">{EMP['designation']}</div>
  <table>
    <tr><td>ID No.</td><td>:</td><td><b>{EMP['id_no']}</b></td></tr>
    <tr><td>Blood Group</td><td>:</td><td><b>{EMP['blood']}</b></td></tr>
    <tr><td>Contact No.</td><td>:</td><td><b>{EMP['phone']}</b></td></tr>
    <tr><td>Valid Upto</td><td>:</td><td><b>{EMP['valid']}</b></td></tr>
  </table>
  <div class="sig">Authorized Signature</div>
  <div class="ft">If found, please return to the office &nbsp;|&nbsp; Tel: 01-XXXXXXX</div>
</div>"""

CSS = """
*{box-sizing:border-box;margin:0;padding:0}
.card{position:relative;width:54mm;height:85.6mm;overflow:hidden;background:#fff;color:#111;
  font-family:Arial,'Liberation Sans',Helvetica,sans-serif;-webkit-print-color-adjust:exact;print-color-adjust:exact}
.wave{position:absolute;left:0;top:0;width:54mm;height:25mm}
.hd{position:relative;display:flex;align-items:center;gap:1.8mm;padding:2.6mm 2.2mm 0 2.4mm}
.lg{width:15mm;height:15mm;flex:none;background:#e4e4e4;border:.5mm solid #fff;display:flex;align-items:center;justify-content:center}
.lg svg{height:12.6mm;display:block}
.co{color:#fff}
.cn{font-weight:bold;font-size:9.6pt;line-height:1.05}
.ms{font-size:6pt;font-style:italic;margin-top:.6mm}
.ad{font-size:4.9pt;margin-top:.5mm;line-height:1.2}
.tag{position:relative;margin:4.4mm auto 0;width:27mm;background:#111;color:#fff;text-align:center;font-weight:bold;font-size:6pt;padding:.6mm 0;border-radius:.6mm}
.photo{margin:1.8mm auto 0;width:20mm;height:24.5mm;border:.35mm solid #0089b0;background:#f2f2f2;color:#9a9a9a;
  font-size:6pt;display:flex;align-items:center;justify-content:center}
.nm{margin-top:1.6mm;text-align:center;font-weight:bold;font-size:8.6pt;text-transform:uppercase;color:#0a4f6e}
.dg{text-align:center;font-size:5.8pt;margin-top:.4mm;padding:0 2mm}
table{margin:1.6mm 0 0 4.2mm;border-collapse:collapse;font-size:6pt;line-height:1.38}
td:nth-child(2){padding:0 1.2mm}
.sig{position:absolute;right:3mm;bottom:6.3mm;width:19mm;border-top:.2mm solid #111;padding-top:.4mm;text-align:center;font-size:4.6pt}
.ft{position:absolute;left:0;right:0;bottom:0;height:4.6mm;background:#0089b0;border-top:.6mm solid #111;color:#fff;font-size:4.6pt;
  display:flex;align-items:center;justify-content:center}
"""

def page(extra=""):
    return (f'<!doctype html><html lang="en"><head><meta charset="utf-8"><title>Tailoring Ideas ID Card</title>'
            f'<style>{CSS}{extra}</style></head><body>{CARD}</body></html>')

if __name__ == "__main__":
    os.makedirs(OUT, exist_ok=True)
    open(f"{OUT}/ID_Card_Front.html", "w").write(page("@page{size:54mm 85.6mm;margin:0}body{margin:0}"))
    open(f"{OUT}/preview.html", "w").write(page("body{background:#d9d9d9;padding:30px}.card{zoom:2.2;border-radius:3mm;box-shadow:0 1px 4px rgba(0,0,0,.35)}"))
