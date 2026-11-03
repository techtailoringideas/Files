# Free client-side tech stack for browser utility tools (verified 2026-11-03)

A budget stop cut this research short. The proxy blocked the GitHub API, Hugging Face and npm download stats. Versions and licenses below come from the npm registry ("last update" = registry modified date) and from LICENSE and doc files on GitHub.

## PDF operations
### Takeaway
Permissive libraries cover viewing, merging, splitting, forms and signing. The strongest compression and redaction engines (MuPDF, Ghostscript) are AGPL.
### Cited Findings
- pdf-lib has had no update since May 2022. Two MIT forks are maintained: @cantoo/pdf-lib 2.11.1 (Sep 2026) and @pdfme/pdf-lib 6.2.8 (Oct 2026) — [npm](https://registry.npmjs.org/pdf-lib/latest), [npm](https://registry.npmjs.org/@cantoo%2fpdf-lib/latest), [npm](https://registry.npmjs.org/@pdfme%2fpdf-lib/latest)
- pdfjs-dist 6.5.438 is Apache-2.0 (Nov 2026) — [npm](https://registry.npmjs.org/pdfjs-dist/latest)
- @embedpdf/pdfium 2.15.1 (PDFium compiled to WASM, 7.6 MB) is listed as MIT on npm. The repo LICENSE instead applies Apache-2.0 to the listed parts and FCL-1.0 to cloudpdf/server — [npm](https://registry.npmjs.org/@embedpdf%2fpdfium/latest), [LICENSE](https://raw.githubusercontent.com/embedpdf/embed-pdf-viewer/main/LICENSE)
- mupdf.js 1.28.1 is AGPL-3.0-or-later — [npm](https://registry.npmjs.org/mupdf/latest), [LICENSE](https://raw.githubusercontent.com/ArtifexSoftware/mupdf.js/master/LICENSE)
- @jspawn/ghostscript-wasm is AGPL-3.0 and was last updated in 2022 — [npm](https://registry.npmjs.org/@jspawn%2fghostscript-wasm/latest)
- qpdf and pdfcpu are Apache-2.0. The qpdf-wasm wrapper is ISC (Nov 2026) — [qpdf](https://raw.githubusercontent.com/qpdf/qpdf/main/LICENSE.txt), [pdfcpu](https://raw.githubusercontent.com/pdfcpu/pdfcpu/master/LICENSE.txt), [npm](https://registry.npmjs.org/@neslinesli93%2fqpdf-wasm/latest)
- jsPDF 4.2.1, pdfme 6.2.8 and the signing libraries zgapdfsigner 2.8.0 and @signpdf/signpdf 4.0.0 are all MIT — [jspdf](https://registry.npmjs.org/jspdf/latest), [pdfme](https://registry.npmjs.org/@pdfme%2fgenerator/latest), [zga](https://registry.npmjs.org/zgapdfsigner/latest), [signpdf](https://registry.npmjs.org/@signpdf%2fsignpdf/latest)
- Competitor BentoPDF is AGPL-3.0 and ships PyMuPDF as WASM (56 MB, AGPL) — [LICENSE](https://raw.githubusercontent.com/alam00000/bentopdf/main/LICENSE), [npm](https://registry.npmjs.org/@bentopdf%2fpymupdf-wasm/latest)

## Images and AI models
### Takeaway
Image codecs and resizing libraries are permissive. The ready-made background-removal package is AGPL, so build on MIT or Apache models instead.
### Cited Findings
- The jSquash wrappers are Apache-2.0. Unpacked sizes: AVIF 8.4 MB, MozJPEG 0.5 MB, WebP 0.9 MB — [npm](https://registry.npmjs.org/@jsquash%2favif/latest)
- browser-image-compression has not been updated since Mar 2023. pica 10.0.3 (MIT) is active — [npm](https://registry.npmjs.org/browser-image-compression/latest), [npm](https://registry.npmjs.org/pica/latest)
- libheif is LGPL-3.0, and so are libheif-js 1.23.5 and heic-to 1.6.7. heic2any (MIT) has not been updated since 2023 — [COPYING](https://raw.githubusercontent.com/strukturag/libheif/master/COPYING), [npm](https://registry.npmjs.org/heic-to/latest), [npm](https://registry.npmjs.org/heic2any/latest)
- @imgly/background-removal 1.7.0 is AGPL-3.0, with commercial licenses on request. Its ISNet models are about 40 MB (quantized) or 80 MB (fp16 default). It can use WebGPU and loads its models from IMG.LY's CDN by default — [README](https://raw.githubusercontent.com/imgly/background-removal-js/main/packages/web/README.md), [LICENSE](https://raw.githubusercontent.com/imgly/background-removal-js/main/LICENSE.md)
- Code licenses: U²-Net, ISNet and MODNet are Apache-2.0; BiRefNet and BEN2 are MIT; Real-ESRGAN is BSD-3; Upscayl is AGPL — [U²-Net](https://raw.githubusercontent.com/xuebinqin/U-2-Net/master/LICENSE), [DIS](https://raw.githubusercontent.com/xuebinqin/DIS/main/LICENSE.md), [MODNet](https://raw.githubusercontent.com/ZHKKKe/MODNet/master/LICENSE), [BiRefNet](https://raw.githubusercontent.com/ZhengPeng7/BiRefNet/main/LICENSE), [BEN2](https://raw.githubusercontent.com/PramaLLC/BEN2/main/LICENSE), [ESRGAN](https://raw.githubusercontent.com/xinntao/Real-ESRGAN/master/LICENSE), [Upscayl](https://raw.githubusercontent.com/upscayl/upscayl/main/LICENSE)
- transformers.js 4.3.2 (Apache-2.0, Oct 2026) and onnxruntime-web 1.31.1 (MIT) are current — [npm](https://registry.npmjs.org/@huggingface%2ftransformers/latest), [npm](https://registry.npmjs.org/onnxruntime-web/latest)

## Video and audio
### Takeaway
ffmpeg.wasm is slow, GPL-licensed and no longer updated often. Prefer WebCodecs with Mediabunny (MPL-2.0).
### Cited Findings
- @ffmpeg/core 0.12.10 is GPL-2.0-or-later (only the wrapper is MIT). It bundles x264, x265, LAME and libvpx, and has had no release since Apr 2025 — [npm](https://registry.npmjs.org/@ffmpeg%2fcore/latest), [FAQ](https://raw.githubusercontent.com/ffmpegwasm/ffmpeg.wasm/main/apps/website/docs/faq.md), [Dockerfile](https://raw.githubusercontent.com/ffmpegwasm/ffmpeg.wasm/main/Dockerfile)
- Inputs are capped at 2 GB, a hard WASM limit. The multi-thread build is about 2x faster but uses more memory — [FAQ](https://raw.githubusercontent.com/ffmpegwasm/ffmpeg.wasm/main/apps/website/docs/faq.md)
- A 2023 benchmark converted a 10 s 720p clip from WebM to MP4 in 5.2 s natively, 128.8 s single-threaded and 60.4 s multi-threaded — [perf](https://raw.githubusercontent.com/ffmpegwasm/ffmpeg.wasm/main/apps/website/docs/performance.md)
- Mediabunny 1.65.0 is MPL-2.0. mp4box.js 2.5.0 is BSD-3 — [npm](https://registry.npmjs.org/mediabunny/latest), [npm](https://registry.npmjs.org/mp4box/latest)
- whisper.cpp model sizes: tiny 75 MiB (about 273 MB of RAM), base 142 MiB, small 466 MiB (about 852 MB). The WASM demo (undated README) runs 2–3x faster than real time on tiny and base and is usable up to small — [README](https://raw.githubusercontent.com/ggml-org/whisper.cpp/master/README.md), [wasm](https://raw.githubusercontent.com/ggml-org/whisper.cpp/master/examples/whisper.wasm/README.md)
- Moonshine speech models are MIT, except legacy non-streaming ones under a non-commercial license — [LICENSE](https://raw.githubusercontent.com/moonshine-ai/moonshine/main/LICENSE)
- lamejs (MP3 encoding) is LGPL-3.0 — [npm](https://registry.npmjs.org/lamejs/latest)

## Office conversion and OCR
### Cited Findings
- mammoth 1.13.0 is BSD-2. docx 9.15.1 is MIT. zetajs 1.2.0, the bridge to ZetaOffice, is MIT and was last updated in May 2025 — [npm](https://registry.npmjs.org/mammoth/latest), [npm](https://registry.npmjs.org/docx/latest), [npm](https://registry.npmjs.org/zetajs/latest)
- tesseract.js 7.0.0 is Apache-2.0 (Dec 2025). Scribe.js is AGPL-3.0. The PaddleOCR browser wrappers ppu-paddle-ocr 6.6.1 and @gutenye/ocr-browser are MIT — [npm](https://registry.npmjs.org/tesseract.js/latest), [LICENSE](https://raw.githubusercontent.com/scribeocr/scribe.js/master/LICENSE), [npm](https://registry.npmjs.org/ppu-paddle-ocr/latest)

## Hosting, browser limits, license pitfalls, effort
### Inferences
- Avoid AGPL code (MuPDF, Ghostscript, IMG.LY, Scribe, BentoPDF) unless you open-source the whole site or buy a license.
- For video, build an LGPL-only ffmpeg core or use WebCodecs.
- Ship LGPL code (libheif, LAME) as separate, replaceable .wasm files with license notices.
- A model's code license may not cover its weights. Check each model card.
### Gaps
- Not verified: limits on Cloudflare, Vercel (including its Hobby-plan commercial-use terms), Netlify and GitHub Pages, and the cost of Cloudflare Containers, Fly.io, Hetzner or HF Spaces at 40k users.
- Not verified: WebGPU support, iOS Safari memory limits, COOP/COEP conflicts with ads (credentialless, Document-Isolation-Policy) and PWA support.
- Not verified: BRIA RMBG weight licenses (Hugging Face was blocked), OCR accuracy including Devanagari, compression quality compared with Ghostscript, LibreOffice-WASM fidelity, and build-effort estimates.
