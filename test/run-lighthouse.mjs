import lighthouse from 'lighthouse';
import * as chromeLauncher from 'chrome-launcher';
import fs from 'node:fs';

async function runLighthouseAudit() {
  console.log('--- Starting Real Lighthouse Measurement (Mobile & Desktop) ---');
  const chromePath = 'C:\\Users\\sadhu\\AppData\\Local\\ms-playwright\\chromium-1248\\chrome-win64\\chrome.exe';

  // 1. Mobile Run
  console.log('\n--- Running Mobile Audit ---');
  const chromeMobile = await chromeLauncher.launch({
    chromePath,
    chromeFlags: ['--headless', '--no-sandbox', '--disable-gpu'],
  });

  const mobileOptions = {
    logLevel: 'error',
    output: 'json',
    onlyCategories: ['performance', 'accessibility', 'best-practices', 'seo'],
    port: chromeMobile.port,
  };
  const mobileResult = await lighthouse('http://localhost:4200/', mobileOptions);
  await chromeMobile.kill();

  const mCats = mobileResult.lhr.categories;
  const mobileScores = {
    performance: Math.round(mCats.performance.score * 100),
    accessibility: Math.round(mCats.accessibility.score * 100),
    bestPractices: Math.round(mCats['best-practices'].score * 100),
    seo: Math.round(mCats.seo.score * 100),
  };

  // Give port 500ms to clear
  await new Promise((r) => setTimeout(r, 600));

  // 2. Desktop Run
  console.log('\n--- Running Desktop Audit ---');
  const chromeDesktop = await chromeLauncher.launch({
    chromePath,
    chromeFlags: ['--headless', '--no-sandbox', '--disable-gpu'],
  });

  const desktopOptions = {
    logLevel: 'error',
    output: 'json',
    onlyCategories: ['performance', 'accessibility', 'best-practices', 'seo'],
    port: chromeDesktop.port,
    formFactor: 'desktop',
    screenEmulation: {
      mobile: false,
      width: 1350,
      height: 940,
      deviceScaleFactor: 1,
      disabled: false,
    },
    throttling: {
      rttMs: 40,
      throughputKbps: 10240,
      cpuSlowdownMultiplier: 1,
      requestLatencyMs: 0,
      downloadThroughputKbps: 0,
      uploadThroughputKbps: 0,
    },
  };
  const desktopResult = await lighthouse('http://localhost:4200/', desktopOptions);
  await chromeDesktop.kill();

  const dCats = desktopResult.lhr.categories;
  const desktopScores = {
    performance: Math.round(dCats.performance.score * 100),
    accessibility: Math.round(dCats.accessibility.score * 100),
    bestPractices: Math.round(dCats['best-practices'].score * 100),
    seo: Math.round(dCats.seo.score * 100),
  };

  const mAudits = mobileResult.lhr.audits;
  console.log('\n--- Real Measured Lighthouse Scores (Mobile) ---');
  console.log(`Performance:    ${mobileScores.performance}/100`);
  console.log(`Accessibility:  ${mobileScores.accessibility}/100`);
  console.log(`Best Practices: ${mobileScores.bestPractices}/100`);
  console.log(`SEO:            ${mobileScores.seo}/100`);
  console.log(`FCP: ${mAudits['first-contentful-paint']?.displayValue} | LCP: ${mAudits['largest-contentful-paint']?.displayValue} | TBT: ${mAudits['total-blocking-time']?.displayValue} | CLS: ${mAudits['cumulative-layout-shift']?.displayValue}`);

  const dAudits = desktopResult.lhr.audits;
  console.log('\n--- Real Measured Lighthouse Scores (Desktop) ---');
  console.log(`Performance:    ${desktopScores.performance}/100`);
  console.log(`Accessibility:  ${desktopScores.accessibility}/100`);
  console.log(`Best Practices: ${desktopScores.bestPractices}/100`);
  console.log(`SEO:            ${desktopScores.seo}/100`);
  console.log(`FCP: ${dAudits['first-contentful-paint']?.displayValue} | LCP: ${dAudits['largest-contentful-paint']?.displayValue} | TBT: ${dAudits['total-blocking-time']?.displayValue} | CLS: ${dAudits['cumulative-layout-shift']?.displayValue}`);

  const summary = { mobile: mobileScores, desktop: desktopScores };
  fs.writeFileSync('test/lighthouse-summary.json', JSON.stringify(summary, null, 2));

  return summary;
}

runLighthouseAudit().catch((err) => {
  console.error('Lighthouse audit error:', err.message);
  process.exit(1);
});
