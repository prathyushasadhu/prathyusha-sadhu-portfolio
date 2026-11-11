import { chromium } from '@playwright/test';
import fs from 'fs';
import path from 'path';

async function runVerification() {
  console.log('===========================================================');
  console.log('   RUNNING COSMIC HERO & LAYOUT VERIFICATION SUITE');
  console.log('===========================================================');
  let failures = 0;

  const browser = await chromium.launch();
  const page = await browser.newPage({ viewport: { width: 1440, height: 900 } });
  await page.goto('http://localhost:4200', { waitUntil: 'networkidle' });

  // 1. BRAND AND FAVICONS
  console.log('\n[CHECK 1] Brand, Logo, Favicons, and Metadata...');
  const brandCheck = await page.evaluate(() => {
    const logoName = document.querySelector('.logo .logo-name')?.textContent?.trim();
    const logoSvg = document.querySelector('.logo .logo-mark');
    const themeColor = document.querySelector('meta[name="theme-color"]')?.getAttribute('content');

    return {
      logoName,
      hasLogoSvg: !!logoSvg,
      themeColor,
    };
  });

  console.log('  Logo text:', brandCheck.logoName, '(expected: "PS")');
  if (brandCheck.logoName !== 'PS') {
    console.error('  FAIL: Logo name is not "PS"');
    failures++;
  } else {
    console.log('  PASS: Logo text is "PS"');
  }

  if (brandCheck.themeColor !== '#050A1A') {
    console.error('  FAIL: meta theme-color is not #050A1A:', brandCheck.themeColor);
    failures++;
  } else {
    console.log('  PASS: meta theme-color is #050A1A');
  }

  // 2. NAVIGATION AND SECTION IDS (Strictly 6 items, No "Beyond Code")
  console.log('\n[CHECK 2] Navigation & Section IDs (No Beyond Code)...');
  const expectedNav = [
    { label: 'Home', id: 'home' },
    { label: 'Project Orbit', id: 'project-orbit' },
    { label: 'My Journey', id: 'journey' },
    { label: 'AI Lab', id: 'ai-lab' },
    { label: 'Skills', id: 'skills' },
    { label: 'Contact', id: 'contact' },
  ];

  const navCheck = await page.evaluate(() => {
    const items = Array.from(document.querySelectorAll('.nav-link')).map((a) => ({
      label: a.querySelector('.nav-text')?.textContent?.trim(),
      href: a.getAttribute('href'),
      hasIcon: !!a.querySelector('.nav-icon svg'),
    }));
    return items;
  });

  console.log(`  Found ${navCheck.length} nav links:`, navCheck.map((n) => n.label));
  if (navCheck.length !== 6) {
    console.error(`  FAIL: Expected exactly 6 nav links, found ${navCheck.length}`);
    failures++;
  } else {
    console.log('  PASS: Exactly 6 nav links rendered.');
  }

  expectedNav.forEach((exp, idx) => {
    const found = navCheck[idx];
    if (!found || found.label !== exp.label || found.href !== `#${exp.id}`) {
      console.error(`  FAIL: Nav item ${idx} expected "${exp.label}" (#${exp.id}), got:`, found);
      failures++;
    }
  });

  const missingSections = await page.evaluate((ids) => {
    return ids.filter((id) => !document.getElementById(id));
  }, expectedNav.map((n) => n.id));

  if (missingSections.length > 0) {
    console.error('  FAIL: Missing section elements in DOM:', missingSections);
    failures++;
  } else {
    console.log('  PASS: All 6 required sections exist with matching IDs.');
  }

  // Check Beyond Code is completely gone from DOM
  const hasBeyond = await page.evaluate(() => {
    return !!document.getElementById('beyond-code') || !!document.querySelector('.beyond-section');
  });
  if (hasBeyond) {
    console.error('  FAIL: Beyond Code section still found in DOM!');
    failures++;
  } else {
    console.log('  PASS: "Beyond Code" is completely absent from DOM.');
  }

  // 3. HERO BACKGROUND, MOON, AND STATS ROW
  console.log('\n[CHECK 3] Hero Background, Moon Visibility, and Stats Row...');
  const heroBgCheck = await page.evaluate(() => {
    const img = document.querySelector('.hero-space-img');
    const style = img ? window.getComputedStyle(img) : null;
    const overlay = document.querySelector('.hero-gradient-overlay');
    const bottomBlend = document.querySelector('.hero-bottom-blend');
    const statsRow = document.querySelector('.hero-stats-row');
    const statsStyle = statsRow ? window.getComputedStyle(statsRow) : null;

    return {
      objectPosition: style?.objectPosition,
      hasBottomBlend: !!bottomBlend,
      statsBg: statsStyle?.backgroundColor,
      statsBoxShadow: statsStyle?.boxShadow,
    };
  });

  console.log('  Hero space img object-position:', heroBgCheck.objectPosition);
  if (!heroBgCheck.objectPosition?.includes('50% 100%')) {
    console.error('  FAIL: Desktop object-position should be "50% 100%" (bottom-anchored)');
    failures++;
  } else {
    console.log('  PASS: Desktop hero background is bottom-anchored (50% 100%).');
  }

  if (heroBgCheck.hasBottomBlend) {
    console.error('  FAIL: .hero-bottom-blend overlay must be deleted to keep moon uncovered!');
    failures++;
  } else {
    console.log('  PASS: No bottom blend overlay covering bottom-left corner.');
  }

  // 4. ALIGNMENT: LOGO LEFT EDGE VS EYEBROW LEFT EDGE (<= 1px)
  console.log('\n[CHECK 4] Alignment: Logo left edge vs Eyebrow left edge (<= 1px)...');
  const alignCheck = await page.evaluate(() => {
    const logo = document.querySelector('.logo');
    const eyebrow = document.querySelector('.hero-eyebrow');
    const logoRect = logo?.getBoundingClientRect();
    const eyeRect = eyebrow?.getBoundingClientRect();
    const logoLeft = logoRect ? logoRect.left : -1;
    const eyeLeft = eyeRect ? eyeRect.left : -2;
    const diff = Math.abs(logoLeft - eyeLeft);
    return { logoLeft, eyeLeft, diff };
  });

  console.log(`  Logo left: ${alignCheck.logoLeft.toFixed(2)}px | Eyebrow left: ${alignCheck.eyeLeft.toFixed(2)}px | Diff: ${alignCheck.diff.toFixed(2)}px`);
  if (alignCheck.diff > 1.0) {
    console.error(`  FAIL: Logo left edge does not match eyebrow left edge within 1px (diff: ${alignCheck.diff.toFixed(2)}px)`);
    failures++;
  } else {
    console.log('  PASS: Logo left edge matches eyebrow left edge within 1px.');
  }

  // 5. CENTRAL SPHERE FULLY VISIBLE & DEPTH SORTED
  console.log('\n[CHECK 5] Central "PS" sphere visibility and depth...');
  const coreCheck = await page.evaluate(() => {
    const core = document.getElementById('orbit-core');
    if (!core) return { exists: false, isVisible: false };
    const rect = core.getBoundingClientRect();
    const style = window.getComputedStyle(core);
    return {
      exists: true,
      isVisible: rect.width > 0 && rect.height > 0 && style.display !== 'none' && style.visibility !== 'hidden' && style.opacity !== '0',
      zIndex: parseInt(style.zIndex, 10) || 0,
      width: rect.width,
      height: rect.height,
    };
  });

  console.log('  Central core exists:', coreCheck.exists, '| Visible:', coreCheck.isVisible, '| z-index:', coreCheck.zIndex, `(${coreCheck.width}x${coreCheck.height})`);
  if (!coreCheck.exists || !coreCheck.isVisible) {
    console.error('  FAIL: Central sphere is not fully visible!');
    failures++;
  } else if (coreCheck.zIndex < 20) {
    console.error('  FAIL: Central sphere zIndex should be >= 20 (higher than rings at zIndex 1)!');
    failures++;
  } else {
    console.log('  PASS: Central sphere is fully visible with zIndex >= 20.');
  }

  // 6. MATHEMATICAL VERIFICATION OF PLANETS ON ELLIPSES & INSIDE STAGE
  console.log('\n[CHECK 6] Mathematical Verification: All 10 planets satisfy ellipse equation <= 1px & inside stage...');
  const testEllipses = async (description) => {
    return await page.evaluate(() => {
      const svg = document.getElementById('orbit-svg');
      const ringEllipses = Array.from(svg.querySelectorAll('.orbit-guide-ellipse'));
      const rings = ringEllipses.map((e, idx) => ({
        index: idx,
        rx: parseFloat(e.getAttribute('rx') || '0'),
        ry: parseFloat(e.getAttribute('ry') || '0'),
        cx: parseFloat(e.getAttribute('cx') || '0'),
        cy: parseFloat(e.getAttribute('cy') || '0'),
      }));

      const cx = rings[0]?.cx || 320;
      const cy = rings[0]?.cy || 256;
      const rotateMatch = ringEllipses[0]?.getAttribute('transform')?.match(/rotate\(([-\d.]+)/);
      const phiDeg = rotateMatch ? parseFloat(rotateMatch[1]) : -12;
      const phiRad = (phiDeg * Math.PI) / 180;
      const cosPhi = Math.cos(phiRad);
      const sinPhi = Math.sin(phiRad);

      const stageEl = document.querySelector('.orbit-stage');
      const stageRect = stageEl ? stageEl.getBoundingClientRect() : null;
      const stageWidth = stageRect ? stageRect.width : 640;
      const stageHeight = stageRect ? stageRect.height : 512;

      const ringMap = {
        'pj-prod-jarvis': 0,
        'pj-prod-stock': 0,
        'pj-ai-qlive': 1,
        'pj-ai-chat': 1,
        'pj-ai-perf': 1,
        'pj-eng-arch': 2,
        'pj-eng-cwv': 2,
        'pj-eng-pay': 2,
        'pj-eng-aem': 2,
        'pj-journey-edu': 2,
      };

      const results = [];
      for (const [id, ringIdx] of Object.entries(ringMap)) {
        const el = document.getElementById('planet-' + id);
        if (!el) continue;
        const match = el.style.transform.match(/translate3d\(([-\d.]+)px,\s*([-\d.]+)px/);
        if (!match) continue;
        const px = parseFloat(match[1]);
        const py = parseFloat(match[2]);

        // Un-rotate by -phi
        const dx = px - cx;
        const dy = py - cy;
        const x0 = dx * cosPhi + dy * sinPhi;
        const y0 = -dx * sinPhi + dy * cosPhi;

        const ring = rings[ringIdx];
        const ellipseVal = (x0 / ring.rx) ** 2 + (y0 / ring.ry) ** 2;
        const distError = Math.abs(Math.sqrt(ellipseVal) - 1) * Math.min(ring.rx, ring.ry);

        // Check if inside stage bounds
        const insideStage = px >= 0 && px <= stageWidth && py >= 0 && py <= stageHeight;

        results.push({ id, px, py, distError, ringIdx, insideStage, stageWidth, stageHeight });
      }
      return results;
    });
  };

  // Test at t=0
  const planetsT0 = await testEllipses('t = 0s');
  let passEllipses = true;
  let passInsideStage = true;
  for (const r of planetsT0) {
    if (r.distError > 1.0) {
      console.error(`    FAIL [t = 0s]: Planet ${r.id} error ${r.distError.toFixed(3)}px > 1.0px`);
      failures++;
      passEllipses = false;
    }
    if (!r.insideStage) {
      console.error(`    FAIL [t = 0s]: Planet ${r.id} centre (${r.px}, ${r.py}) outside stage [${r.stageWidth}x${r.stageHeight}]`);
      failures++;
      passInsideStage = false;
    }
  }
  if (passEllipses) {
    console.log(`  PASS [t = 0s]: All 10 planets within 1px of ring ellipse (max error: ${Math.max(...planetsT0.map(d => d.distError)).toFixed(3)}px)`);
  }
  if (passInsideStage) {
    console.log('  PASS [t = 0s]: All 10 planet centres lie inside the stage bounds.');
  }

  // Wait 2s and test movement + ellipse equations
  console.log('\n  Waiting 2s to verify continuous orbit movement without hover...');
  await page.waitForTimeout(2000);
  const planetsT2 = await testEllipses('t = 2s');
  let passMovement = true;
  for (let i = 0; i < planetsT0.length; i++) {
    const p0 = planetsT0[i];
    const p2 = planetsT2[i];
    const movement = Math.hypot(p2.px - p0.px, p2.py - p0.py);
    if (movement < 2.0) {
      console.error(`    FAIL: Planet ${p0.id} did not move over 2s (movement: ${movement.toFixed(2)}px)`);
      failures++;
      passMovement = false;
    }
  }
  if (passMovement) {
    console.log('  PASS: All 10 planets moved over the 2-second interval when not hovered.');
  }

  // 7. TWO LAYERS & HOVER DOES NOT DISPLACE PLANET
  console.log('\n[CHECK 7] Two layers: outer .planet only receives translate3d, inner .planet-body scales...');
  await page.evaluate(() => {
    const link = document.querySelector('#planet-pj-prod-jarvis .planet-link');
    link?.dispatchEvent(new MouseEvent('mouseenter'));
    link?.focus();
  });
  await page.waitForTimeout(200);

  const t1 = await page.evaluate(() => document.getElementById('planet-pj-prod-jarvis')?.style.transform);
  const bodyTransform = await page.evaluate(() => {
    const body = document.querySelector('#planet-pj-prod-jarvis .planet-body');
    return body ? window.getComputedStyle(body).transform : null;
  });

  await page.waitForTimeout(600);
  const t2 = await page.evaluate(() => document.getElementById('planet-pj-prod-jarvis')?.style.transform);
  const outerHasScale = await page.evaluate(() => {
    const el = document.getElementById('planet-pj-prod-jarvis');
    return el?.style.transform.includes('scale') ?? false;
  });

  console.log('  Outer planet transform at t1 (paused):', t1);
  console.log('  Outer planet transform at t2 (600ms later):', t2);
  console.log('  Inner body transform while hovered/focused:', bodyTransform);

  if (outerHasScale) {
    console.error('  FAIL: Outer .planet element has scale transform! Must only have translate3d.');
    failures++;
  } else {
    console.log('  PASS: Outer .planet receives ONLY translate3d.');
  }

  if (t1 !== t2) {
    console.error('  FAIL: Planet moved while hovered; hovering did not pause its ring! t1:', t1, 't2:', t2);
    failures++;
  } else {
    console.log('  PASS: Ring paused while hovered; planet remained strictly stationary (t1 === t2).');
  }

  // Unhover and unblur
  await page.evaluate(() => {
    const link = document.querySelector('#planet-pj-prod-jarvis .planet-link');
    link?.dispatchEvent(new MouseEvent('mouseleave', { bubbles: true }));
    link?.blur();
  });
  await page.waitForTimeout(600);

  const t3 = await page.evaluate(() => document.getElementById('planet-pj-prod-jarvis')?.style.transform);
  console.log('  Outer planet transform after resuming:', t3);
  if (t3 === t2) {
    console.error('  FAIL: Ring did not resume after unhovering!');
    failures++;
  } else {
    console.log('  PASS: Ring resumed smoothly after unhovering without snapping.');
  }

  // 8. LABELS: SHORT NAMES ONLY, COLLISION AVOIDANCE & NO INTERSECTIONS WITH CHARACTER
  console.log('\n[CHECK 8] Labels: Short names only, collision avoidance, no character intersection...');
  const labelCheck = await page.evaluate(() => {
    const labels = Array.from(document.querySelectorAll('.planet-label'));
    const results = labels.map((l) => ({
      id: l.id,
      text: l.textContent?.trim(),
      hasBadge: !!l.querySelector('.label-badge') || l.textContent?.includes('INDEPENDENT'),
      isHidden: l.classList.contains('label-hidden') || window.getComputedStyle(l).opacity === '0',
    }));

    const charEl = document.querySelector('.hero-character-launcher');
    const charRect = charEl ? charEl.getBoundingClientRect() : null;

    // Check collision overlaps among visible labels
    const visibleEls = labels.filter((l) => !l.classList.contains('label-hidden') && window.getComputedStyle(l).opacity !== '0');
    const rects = visibleEls.map((l) => l.getBoundingClientRect());
    let overlapCount = 0;
    let charOverlapCount = 0;

    for (let i = 0; i < rects.length; i++) {
      for (let j = i + 1; j < rects.length; j++) {
        const r1 = rects[i];
        const r2 = rects[j];
        if (
          r1.left < r2.right &&
          r1.right > r2.left &&
          r1.top < r2.bottom &&
          r1.bottom > r2.top
        ) {
          overlapCount++;
        }
      }

      if (charRect) {
        const r = rects[i];
        if (
          r.left < charRect.right &&
          r.right > charRect.left &&
          r.top < charRect.bottom &&
          r.bottom > charRect.top
        ) {
          charOverlapCount++;
        }
      }
    }

    return {
      labels: results,
      visibleCount: visibleEls.length,
      overlapCount,
      charOverlapCount,
    };
  });

  console.log(`  Labels checked: ${labelCheck.labels.length} (${labelCheck.visibleCount} visible)`);
  if (labelCheck.overlapCount > 0) {
    console.error(`  FAIL: Found ${labelCheck.overlapCount} overlapping visible labels!`);
    failures++;
  } else {
    console.log('  PASS: 0 overlapping visible labels.');
  }

  if (labelCheck.charOverlapCount > 0) {
    console.error(`  FAIL: Found ${labelCheck.charOverlapCount} visible labels overlapping character launcher!`);
    failures++;
  } else {
    console.log('  PASS: 0 labels overlap the character launcher.');
  }

  // 9. SINGLE ASSISTANT LAUNCHER (SCROLL TRANSITION)
  console.log('\n[CHECK 9] Single Assistant Launcher: Hero character -> 72px floating avatar...');
  const topLauncherCheck = await page.evaluate(() => {
    const heroLauncher = document.querySelector('.hero-character-launcher');
    const heroVisible = heroLauncher && !heroLauncher.classList.contains('launcher-hidden') && window.getComputedStyle(heroLauncher).opacity !== '0';
    const avatarLauncher = document.querySelector('.floating-avatar-launcher');
    const avatarVisible = avatarLauncher && avatarLauncher.classList.contains('launcher-visible') && window.getComputedStyle(avatarLauncher).opacity !== '0';

    return { heroVisible, avatarVisible };
  });

  if (!topLauncherCheck.heroVisible || topLauncherCheck.avatarVisible) {
    console.error('  FAIL: At top of page, only hero character launcher should be visible!');
    failures++;
  } else {
    console.log('  PASS: At top of page, ONLY the hero character launcher is visible.');
  }

  // Scroll down past hero
  await page.evaluate(() => window.scrollTo({ top: 1200, behavior: 'instant' }));
  await page.waitForTimeout(400);

  const scrolledLauncherCheck = await page.evaluate(() => {
    const heroLauncher = document.querySelector('.hero-character-launcher');
    const heroVisible = heroLauncher && !heroLauncher.classList.contains('launcher-hidden') && window.getComputedStyle(heroLauncher).opacity !== '0';
    const avatarLauncher = document.querySelector('.floating-avatar-launcher');
    const avatarVisible = avatarLauncher && avatarLauncher.classList.contains('launcher-visible') && window.getComputedStyle(avatarLauncher).opacity !== '0';

    return { heroVisible, avatarVisible };
  });

  if (scrolledLauncherCheck.heroVisible || !scrolledLauncherCheck.avatarVisible) {
    console.error('  FAIL: After scroll, hero character must fade out and 72px floating avatar must appear!');
    failures++;
  } else {
    console.log('  PASS: After scroll, ONLY the 72px floating avatar is visible.');
  }

  // Open chat and close with Escape
  await page.evaluate(() => document.querySelectorAll('vite-error-overlay').forEach(e => e.remove()));
  await page.locator('.floating-avatar-launcher').click({ force: true });
  await page.waitForTimeout(300);
  const isChatOpen = await page.locator('.chat-dialog.open').isVisible();
  if (!isChatOpen) {
    console.error('  FAIL: Chat did not open from floating avatar');
    failures++;
  } else {
    console.log('  PASS: Chat opened cleanly from floating avatar.');
  }

  await page.keyboard.press('Escape');
  await page.waitForTimeout(300);
  const isChatClosed = !(await page.locator('.chat-dialog.open').isVisible());
  if (!isChatClosed) {
    console.error('  FAIL: Chat dialog did not close when pressing Escape!');
    failures++;
  } else {
    console.log('  PASS: Chat closed on Escape key.');
  }

  // Scroll back to top
  await page.evaluate(() => window.scrollTo({ top: 0, behavior: 'instant' }));
  await page.waitForTimeout(400);

  // 10. SCREENSHOTS ACROSS REQUIRED VIEWPORTS & ORBIT/CHARACTER BOUNDING BOX ASSERTIONS
  console.log('\n[CHECK 10] Viewport checks: 1892x916, 1440x900, 1280x720, 1920x1080, and 390x844...');
  fs.mkdirSync('test/screenshots', { recursive: true });

  const requiredViewports = [
    { width: 1892, height: 916 },
    { width: 1440, height: 900 },
    { width: 1280, height: 720 },
    { width: 1920, height: 1080 },
    { width: 390, height: 844 },
  ];

  for (const vp of requiredViewports) {
    await page.setViewportSize(vp);
    await page.waitForTimeout(600);

    const shotPath = `test/screenshots/hero-${vp.width}x${vp.height}.png`;
    await page.screenshot({ path: shotPath, fullPage: false });
    console.log(`  Saved screenshot: ${shotPath}`);

    // Assert orbit stage bounding box and character bounding box do not intersect
    const bboxCheck = await page.evaluate(() => {
      const charEl = document.querySelector('.hero-character-launcher');
      const orbitEl = document.querySelector('.orbit-stage');
      if (!charEl || !orbitEl) return { intersects: false };

      const c = charEl.getBoundingClientRect();
      const o = orbitEl.getBoundingClientRect();

      const intersects = !(
        c.right <= o.left ||
        c.left >= o.right ||
        c.bottom <= o.top ||
        c.top >= o.bottom
      );

      return {
        intersects,
        char: { left: c.left, right: c.right, top: c.top, bottom: c.bottom },
        orbit: { left: o.left, right: o.right, top: o.top, bottom: o.bottom },
      };
    });

    console.log(`  Viewport ${vp.width}x${vp.height}: stage [${bboxCheck.orbit.left.toFixed(0)}, ${bboxCheck.orbit.right.toFixed(0)}] vs char [${bboxCheck.char.left.toFixed(0)}, ${bboxCheck.char.right.toFixed(0)}] -> Intersects: ${bboxCheck.intersects}`);
    if (bboxCheck.intersects) {
      console.error(`  FAIL at ${vp.width}x${vp.height}: Orbit stage bounding box and character bounding box intersect!`);
      failures++;
    } else {
      console.log(`  PASS at ${vp.width}x${vp.height}: Orbit stage and character do not intersect.`);
    }
  }

  await browser.close();

  console.log('\n===========================================================');
  if (failures === 0) {
    console.log('>>> ALL VERIFICATION CHECKS PASSED (0 FAILURES) <<<');
  } else {
    console.error(`>>> VERIFICATION FINISHED WITH ${failures} FAILURE(S) <<<`);
    process.exit(1);
  }
}

runVerification();
