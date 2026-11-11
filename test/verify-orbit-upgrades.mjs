import { chromium } from '@playwright/test';

async function verifyOrbitUpgrades() {
  console.log('--- STARTING PROJECT ORBIT UPGRADES VERIFICATION ---');
  let failures = 0;

  const browser = await chromium.launch();
  const page = await browser.newPage({ viewport: { width: 1280, height: 800 } });
  await page.goto('http://localhost:4000', { waitUntil: 'networkidle' });

  // TEST 1: PLANET HOVER PAUSE & DISTANCE FROM ORBIT CENTRE
  console.log('\n[TEST 1] Planet hover pause and distance from orbit centre...');
  try {
    const link = page.locator('.planet-link').first();
    await link.hover({ force: true });
    await page.waitForTimeout(400);

    const dot = page.locator('.planet-dot').first();
    const b1 = await dot.boundingBox();
    const c1 = { x: b1.x + b1.width / 2, y: b1.y + b1.height / 2 };

    await page.waitForTimeout(500);

    const b2 = await dot.boundingBox();
    const c2 = { x: b2.x + b2.width / 2, y: b2.y + b2.height / 2 };

    const drift = Math.hypot(c2.x - c1.x, c2.y - c1.y);
    console.log(`  Hover paused drift over 500ms: ${drift.toFixed(3)}px (threshold: <= 1.0px)`);
    if (drift > 1.0) {
      console.error(`  FAIL: Planet drift ${drift}px exceeds 1.0px`);
      failures++;
    } else {
      console.log('  PASS: Planet remains stationary while hovered.');
    }

    // Verify distance from orbit centre matches ring radius (84px for product ring) within 1px
    const radiusCheck = await page.evaluate(() => {
      const svg = document.querySelector('#orbit-svg');
      const hub = document.querySelector('.hub');
      // Store current hub transform and temporarily neutralize 3D perspective to test undistorted geometry
      const prevTransform = hub.style.transform;
      hub.style.transform = 'none';

      const dot = document.querySelector('.planet-dot');
      const core = document.querySelector('.sun-core-dot');
      const bDot = dot.getBoundingClientRect();
      const bCore = core.getBoundingClientRect();
      const scale = 460 / svg.getBoundingClientRect().width;

      const dist = Math.hypot(
        (bDot.left + bDot.width / 2) - (bCore.left + bCore.width / 2),
        (bDot.top + bDot.height / 2) - (bCore.top + bCore.height / 2)
      ) * scale;

      hub.style.transform = prevTransform;
      return dist;
    });

    console.log(`  Distance from orbit centre: ${radiusCheck.toFixed(2)} units (expected: 84 units)`);
    if (Math.abs(radiusCheck - 84) > 1.0) {
      console.error(`  FAIL: Distance ${radiusCheck} deviates from radius 84 by > 1.0px`);
      failures++;
    } else {
      console.log('  PASS: Distance from orbit centre strictly matches ring radius.');
    }
  } catch (err) {
    console.error('  FAIL: Test 1 threw an error:', err);
    failures++;
  }

  // TEST 2: LABEL UPRIGHT AND ATTACHED AT 0s, 3s, 7s
  console.log('\n[TEST 2] Label upright and attached at 0s, 3s, 7s...');
  try {
    for (const timeWait of [0, 3000, 4000]) {
      if (timeWait > 0) {
        await page.waitForTimeout(timeWait);
      }
      const labelStats = await page.evaluate(() => {
        const labels = Array.from(document.querySelectorAll('.planet-link')).map(link => {
          const dot = link.querySelector('.planet-dot');
          const rect = link.querySelector('.lbl rect');
          const bDot = dot.getBoundingClientRect();
          const bRect = rect.getBoundingClientRect();
          const dotCenter = { x: bDot.left + bDot.width / 2, y: bDot.top + bDot.height / 2 };
          const rectCenter = { x: bRect.left + bRect.width / 2, y: bRect.top + bRect.height / 2 };
          const svg = document.querySelector('#orbit-svg');
          const scale = 460 / svg.getBoundingClientRect().width;
          const dist = Math.hypot(rectCenter.x - dotCenter.x, rectCenter.y - dotCenter.y) * scale;
          const text = link.querySelector('text')?.textContent?.trim();
          return { text, dist, rectWidth: bRect.width, rectHeight: bRect.height };
        });
        return labels;
      });

      console.log(`  Sampled at elapsed time interval (planets count: ${labelStats.length}):`);
      for (const item of labelStats) {
        if (Math.abs(item.dist - 24) > 2.0) {
          console.error(`    FAIL: ${item.text} label offset ${item.dist.toFixed(2)} deviates from 24 by > 2.0px`);
          failures++;
        }
      }
      console.log(`  PASS: All labels attached at offset 24 units (+/- 2px).`);
    }
  } catch (err) {
    console.error('  FAIL: Test 2 threw an error:', err);
    failures++;
  }

  // TEST 3: NO LABEL OVERLAPS AT 0s, 3s, 7s (1280px desktop)
  console.log('\n[TEST 3] No label overlaps at 0s, 3s, 7s...');
  try {
    for (const timeWait of [0, 3000, 4000]) {
      if (timeWait > 0) {
        await page.waitForTimeout(timeWait);
      }
      const overlapCount = await page.evaluate(() => {
        const rects = Array.from(document.querySelectorAll('.lbl rect')).map(r => r.getBoundingClientRect());
        let collisions = 0;
        for (let i = 0; i < rects.length; i++) {
          for (let j = i + 1; j < rects.length; j++) {
            const a = rects[i];
            const b = rects[j];
            const overlap = !(a.right < b.left || a.left > b.right || a.bottom < b.top || a.top > b.bottom);
            if (overlap) collisions++;
          }
        }
        return collisions;
      });

      console.log(`  Collisions detected at interval: ${overlapCount}`);
      if (overlapCount > 0) {
        console.error(`  FAIL: ${overlapCount} label overlap(s) detected!`);
        failures++;
      } else {
        console.log('  PASS: 0 label overlaps detected.');
      }
    }
  } catch (err) {
    console.error('  FAIL: Test 3 threw an error:', err);
    failures++;
  }

  // TEST 4: CENTRE PHOTO REMOVED, SUN CORE GLOWING, FOCUSABLE, SCROLLS TO ABOUT
  console.log('\n[TEST 4] Centre node: no photo, plain sun core, interactive...');
  try {
    const centreCheck = await page.evaluate(() => {
      const core = document.querySelector('#orbit-core');
      const svg = document.querySelector('#orbit-svg');
      const hasImage = !!core.querySelector('image') || !!svg.querySelector('image');
      const hasClipPath = !!core.querySelector('clipPath') || !!svg.querySelector('clipPath[id*="avatar"]');
      const textContent = core.textContent?.trim() || '';
      const hasHalo = !!svg.querySelector('.core-halo');
      const hasDot = !!core.querySelector('.sun-core-dot');
      const hasRing = !!core.querySelector('.core-ring');
      const role = core.getAttribute('role');
      const ariaLabel = core.getAttribute('aria-label');
      const tabIndex = core.getAttribute('tabindex');

      return {
        hasImage,
        hasClipPath,
        textContent,
        hasHalo,
        hasDot,
        hasRing,
        role,
        ariaLabel,
        tabIndex,
      };
    });

    console.log('  Centre check details:', centreCheck);
    if (centreCheck.hasImage) {
      console.error('  FAIL: Centre still contains an <image>');
      failures++;
    }
    if (centreCheck.hasClipPath) {
      console.error('  FAIL: Centre still contains avatar <clipPath>');
      failures++;
    }
    if (centreCheck.textContent.length > 0) {
      console.error(`  FAIL: Centre has text: "${centreCheck.textContent}"`);
      failures++;
    }
    if (!centreCheck.hasHalo || !centreCheck.hasDot || !centreCheck.hasRing) {
      console.error('  FAIL: Sun core structure missing halo, dot, or ring');
      failures++;
    }
    if (centreCheck.role !== 'link' || centreCheck.ariaLabel !== 'Prathyusha Sadhu, about me') {
      console.error('  FAIL: Centre link role or aria-label mismatch');
      failures++;
    }

    // Verify hover tip text
    await page.locator('#orbit-core').hover();
    await page.waitForTimeout(200);
    const tipText = await page.locator('.tip').innerText();
    console.log(`  Centre tip text on hover: "${tipText.replace(/\n/g, ' ')}"`);
    if (!tipText.includes('Prathyusha Sadhu') || !tipText.includes('Senior Frontend Engineer')) {
      console.error('  FAIL: Tip text does not show "Prathyusha Sadhu · Senior Frontend Engineer"');
      failures++;
    } else {
      console.log('  PASS: Centre node has correct caption on hover.');
    }

    // Verify click scrolls to #about
    await page.evaluate(() => window.scrollTo(0, 0));
    await page.waitForTimeout(100);
    await page.locator('#orbit-core').click();
    await page.waitForTimeout(600);
    const scrollY = await page.evaluate(() => window.scrollY);
    console.log(`  Scroll position after clicking core: ${scrollY}px`);
    if (scrollY === 0) {
      console.error('  FAIL: Page did not scroll to #about on core click');
      failures++;
    } else {
      console.log('  PASS: Smooth scroll to #about triggered successfully.');
    }
  } catch (err) {
    console.error('  FAIL: Test 4 threw an error:', err);
    failures++;
  }

  // TEST 5: VIEWPORT 390px (MOBILE) - LABELS HIDDEN, ALL 9 CHIPS PRESENT
  console.log('\n[TEST 5] Viewport 390px mobile layout...');
  try {
    const mobilePage = await browser.newPage({ viewport: { width: 390, height: 844 } });
    await mobilePage.goto('http://localhost:4000', { waitUntil: 'networkidle' });

    const mobileCheck = await mobilePage.evaluate(() => {
      const labels = Array.from(document.querySelectorAll('.lbl'));
      const visibleLabels = labels.filter(el => {
        const style = window.getComputedStyle(el);
        return style.display !== 'none' && style.visibility !== 'hidden' && style.opacity !== '0';
      });

      const chips = Array.from(document.querySelectorAll('.legend-chips .chip')).map(c => c.textContent?.trim());

      return {
        totalLabels: labels.length,
        visibleLabelsCount: visibleLabels.length,
        chips,
      };
    });

    console.log(`  Mobile visible labels count: ${mobileCheck.visibleLabelsCount} (expected: 0)`);
    if (mobileCheck.visibleLabelsCount !== 0) {
      console.error(`  FAIL: Expected 0 visible labels at 390px, found ${mobileCheck.visibleLabelsCount}`);
      failures++;
    } else {
      console.log('  PASS: All SVG planet labels hidden under 640px.');
    }

    const expectedLabels = [
      'Jarvis',
      'Stock Analyzer',
      'q-live',
      'AI Chat',
      'Perf Engine',
      'Angular Architecture',
      'Web Performance',
      'Payments',
      'AEM Images',
    ];

    console.log(`  Legend chips found (${mobileCheck.chips.length}):`, mobileCheck.chips);
    const missing = expectedLabels.filter(name => !mobileCheck.chips.includes(name));
    if (missing.length > 0) {
      console.error('  FAIL: Missing legend chips:', missing);
      failures++;
    } else {
      console.log('  PASS: All 9 exact project names present in legend chips.');
    }

    await mobilePage.close();
  } catch (err) {
    console.error('  FAIL: Test 5 threw an error:', err);
    failures++;
  }

  await browser.close();

  console.log('\n----------------------------------------------------');
  if (failures === 0) {
    console.log('>>> ALL VERIFICATION CHECKS PASSED (0 FAILURES) <<<');
  } else {
    console.error(`>>> VERIFICATION COMPLETED WITH ${failures} FAILURE(S) <<<`);
    process.exit(1);
  }
}

verifyOrbitUpgrades();

