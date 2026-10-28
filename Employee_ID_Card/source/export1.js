const { chromium } = require('playwright');
(async () => {
  const [,, dir] = process.argv;
  const b = await chromium.launch();
  let p = await b.newPage({ deviceScaleFactor: 1.5, viewport: { width: 600, height: 900 } });
  await p.goto('file://' + dir + '/preview.html'); await p.waitForTimeout(300);
  await (await p.$('.card')).screenshot({ path: dir + '/preview.png' }); await p.close();
  p = await b.newPage({ deviceScaleFactor: 300 / 96 });
  await p.goto('file://' + dir + '/ID_Card_Front.html'); await p.waitForTimeout(300);
  await (await p.$('.card')).screenshot({ path: dir + '/ID_Card_Front_300dpi.png' });
  await p.pdf({ path: dir + '/ID_Card_Front_Print.pdf', preferCSSPageSize: true, printBackground: true });
  await b.close();
})();
