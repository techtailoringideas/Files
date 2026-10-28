const { chromium } = require('playwright');
(async () => {
  const [,, dir] = process.argv;
  const b = await chromium.launch();
  // overview preview
  let p = await b.newPage({ deviceScaleFactor: 2, viewport: { width: 1100, height: 900 } });
  await p.goto('file://' + dir + '/Tailoring_Ideas_ID_Card_Options.html'); await p.waitForTimeout(300);
  await p.screenshot({ path: dir + '/All_Options_Preview.png', fullPage: true });
  await p.close();
  for (const n of ['1', '2', '3']) {
    // 300 dpi PNGs of each face (1 CSS px = 1/96 in)
    p = await b.newPage({ deviceScaleFactor: 300 / 96 });
    await p.goto('file://' + dir + `/print_option${n}.html`); await p.waitForTimeout(300);
    const cards = await p.$$('.card');
    await cards[0].screenshot({ path: `${dir}/Option${n}_Front_300dpi.png` });
    await cards[1].screenshot({ path: `${dir}/Option${n}_Back_300dpi.png` });
    await p.pdf({ path: `${dir}/Option${n}_Print_Front_Back.pdf`, preferCSSPageSize: true, printBackground: true });
    await p.close();
  }
  await b.close();
})();
