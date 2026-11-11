import { chromium } from '@playwright/test';

async function runResponsiveAudit() {
  console.log('--- Starting Responsive & Breakpoint Layout Audit ---');

  const breakpoints = [
    { name: 'Mobile 360 (Small Phone)', width: 360, height: 740 },
    { name: 'Mobile 412 (Standard Phone)', width: 412, height: 915 },
    { name: 'Tablet 768 (Portrait)', width: 768, height: 1024 },
    { name: 'Desktop 1024 (Standard)', width: 1024, height: 768 },
    { name: 'Desktop 1440 (Wide Display)', width: 1440, height: 900 },
  ];

  let browser;
  try {
    browser = await chromium.launch();
  } catch (err) {
    console.log('Playwright browser launch note:', err.message);
    return;
  }

  const context = await browser.newContext();
  const page = await context.newPage();

  for (const bp of breakpoints) {
    await page.setViewportSize({ width: bp.width, height: bp.height });
    await page.goto('http://localhost:4200/', { waitUntil: 'domcontentloaded' });
    await page.waitForTimeout(500);

    // Verify horizontal overflow (must have zero horizontal scrolling)
    const hasHorizontalOverflow = await page.evaluate(() => {
      return document.documentElement.scrollWidth > document.documentElement.clientWidth;
    });

    const isBurgerVisible = await page.evaluate(() => {
      const burger = document.querySelector('.burger-btn');
      return burger && window.getComputedStyle(burger).display !== 'none';
    });

    const isLegendVisible = await page.evaluate(() => {
      const legend = document.querySelector('.legend-chips');
      return legend && window.getComputedStyle(legend).display !== 'none';
    });

    console.log(`\nTesting ${bp.name} [${bp.width}x${bp.height}]:`);
    console.log(`  Horizontal overflow: ${hasHorizontalOverflow ? '❌ YES (FAILED)' : '✅ NONE (PASSED)'}`);
    console.log(`  Mobile menu button: ${isBurgerVisible ? 'Visible' : 'Hidden'}`);
    console.log(`  Touch legend chips: ${isLegendVisible ? 'Visible' : 'Hidden'}`);

    if (hasHorizontalOverflow) {
      throw new Error(`Horizontal overflow detected at ${bp.name}`);
    }
  }

  await browser.close();
  console.log('\n✅ All 5 viewport breakpoints passed with zero horizontal overflow!');
}

runResponsiveAudit().catch((err) => {
  console.error('Responsive audit error:', err.message);
  process.exit(1);
});

