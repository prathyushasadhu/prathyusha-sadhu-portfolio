import { chromium } from '@playwright/test';
import fs from 'fs';
import path from 'path';

async function generateFavicons() {
  const browser = await chromium.launch();
  const page = await browser.newPage();
  const svgContent = fs.readFileSync('public/favicon.svg', 'utf8');

  await page.setContent(`<!DOCTYPE html>
<html>
  <head>
    <style>
      * { margin: 0; padding: 0; }
      html, body { width: 100%; height: 100%; background: transparent; overflow: hidden; }
      svg { width: 100%; height: 100%; display: block; }
    </style>
  </head>
  <body>
    ${svgContent}
  </body>
</html>`);

  for (const size of [32, 180, 192, 512]) {
    await page.setViewportSize({ width: size, height: size });
    const filename = size === 180 ? 'public/apple-touch-icon.png' : `public/favicon-${size}.png`;
    await page.screenshot({ path: filename, omitBackground: true });
    console.log(`Generated ${filename} (${size}x${size})`);
  }

  await browser.close();
}

generateFavicons();

