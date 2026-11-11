import { chromium } from 'playwright';

async function testMobileHero() {
  console.log('--- VERIFYING MOBILE HERO (390x844) AGAINST DESIGN IMAGE ---');
  const browser = await chromium.launch();
  const page = await browser.newPage({ viewport: { width: 390, height: 844 } });
  await page.goto('http://localhost:4200/', { waitUntil: 'networkidle' });
  await page.waitForTimeout(1000);

  const results = await page.evaluate(() => {
    const getRect = (sel) => {
      const el = document.querySelector(sel);
      if (!el) return null;
      const r = el.getBoundingClientRect();
      const style = window.getComputedStyle(el);
      return {
        left: Math.round(r.left),
        right: Math.round(r.right),
        top: Math.round(r.top),
        bottom: Math.round(r.bottom),
        width: Math.round(r.width),
        height: Math.round(r.height),
        display: style.display,
        visibility: style.visibility,
        opacity: style.opacity,
        text: el.textContent?.trim().replace(/\s+/g, ' '),
      };
    };

    const logoMark = !!document.querySelector('.logo .logo-mark');
    const logoDesktop = getRect('.logo .logo-desktop');
    const logoMobile = getRect('.logo .logo-mobile');
    const navOrbiBtn = !!document.querySelector('.nav-orbi-btn');
    const burgerBtn = getRect('.burger-btn');

    const eyebrow = getRect('.hero-eyebrow');
    const title = getRect('.hero-title');
    const lead = getRect('.hero-lead');
    const desktopCtaRow = getRect('.hero-cta-row');
    const chipsRow = getRect('.hero-chips');
    const orbitStage = getRect('.orbit-stage');
    const hintLine = getRect('.orbit-hint-line');
    const coreSphereText = document.querySelector('.core-brand-text')?.textContent?.trim();

    // Mobile Bottom Block
    const mobileBottomBlock = getRect('.mobile-bottom-block');
    const mobileBuildTitle = getRect('.mobile-build-title');
    const mobileWorkBtn = getRect('.mobile-btn-work');
    const mobileResumeBtn = getRect('.mobile-btn-resume');
    const mobileChar = getRect('.mobile-char-col');

    const scrollCue = getRect('.scroll-cue');
    const floatingLauncher = getRect('.floating-avatar-launcher');

    // Check chips layout (grid 2x2)
    const chipsList = Array.from(document.querySelectorAll('.hero-chips .tech-chip')).map(el => {
      const r = el.getBoundingClientRect();
      return { text: el.textContent?.trim(), top: Math.round(r.top), left: Math.round(r.left) };
    });

    return {
      logo: { logoMark, logoDesktop, logoMobile },
      navOrbiBtn,
      burgerBtn,
      eyebrow,
      title,
      lead,
      desktopCtaRow,
      chipsRow,
      chipsList,
      orbitStage,
      hintLine,
      coreSphereText,
      mobileBottomBlock,
      mobileBuildTitle,
      mobileWorkBtn,
      mobileResumeBtn,
      mobileChar,
      scrollCue,
      floatingLauncher,
      windowHeight: window.innerHeight,
    };
  });

  console.log('\n1. NAV BAR:');
  console.log('  Logo mark present:', results.logo.logoMark);
  console.log('  Desktop logo display:', results.logo.logoDesktop?.display, '(expected: none)');
  console.log('  Mobile logo text:', results.logo.logoMobile?.text, '(expected: "P. / ORBIT")');
  console.log('  "Ask Orbi" in navbar:', results.navOrbiBtn, '(expected: false)');
  console.log('  Burger button visible:', results.burgerBtn?.display !== 'none');

  console.log('\n2. TOP HERO ORDER & 2x2 CHIPS:');
  console.log('  Eyebrow top:', results.eyebrow?.top);
  console.log('  Headline top:', results.title?.top);
  console.log('  Paragraph top:', results.lead?.top);
  console.log('  Desktop CTA row display:', results.desktopCtaRow?.display, '(expected: none)');
  console.log('  Chips row top:', results.chipsRow?.top);
  console.log('  Chips count:', results.chipsList.length, results.chipsList.map(c => c.text));

  const items = [
    { name: 'Eyebrow', top: results.eyebrow?.top },
    { name: 'Headline', top: results.title?.top },
    { name: 'Paragraph', top: results.lead?.top },
    { name: 'Tech Chips', top: results.chipsRow?.top },
    { name: 'Orbit Stage', top: results.orbitStage?.top },
    { name: 'Mobile Bottom Block', top: results.mobileBottomBlock?.top },
  ];
  let inOrder = true;
  for (let i = 0; i < items.length - 1; i++) {
    if (items[i].top >= items[i + 1].top) {
      console.error(`  FAIL: ${items[i].name} (top: ${items[i].top}) is not above ${items[i + 1].name} (top: ${items[i + 1].top})`);
      inOrder = false;
    }
  }
  if (inOrder) {
    console.log('  PASS: Elements strictly follow design order: Eyebrow -> Title -> Lead -> Tech Chips -> Orbit -> Bottom Block!');
  }

  console.log('\n3. PROJECT ORBIT & HINT LINE:');
  console.log('  Orbit stage width:', results.orbitStage?.width);
  console.log('  Central core brand text:', results.coreSphereText, '(expected: "P. / ORBIT")');
  console.log('  Hint line text:', results.hintLine?.text, '| visible:', results.hintLine?.display !== 'none');

  console.log('\n4. MOBILE BOTTOM BLOCK (LET\'S BUILD... + CTAS + CHARACTER):');
  console.log('  Build title text:', results.mobileBuildTitle?.text);
  console.log('  Work button height:', results.mobileWorkBtn?.height, 'width:', results.mobileWorkBtn?.width);
  console.log('  Resume button height:', results.mobileResumeBtn?.height, 'width:', results.mobileResumeBtn?.width);
  console.log('  Character visible:', results.mobileChar?.width > 0 && results.mobileChar?.height > 0);
  console.log('  Character sitting beside CTAs (char left >= workBtn right):', results.mobileChar?.left >= results.mobileWorkBtn?.right - 20);

  console.log('\n5. BOTTOM CONTROLS (SCROLL CUE & FLOATING CHAT BUTTON):');
  console.log('  Scroll cue visible:', results.scrollCue?.display !== 'none', 'top:', results.scrollCue?.top);
  console.log('  Floating chat button visible:', results.floatingLauncher?.display !== 'none', 'bottom right:', results.floatingLauncher?.right, results.floatingLauncher?.bottom);

  await page.screenshot({ path: 'test/screenshots/mobile-hero-new-fold.png' });
  await page.screenshot({ path: 'test/screenshots/mobile-hero-new-full.png', fullPage: true });
  console.log('\nSaved test/screenshots/mobile-hero-new-fold.png and mobile-hero-new-full.png');

  await browser.close();
}

testMobileHero().catch(console.error);
