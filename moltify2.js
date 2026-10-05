const { chromium } = require('playwright');

(async () => {
  const browser = await chromium.connect({ wsEndpoint: 'ws://localhost:9222/devtools/browser/09a4c14d-f415-47a5-8f23-fccae8c8655f' });
  const context = browser.contexts()[0];
  let page = context.pages().find(p => p.url().includes('moltify')) || await context.newPage();
  
  await page.bringToFront();
  if (!page.url().includes('moltify')) {
    await page.goto('https://www.moltify.ai/');
  }
  await page.waitForTimeout(3000);
  
  // Find "Become a Builder" or "Sell" or "List Agent"
  const result = await page.evaluate(() => {
    const links = Array.from(document.querySelectorAll('a, button'));
    for (let el of links) {
      const t = (el.textContent || '').toLowerCase();
      if (t.includes('become a builder') || t.includes('start building') || t.includes('list agent') || t.includes('sell agent') || t.includes('create listing')) {
        el.click();
        return t;
      }
    }
    return 'not found';
  });
  
  console.log(result);
  await page.waitForTimeout(4000);
  await page.screenshot({ path: 'D:/agent freelancer/moltify_start.png', fullPage: true });
  console.log('saved');
  await browser.disconnect();
})();