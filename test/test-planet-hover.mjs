import { chromium } from '@playwright/test';

async function testPlanetHover() {
  const browser = await chromium.launch();
  const page = await browser.newPage({ viewport: { width: 1280, height: 800 } });
  await page.goto('http://localhost:4000', { waitUntil: 'networkidle' });

  // Expected radii for rings
  const expectedRadii = {
    'Jarvis': 84,
    'Stock Analyzer': 84,
    'q-live': 140,
    'AI Chat': 140,
    'Perf Engine': 140,
    'Angular Architecture': 196,
    'Web Performance': 196,
    'Payments': 196,
    'AEM Images': 196,
  };

  const results = await page.evaluate(async (expected) => {
    const links = Array.from(document.querySelectorAll('.planet-link'));
    const svg = document.getElementById('orbit-svg');
    const svgRect = svg.getBoundingClientRect();
    const scale = 460 / svgRect.width;
    const centerSvg = { x: 230, y: 230 };

    const checks = [];

    for (const link of links) {
      const dot = link.querySelector('.planet-dot');
      const labelText = link.querySelector('.lbl text')?.textContent?.trim();

      // Trigger hover
      link.dispatchEvent(new MouseEvent('mouseenter', { bubbles: true }));
      link.dispatchEvent(new MouseEvent('mouseover', { bubbles: true }));

      // Record centre 1
      const r1 = dot.getBoundingClientRect();
      const c1 = {
        x: (r1.left + r1.width / 2 - svgRect.left) * scale,
        y: (r1.top + r1.height / 2 - svgRect.top) * scale,
      };

      // Wait 500ms
      await new Promise((resolve) => setTimeout(resolve, 500));

      // Record centre 2
      const r2 = dot.getBoundingClientRect();
      const c2 = {
        x: (r2.left + r2.width / 2 - svgRect.left) * scale,
        y: (r2.top + r2.height / 2 - svgRect.top) * scale,
      };

      const drift = Math.hypot(c2.x - c1.x, c2.y - c1.y);
      const distFromCore = Math.hypot(c1.x - centerSvg.x, c1.y - centerSvg.y);
      const expRadius = expected[labelText] || 0;
      const radiusDiff = Math.abs(distFromCore - expRadius);

      checks.push({
        label: labelText,
        drift: drift.toFixed(3),
        distFromCore: distFromCore.toFixed(2),
        expectedRadius: expRadius,
        radiusDiff: radiusDiff.toFixed(2),
        pausedMatchWithin1px: drift <= 1.0,
        radiusMatchWithin1px: radiusDiff <= 1.0,
      });

      link.dispatchEvent(new MouseEvent('mouseleave', { bubbles: true }));
    }

    return checks;
  }, expectedRadii);

  console.log('Planet hover test results:');
  results.forEach(r => {
    console.log(`  ${r.label}: drift=${r.drift}px, dist=${r.distFromCore}px (expected ${r.expectedRadius}px, diff=${r.radiusDiff}px) -> pausedMatch: ${r.pausedMatchWithin1px}, radiusMatch: ${r.radiusMatchWithin1px}`);
  });

  await browser.close();
}

testPlanetHover();

