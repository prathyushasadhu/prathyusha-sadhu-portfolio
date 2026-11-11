import fs from 'node:fs';
import path from 'node:path';
import { JSDOM } from 'jsdom';
import axe from 'axe-core';

async function runA11yAudit() {
  console.log('--- Starting Accessibility Audit (axe-core WCAG AA) ---');

  const distDir = fs.existsSync('dist/prathyusha-sadhu/browser')
    ? 'dist/prathyusha-sadhu/browser'
    : 'dist/portfolio/browser';

  const filesToAudit = [
    { name: 'Home Page', path: `${distDir}/index.html` },
    { name: 'Case Study: q-live', path: `${distDir}/case-studies/q-live/index.html` },
    { name: 'Case Study: web-performance', path: `${distDir}/case-studies/web-performance/index.html` },
    { name: 'Case Study: component-library', path: `${distDir}/case-studies/component-library/index.html` },
  ];

  let totalViolations = 0;

  for (const item of filesToAudit) {
    if (!fs.existsSync(item.path)) {
      console.error(`File not found: ${item.path}`);
      continue;
    }

    const html = fs.readFileSync(item.path, 'utf8');
    const dom = new JSDOM(html, { runScripts: 'outside-only' });

    const results = await axe.run(dom.window.document.documentElement, {
      runOnly: {
        type: 'tag',
        values: ['wcag2a', 'wcag2aa'],
      },
    });

    console.log(`\nAudit results for: ${item.name}`);
    if (results.violations.length === 0) {
      console.log(`  ✓ Passed with 0 WCAG violations!`);
    } else {
      console.log(`  ✗ Found ${results.violations.length} violations:`);
      results.violations.forEach((v) => {
        console.log(`    - [${v.id}] ${v.help} (${v.nodes.length} occurrences)`);
        v.nodes.forEach((n) => {
          console.log(`        Target: ${n.target.join(' ')}`);
        });
      });
      totalViolations += results.violations.length;
    }
  }

  console.log('\n=======================================');
  if (totalViolations === 0) {
    console.log('ALL AUDITED PAGES PASSED WITH 0 VIOLATIONS');
    process.exit(0);
  } else {
    console.error(`FAILED: Total violations across pages: ${totalViolations}`);
    process.exit(1);
  }
}

runA11yAudit().catch((err) => {
  console.error(err);
  process.exit(1);
});
