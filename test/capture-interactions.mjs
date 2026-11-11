import { chromium } from '@playwright/test';

async function capture() {
  const browser = await chromium.launch();
  const page = await browser.newPage({ viewport: { width: 1440, height: 900 } });
  await page.goto('http://localhost:4200', { waitUntil: 'networkidle' });

  // 1. Expanded greeting bubble screenshot (t=1.2s before collapse)
  await page.waitForTimeout(1000);
  await page.screenshot({ path: 'test/screenshots/hero-greeting-expanded.png' });
  console.log('Saved: test/screenshots/hero-greeting-expanded.png');

  // 2. Scroll past 60% hero height and capture floating avatar
  await page.evaluate(() => window.scrollTo({ top: 1100, behavior: 'instant' }));
  await page.waitForTimeout(400);
  await page.screenshot({ path: 'test/screenshots/floating-avatar-scrolled.png' });
  console.log('Saved: test/screenshots/floating-avatar-scrolled.png');

  // 3. Open Orbi assistant and capture dialog
  await page.locator('.floating-avatar-launcher').click();
  await page.waitForTimeout(400);
  await page.screenshot({ path: 'test/screenshots/orbi-dialog-open.png' });
  console.log('Saved: test/screenshots/orbi-dialog-open.png');

  await browser.close();
}

capture();
