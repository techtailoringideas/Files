"""Assembles the single-file prototype from src/, inlining the sample page images from src/images.

    python3 build.py                 writes ../Tech-Tailoring-Client-Portal-Demo.html
    python3 build.py OUT_DIR         writes it into OUT_DIR instead
    python3 build.py OUT_DIR --artifact   also writes artifact.html (no <html>/<head>/<body>, for publishing)
"""
import base64, os, sys

HERE = os.path.dirname(os.path.abspath(__file__))
SRC = os.path.join(HERE, 'src')
ARGS = [a for a in sys.argv[1:] if not a.startswith('--')]
OUT = ARGS[0] if ARGS else os.path.dirname(HERE)
os.makedirs(OUT, exist_ok=True)

def rd(name):
    with open(os.path.join(SRC, name), encoding='utf-8') as f:
        return f.read()

css = rd('styles.css') + '\n' + rd('styles_extra.css')
data = '\n'.join(rd(n) for n in ['data_head.js', 'data_questions.js', 'data_seed.js', 'data_icons.js', 'data_tail.js'])
IMAGES = ['mr_cover', 'mr_action', 'mr_deck', 'mr_slide', 'co_cover', 'co_slide', 'pm_cover', 'pm_flow', 'me_cover', 'me_summary']
def b64(key):
    with open(os.path.join(SRC, 'images', key + '.jpg'), 'rb') as f:
        return base64.b64encode(f.read()).decode('ascii')
data = data.replace('/*__IMG__*/', '\n'.join(f"  {k}: 'data:image/jpeg;base64,{b64(k)}'," for k in IMAGES))
app = '\n'.join(rd(n) for n in ['app_core.js', 'app_customer.js', 'app_team.js', 'app_actions.js'])
body = rd('body.html')

meta = '''<title>Tech Tailoring Client Portal</title>
<meta name="description" content="Clickable prototype: the customer services site and the team dashboard.">
<meta name="claude:viewport-fit-sides" content="cover">
<link rel="preconnect" href="https://fonts.googleapis.com">
<link rel="preconnect" href="https://fonts.gstatic.com" crossorigin>
<link href="https://fonts.googleapis.com/css2?family=Geist+Mono:wght@400..600&family=Instrument+Sans:ital,wdth,wght@0,75..100,400..700;1,75..100,400..700&family=Newsreader:ital,opsz,wght@0,6..72,300..700;1,6..72,300..700&display=swap" rel="stylesheet">'''

scripts = f'<script>\n{data}\n</script>\n<script>\n{app}\n</script>'
full = ('<!doctype html>\n<html lang="en">\n<head>\n<meta charset="utf-8">\n'
        '<meta name="viewport" content="width=device-width, initial-scale=1, viewport-fit=cover">\n'
        f'{meta}\n<style>\n{css}\n</style>\n</head>\n<body>\n{body}\n{scripts}\n</body>\n</html>\n')
frag = f'{meta}\n<style>\n{css}\n</style>\n{body}\n{scripts}\n'

with open(os.path.join(OUT, 'Tech-Tailoring-Client-Portal-Demo.html'), 'w', encoding='utf-8') as f:
    f.write(full)
if '--artifact' in sys.argv:
    with open(os.path.join(OUT, 'artifact.html'), 'w', encoding='utf-8') as f:
        f.write(frag)
print('built', len(full), 'bytes')
