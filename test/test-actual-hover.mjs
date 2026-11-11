import { chromium } from '@playwright/test';

async function testActualHover() {
  const browser = await chromium.launch();
  const page = await browser.newPage({ viewport: { width: 1280, height: 800 } });
  await page.goto('http://localhost:4000', { waitUntil: 'networkidle' });

  // Get planet link
  const link = page.locator('.planet-link').first();
  const box = await link.boundingBox();
  console.log('Hovering planet link at', box.x, box.y);

  // Hover over the planet link with actual mouse
  await page.mouse.move(box.x + box.width / 2, box.y + box.height / 2);
  await page.waitForTimeout(200);

  // Check animation-play-state of the orbit group and label
  const states = await page.evaluate(() => {
    const group = document.querySelector('.orbit-group');
    const lbl = document.querySelector('.lbl');
    return {
      group: window.getComputedStyle(group).animationPlayState,
      lbl: window.getComputedStyle(lbl).animationPlayState,
    };
  });
  console.log('Animation play states on hover:', states);

  // Measure center, wait 500ms, measure again
  const dot = page.locator('.planet-dot').first();
  const b1 = await dot.boundingBox();
  const c1 = { x: b1.x + b1.width / 2, y: b1.y + b1.height / 2 };

  await page.waitForTimeout(500);

  const b2 = await dot.boundingBox();
  const c2 = { x: b2.x + b2.width / 2, y: b2.y + b2.height / 2 };

  const drift = Math.hypot(c2.x - c1.x, c2.y - c1.y);
  console.log('Drift after 500ms while hovered:', drift);

  // Check distance from orbit centre
  const core = page.locator('.sun-core-dot');
  const coreBox = await core.boundingBox();
  const coreCenter = { x: coreBox.x + coreBox.width / 2, y: coreBox.y + coreBox.height / 2 };

  const dist = Math.hypot(c1.x - coreCenter.x, c1.y - coreCenter.y);
  console.log('Screen distance from core center:', dist);

  // Also convert to SVG viewBox units
  const svgBox = await page.locator('#orbit-svg').boundingBox();
  const scale = 460 / svgBox.width;
  const viewBoxDist = dist * scale;
  console.log('ViewBox distance from core center:', viewBoxDist, '(expected 84)');

  await browser.close();
}

testActualHover();

