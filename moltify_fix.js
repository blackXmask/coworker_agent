const { chromium } = require('playwright');

(async () => {
  try {
    const ws = 'ws://localhost:9222/devtools/browser/39d91e2b-bf40-44e1-ba65-abc4a4476945';
    const browser = await chromium.connect({ wsEndpoint: ws });
    const context = browser.contexts()[0];
    let page = context.pages().find(p => p.url().includes('moltify')) || await context.newPage();
    await page.bringToFront();
    
    if (!page.url().includes('moltify.ai')) {
      await page.goto('https://www.moltify.ai/');
    }
    await page.waitForTimeout(3000);
    
    // Click become builder/list agent
    const clicked = await page.evaluate(() => {
      const els = Array.from(document.querySelectorAll('a, button'));
      for (let e of els) {
        const t = (e.textContent || '').toLowerCase();
        if (t.includes('become a builder') || t.includes('list agent') || t.includes('sell agent') || t.includes('start selling') || t.includes('create')) {
          e.click();
          return t;
        }
      }
      return 'nope';
    });
    
    console.log('clicked:', clicked);
    await page.waitForTimeout(4000);
    await page.screenshot({ path: 'D:/agent freelancer/moltify_fix.png', fullPage: true });
    await browser.disconnect();
    console.log('done');
  } catch (e) {
    console.error('err');
  }
})();