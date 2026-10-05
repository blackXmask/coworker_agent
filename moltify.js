const { chromium } = require('playwright');

(async () => {
  const browser = await chromium.connect({ wsEndpoint: 'ws://localhost:9222/devtools/browser/1c951054-4f97-4a84-8784-f73b13fe6628' });
  const contexts = browser.contexts();
  const context = contexts[0];
  
  let page = context.pages().find(p => p.url().includes('moltify.ai')) ||
             context.pages().find(p => p.url().includes('moltify'));
  
  if (!page) {
    page = await context.newPage();
  }
  
  await page.bringToFront();
  await page.goto('https://www.moltify.ai/', { waitUntil: 'domcontentloaded' });
  await page.waitForTimeout(3000);
  
  // Go to seller/marketplace create/listing
  await page.goto('https://www.moltify.ai/', { waitUntil: 'domcontentloaded' });
  
  // Try to find Create/Become a Builder/List Agent
  await page.waitForTimeout(2000);
  
  const clicked = await page.evaluate(() => {
    const links = Array.from(document.querySelectorAll('a, button'));
    for (let el of links) {
      const t = (el.textContent || '').trim().toLowerCase();
      if (t.includes('become') || t.includes('builder') || t.includes('sell') || t.includes('list') || t.includes('create agent') || t.includes('start selling')) {
        el.click();
        return t;
      }
    }
    return 'none';
  });
  
  console.log('clicked:', clicked);
  
  await page.waitForTimeout(4000);
  await page.screenshot({ path: 'D:/agent freelancer/moltify_1.png', fullPage: true });
  
  await browser.disconnect();
  console.log('done');
})();