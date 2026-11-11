import { chromium } from 'playwright';

async function testAdjustments() {
  const browser = await chromium.launch();
  const viewports = [
    { width: 1440, height: 900, name: '1440x900' },
    { width: 1892, height: 916, name: '1892x916' },
    { width: 1280, height: 720, name: '1280x720' },
    { width: 1920, height: 1080, name: '1920x1080' },
    { width: 390, height: 844, name: '390x844' },
  ];

  for (const vp of viewports) {
    const page = await browser.newPage({ viewport: { width: vp.width, height: vp.height } });
    await page.goto('http://localhost:4200/', { waitUntil: 'networkidle' });
    await page.waitForTimeout(1000);

    const layout = await page.evaluate(() => {
      const getB = (sel) => {
        const el = document.querySelector(sel);
        if (!el) return null;
        const r = el.getBoundingClientRect();
        return {
          left: Math.round(r.left),
          right: Math.round(r.right),
          top: Math.round(r.top),
          bottom: Math.round(r.bottom),
          width: Math.round(r.width),
          height: Math.round(r.height),
        };
      };
      const overlayEl = document.querySelector('ellipse[fill*="orbit-dark-overlay"]');
      return {
        stage: getB('.orbit-stage'),
        core: getB('#orbit-core'),
        char: getB('.hero-character-launcher'),
        overlayAttrs: overlayEl
          ? {
              cx: overlayEl.getAttribute('cx'),
              cy: overlayEl.getAttribute('cy'),
              rx: overlayEl.getAttribute('rx'),
              ry: overlayEl.getAttribute('ry'),
              transform: overlayEl.getAttribute('transform'),
            }
          : null,
      };
    });

    console.log(`[${vp.name}] stage:`, layout.stage, 'core:', layout.core, 'char:', layout.char);
    console.log(`  overlayAttrs:`, layout.overlayAttrs);

    const intersects =
      layout.stage &&
      layout.char &&
      layout.stage.left < layout.char.right &&
      layout.stage.right > layout.char.left &&
      layout.stage.top < layout.char.bottom &&
      layout.stage.bottom > layout.char.top;

    console.log(`  Intersects: ${intersects}`);
    await page.screenshot({ path: `test/screenshots/adjusted-${vp.name}.png` });
  }

  await browser.close();
  console.log('All viewports tested!');
}

testAdjustments().catch(console.error);
