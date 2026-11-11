import { chromium } from '@playwright/test';

async function testOverlaps() {
  const browser = await chromium.launch();
  const page = await browser.newPage({ viewport: { width: 1280, height: 800 } });
  await page.goto('http://localhost:4000', { waitUntil: 'networkidle' });

  for (const time of [0, 3, 7]) {
    if (time > 0) {
      await page.waitForTimeout(time === 3 ? 3000 : 4000);
    }

    const overlaps = await page.evaluate(() => {
      const links = Array.from(document.querySelectorAll('.planet-link'));
      const rects = links.map((link) => {
        const lbl = link.querySelector('.lbl');
        const text = link.querySelector('.lbl text')?.textContent?.trim();
        const r = lbl.getBoundingClientRect();
        return { text, left: r.left, right: r.right, top: r.top, bottom: r.bottom };
      });

      const colliding = [];
      for (let i = 0; i < rects.length; i++) {
        for (let j = i + 1; j < rects.length; j++) {
          const a = rects[i];
          const b = rects[j];
          // Check AABB intersection
          const isOverlapping = !(
            a.right < b.left ||
            a.left > b.right ||
            a.bottom < b.top ||
            a.top > b.bottom
          );
          if (isOverlapping) {
            colliding.push(`${a.text} overlaps with ${b.text}`);
          }
        }
      }
      return colliding;
    });

    console.log(`At time ${time}s, label overlaps count: ${overlaps.length}`, overlaps);
  }

  await browser.close();
}

testOverlaps();

