import { chromium } from '@playwright/test';

async function testOrbit() {
  const browser = await chromium.launch();
  const page = await browser.newPage({ viewport: { width: 1280, height: 800 } });
  await page.goto('http://localhost:4000', { waitUntil: 'networkidle' });

  // 1. Check Center Node
  console.log('--- Checking Center Node ---');
  const coreImg = await page.$('#orbit-core image');
  const clipPath = await page.$('clipPath#core-avatar-clip');
  const coreText = await page.textContent('#orbit-core');
  console.log('Center has image:', !!coreImg);
  console.log('Center has clipPath:', !!clipPath);
  console.log('Center text:', JSON.stringify(coreText?.trim() || ''));

  // 2. Measure offset at 0s, 3s, 7s
  console.log('\n--- Sampling label offset at 0s, 3s, 7s ---');
  for (const time of [0, 3, 7]) {
    if (time > 0) {
      await page.waitForTimeout(time === 3 ? 3000 : 4000);
    }
    const samples = await page.evaluate(() => {
      const links = Array.from(document.querySelectorAll('.planet-link'));
      const svg = document.getElementById('orbit-svg');
      const svgRect = svg.getBoundingClientRect();
      const scale = 460 / svgRect.width;

      return links.map((link) => {
        const dot = link.querySelector('.planet-dot');
        const lbl = link.querySelector('.lbl');
        const dotRect = dot.getBoundingClientRect();
        const lblRect = lbl.getBoundingClientRect();

        const dotCenterX = (dotRect.left + dotRect.width / 2 - svgRect.left) * scale;
        const dotCenterY = (dotRect.top + dotRect.height / 2 - svgRect.top) * scale;
        const lblCenterX = (lblRect.left + lblRect.width / 2 - svgRect.left) * scale;
        const lblCenterY = (lblRect.top + lblRect.height / 2 - svgRect.top) * scale;

        const dx = lblCenterX - dotCenterX;
        const dy = lblCenterY - dotCenterY;
        const dist = Math.hypot(dx, dy);

        return {
          name: link.querySelector('.lbl text')?.textContent?.trim(),
          dx: dx.toFixed(2),
          dy: dy.toFixed(2),
          dist: dist.toFixed(2),
        };
      });
    });

    console.log(`Time ${time}s samples:`);
    samples.slice(0, 3).forEach((s) => console.log(`  ${s.name}: dx=${s.dx}, dy=${s.dy}, dist=${s.dist}`));
  }

  await browser.close();
}

testOrbit();
