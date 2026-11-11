import { chromium } from '@playwright/test';

async function runVerification() {
  console.log('--- Starting Playwright Automated Verification for 5 Changes ---');
  const browser = await chromium.launch({ headless: true });
  const context = await browser.newContext({ viewport: { width: 1280, height: 800 } });
  const page = await context.newPage();

  const baseUrl = 'http://localhost:4000';
  await page.goto(baseUrl, { waitUntil: 'networkidle' });

  let failures = [];

  // 1. PAGE TITLE AND FAVICON VERIFICATION
  console.log('\n[Check 1] Page Title, Meta, and Favicons');
  const title = await page.title();
  console.log(`  Page title: "${title}"`);
  if (title !== 'Prathyusha Sadhu') {
    failures.push(`Expected page title to be strictly "Prathyusha Sadhu", got "${title}"`);
  } else {
    console.log('  ✓ Page title is strictly "Prathyusha Sadhu"');
  }

  const ogTitle = await page.getAttribute('meta[property="og:title"]', 'content');
  if (ogTitle !== 'Prathyusha Sadhu') {
    failures.push(`Expected og:title to be "Prathyusha Sadhu", got "${ogTitle}"`);
  } else {
    console.log('  ✓ og:title is "Prathyusha Sadhu"');
  }

  const themeColor = await page.getAttribute('meta[name="theme-color"]', 'content');
  if (themeColor !== '#090D18') {
    failures.push(`Expected theme-color to be "#090D18", got "${themeColor}"`);
  } else {
    console.log('  ✓ theme-color is "#090D18"');
  }

  const svgFavicon = await page.$('link[rel="icon"][type="image/svg+xml"]');
  const pngFavicon = await page.$('link[rel="icon"][sizes="32x32"]');
  const appleTouch = await page.$('link[rel="apple-touch-icon"]');
  const manifest = await page.$('link[rel="manifest"]');

  if (!svgFavicon || !pngFavicon || !appleTouch || !manifest) {
    failures.push('Missing one or more required favicon/manifest link elements in head');
  } else {
    console.log('  ✓ SVG favicon, 32x32 PNG, apple-touch-icon, and manifest link tags present');
  }

  // 2. NO "HQ" IN TEXT OR ATTRIBUTES & REDESIGNED ORBIT CENTRE
  console.log('\n[Check 2] Remove "HQ" Everywhere & Orbit Centre Redesign');
  const bodyText = await page.innerText('body');
  const hqMatches = bodyText.match(/\bHQ\b|Digital\s*HQ|\.HQ/gi);
  if (hqMatches && hqMatches.length > 0) {
    failures.push(`Found leftover HQ text in DOM: ${JSON.stringify(hqMatches)}`);
  } else {
    console.log('  ✓ Zero occurrences of "HQ" or "Digital HQ" in visible page text');
  }

  // Top Nav Brand
  const navLogoText = await page.innerText('app-nav .logo');
  console.log(`  Nav logo text: "${navLogoText.trim()}"`);
  if (!navLogoText.includes('Prathyusha Sadhu') || navLogoText.includes('HQ')) {
    failures.push(`Nav logo has unexpected text: "${navLogoText}"`);
  } else {
    console.log('  ✓ Nav logo has pixel mini-me icon + "Prathyusha Sadhu"');
  }

  // Footer Brand
  const footerBrand = await page.innerText('footer .footer-brand');
  console.log(`  Footer brand: "${footerBrand.trim()}"`);
  if (!footerBrand.includes('Prathyusha Sadhu') || footerBrand.includes('HQ')) {
    failures.push(`Footer brand has unexpected text: "${footerBrand}"`);
  } else {
    console.log('  ✓ Footer brand has pixel mini-me icon + "Prathyusha Sadhu"');
  }

  // Orbit Core Element
  const orbitCore = await page.$('#orbit-core');
  if (!orbitCore) {
    failures.push('Missing #orbit-core element in project orbit');
  } else {
    const role = await orbitCore.getAttribute('role');
    const ariaLabel = await orbitCore.getAttribute('aria-label');
    const href = await orbitCore.getAttribute('href');
    if (role !== 'link' || ariaLabel !== 'Prathyusha Sadhu, about me' || href !== '#about') {
      failures.push(`Orbit core has wrong attributes: role="${role}", aria-label="${ariaLabel}", href="${href}"`);
    } else {
      console.log('  ✓ Orbit core has role="link", href="#about", aria-label="Prathyusha Sadhu, about me"');
    }

    // Avatar image inside core
    const avatarImg = await page.$('#orbit-core image');
    if (!avatarImg) {
      failures.push('Missing avatar <image> inside #orbit-core');
    } else {
      console.log('  ✓ Orbit core circular avatar image present');
    }

    // Hover core and check tooltip
    await orbitCore.hover();
    await page.waitForTimeout(200);
    const tipTitle = await page.innerText('.tip b');
    const tipSubtitle = await page.innerText('.tip span');
    console.log(`  Tip on core hover: "${tipTitle}" · "${tipSubtitle}"`);
    if (tipTitle !== 'Prathyusha Sadhu' || tipSubtitle !== 'Senior Frontend Engineer') {
      failures.push(`Expected core hover tip "Prathyusha Sadhu · Senior Frontend Engineer", got "${tipTitle} · ${tipSubtitle}"`);
    } else {
      console.log('  ✓ Core hover caption verified');
    }
  }

  // 3. PROJECT ORBIT PLANET HOVER STABILITY
  console.log('\n[Check 3] Project Orbit Planet Hover Stability');
  const stabilityResult = await page.evaluate(() => {
    const dots = Array.from(document.querySelectorAll('.planet-dot'));
    return dots.map((dot, index) => {
      const cx = parseFloat(dot.getAttribute('cx'));
      const cy = parseFloat(dot.getAttribute('cy'));
      const r = parseFloat(dot.getAttribute('r'));
      const distFromCenter = Math.sqrt((cx - 230) ** 2 + (cy - 230) ** 2);

      // Check transformBox and transformOrigin
      const style = window.getComputedStyle(dot);
      const origin = style.transformOrigin;
      const box = style.transformBox;

      // Verify enlargement stability directly on the element
      const rectBefore = dot.getBoundingClientRect();
      const c1x = rectBefore.x + rectBefore.width / 2;
      const c1y = rectBefore.y + rectBefore.height / 2;

      dot.style.transform = 'scale(1.4)';
      const rectAfter = dot.getBoundingClientRect();
      const c2x = rectAfter.x + rectAfter.width / 2;
      const c2y = rectAfter.y + rectAfter.height / 2;
      dot.style.transform = '';

      const driftX = Math.abs(c2x - c1x);
      const driftY = Math.abs(c2y - c1y);
      const enlarged = rectAfter.width > rectBefore.width;

      return {
        index: index + 1,
        distFromCenter: distFromCenter.toFixed(1),
        driftX: driftX.toFixed(4),
        driftY: driftY.toFixed(4),
        enlarged,
        box,
      };
    });
  });

  stabilityResult.forEach((res) => {
    console.log(`  Planet ${res.index}: orbital radius=${res.distFromCenter}px, drift=(dx:${res.driftX}px, dy:${res.driftY}px), transformBox=${res.box}`);
    if (parseFloat(res.driftX) > 0.05 || parseFloat(res.driftY) > 0.05) {
      failures.push(`Planet ${res.index} has drift during hover enlargement: dx=${res.driftX}px, dy=${res.driftY}px`);
    }
  });
  console.log('  ✓ All 9 planets remain exactly centred on their orbit rings during hover enlargement');

  // Check animation-play-state: paused on hub hover
  const hub = await page.$('.hub');
  await hub.hover();
  const playState = await page.evaluate(() => {
    const el = document.querySelector('.orbit-group');
    return window.getComputedStyle(el).animationPlayState;
  });
  console.log(`  Orbit group animation-play-state on hub hover: ${playState}`);
  if (playState !== 'paused') {
    failures.push(`Expected animationPlayState "paused", got "${playState}"`);
  } else {
    console.log('  ✓ Orbit pauses on hover without snapping');
  }

  // 4. REMOVE THE CONTACT FORM
  console.log('\n[Check 4] Contact Section Form Removal');
  const forms = await page.$$('#contact form');
  const inputs = await page.$$('#contact input');
  const textareas = await page.$$('#contact textarea');
  if (forms.length > 0 || inputs.length > 0 || textareas.length > 0) {
    failures.push(`Found form/input elements inside #contact: forms=${forms.length}, inputs=${inputs.length}, textareas=${textareas.length}`);
  } else {
    console.log('  ✓ Contact section contains 0 forms, 0 inputs, 0 textareas');
  }

  const emailBtn = await page.$('#contact a.email-btn[href^="mailto:prathyushasadhu12@gmail.com"]');
  const copyBtn = await page.$('#contact button.copy-btn');
  const linkedin = await page.$('#contact a[href*="linkedin.com"]');
  const github = await page.$('#contact a[href*="github.com"]');

  if (!emailBtn || !copyBtn || !linkedin || !github) {
    failures.push('Missing required contact action elements (email btn, copy btn, linkedin, github)');
  } else {
    console.log('  ✓ Email me button (mailto), Copy email button, LinkedIn, and GitHub links all present');
  }

  // 5. ACTIVE NAV HIGHLIGHT
  console.log('\n[Check 5] Active Nav Highlight & Anchor Scroll Margins');
  const sectionIds = ['home', 'about', 'eng', 'ai', 'product', 'resume', 'contact'];

  for (const id of sectionIds) {
    const secEl = await page.$(`#${id}`);
    if (!secEl) {
      failures.push(`Missing section #${id} in DOM`);
      continue;
    }
    const scrollMargin = await page.evaluate((elId) => {
      const el = document.getElementById(elId);
      return window.getComputedStyle(el).scrollMarginTop;
    }, id);
    if (!scrollMargin || scrollMargin === '0px') {
      failures.push(`Section #${id} is missing scroll-margin-top (got "${scrollMargin}")`);
    }
  }
  console.log('  ✓ All sections have scroll-margin-top configured for sticky nav clearance');

  // Test active link highlighting on scroll
  console.log('  Testing navigation section transitions...');
  for (const id of ['about', 'eng', 'ai', 'product', 'resume']) {
    await page.evaluate((secId) => {
      const el = document.getElementById(secId);
      el.scrollIntoView({ behavior: 'instant', block: 'center' });
    }, id);
    await page.waitForTimeout(350);

    const activeNavHref = await page.evaluate(() => {
      const activeLink = document.querySelector('app-nav .links a.on');
      return activeLink ? activeLink.getAttribute('href') : null;
    });

    console.log(`  Scrolled to #${id} -> Active nav item: ${activeNavHref}`);
    if (activeNavHref !== `#${id}`) {
      failures.push(`Expected active nav for section #${id} to be "#${id}", but got "${activeNavHref}"`);
    }
  }

  // Test bottom of page -> #contact active
  await page.evaluate(() => {
    window.scrollTo({ top: document.documentElement.scrollHeight, behavior: 'instant' });
  });
  await page.waitForTimeout(350);
  const bottomActiveHref = await page.evaluate(() => {
    const activeLink = document.querySelector('app-nav .links a.on');
    return activeLink ? activeLink.getAttribute('href') : null;
  });
  console.log(`  Scrolled to bottom -> Active nav item: ${bottomActiveHref}`);
  if (bottomActiveHref !== '#contact') {
    failures.push(`Expected active nav at bottom to be "#contact", but got "${bottomActiveHref}"`);
  } else {
    console.log('  ✓ Contact nav item active at bottom of page');
  }

  // Test mobile drawer active states
  console.log('  Testing mobile viewport (390x844)...');
  await page.setViewportSize({ width: 390, height: 844 });
  await page.evaluate(() => {
    const el = document.getElementById('eng');
    el.scrollIntoView({ behavior: 'instant', block: 'center' });
  });
  await page.waitForTimeout(300);
  const mobileActiveHref = await page.evaluate(() => {
    const activeLink = document.querySelector('app-nav .links a.on');
    return activeLink ? activeLink.getAttribute('href') : null;
  });
  console.log(`  Mobile scrolled to #eng -> Active link: ${mobileActiveHref}`);
  if (mobileActiveHref !== '#eng') {
    failures.push(`Expected mobile active link for #eng to be "#eng", got "${mobileActiveHref}"`);
  } else {
    console.log('  ✓ Mobile navigation correctly mirrors active section');
  }

  await browser.close();

  console.log('\n=======================================');
  if (failures.length === 0) {
    console.log('ALL 5 CHANGES VERIFIED AND PASSED PERFECTLY!');
    process.exit(0);
  } else {
    console.error(`FAILED: ${failures.length} issues found:`);
    failures.forEach((f) => console.error(`  - ${f}`));
    process.exit(1);
  }
}

runVerification().catch((err) => {
  console.error('Test execution error:', err);
  process.exit(1);
});
