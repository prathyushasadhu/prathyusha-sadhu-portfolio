import { chromium } from '@playwright/test';

async function verifyResumeSection() {
  const browser = await chromium.launch({
    executablePath: 'C:\\Users\\sadhu\\AppData\\Local\\ms-playwright\\chromium-1248\\chrome-win64\\chrome.exe',
    headless: true,
  });

  const page = await browser.newPage();
  
  // Test both dev server (4200) and prod server (4000)
  for (const port of [4200, 4000]) {
    console.log(`\n=== Testing http://localhost:${port}/ ===`);
    await page.goto(`http://localhost:${port}/`, { waitUntil: 'networkidle' });

    const resumeSection = await page.$('#resume');
    if (!resumeSection) {
      console.error('ERROR: #resume section not found!');
      continue;
    }

    const sectionClass = await resumeSection.getAttribute('class');
    console.log('#resume class:', sectionClass);

    // Count .ms cards inside #resume
    const msCards = await page.$$('#resume .ms');
    console.log(`Count of .ms cards inside #resume: ${msCards.length}`);

    // Count .milestone-card cards inside #resume
    const milestoneCards = await page.$$('#resume .milestone-card');
    console.log(`Count of .milestone-card cards inside #resume: ${milestoneCards.length}`);

    for (let i = 0; i < msCards.length; i++) {
      const card = msCards[i];
      const role = await card.$eval('.milestone-role', el => el.textContent?.trim());
      const period = await card.$eval('.milestone-period', el => el.textContent?.trim());
      const badge = await card.$eval('.milestone-badge', el => el.textContent?.trim());
      const client = await card.$eval('.milestone-client-line', el => el.textContent?.trim());
      const highlights = await card.$$eval('.highlight-item', els => els.map(e => e.textContent?.trim().replace(/\s+/g, ' ')));
      const hasDetails = (await card.$$('details.what-i-did-disclosure')).length > 0;
      const isOpen = await card.$eval('details.what-i-did-disclosure', el => el.hasAttribute('open'));
      const techTags = await card.$$eval('.tech-tag', els => els.map(e => e.textContent?.trim()));

      console.log(`\nCard ${i + 1}:`);
      console.log(`  Role: ${role}`);
      console.log(`  Period: ${period}`);
      console.log(`  Employer: ${badge}`);
      console.log(`  Client: ${client}`);
      console.log(`  Highlights: ${highlights.join(' | ')}`);
      console.log(`  Has <details>: ${hasDetails} (open by default: ${isOpen})`);
      console.log(`  Tech count: ${techTags.length}`);
    }

    // Check if the old one-line text exists
    const oldText = await page.evaluate(() => {
      const el = document.querySelector('#resume');
      return el ? el.textContent.includes('Sep 2021 – Mar 2026: Infosys Limited · Jul 2016 – Sep 2021: Mindtree Limited.') : false;
    });
    console.log(`\nOld one-line text present: ${oldText}`);
  }

  await browser.close();
}

verifyResumeSection().catch(err => {
  console.error('Verification failed:', err);
  process.exit(1);
});

