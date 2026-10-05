const { chromium } = require('playwright');

(async () => {
  try {
    const ws = 'ws://localhost:9222/devtools/browser/39d91e2b-bf40-44e1-ba65-abc4a4476945';
    const browser = await chromium.connect({ wsEndpoint: ws });
    const context = browser.contexts()[0];
    const pages = context.pages();
    let page = pages.find(p => p.url().includes('moltify'));
    if (!page) {
      page = await context.newPage();
      await page.goto('https://www.moltify.ai/');
    }
    await page.bringToFront();
    console.log('url:', page.url());
    
    await page.evaluate(() => {
      const links = Array.from(document.querySelectorAll('a'));
      for (let l of links) {
        const t = l.textContent.toLowerCase();
        if (t.includes('become') || t.includes('builder') || t.includes('sell') || t.includes('list')) {
          l.click();
          return;
        }
      }
    });
    
    await page.waitForTimeout(3000);
    await page.screenshot({ path: 'D:/agent freelancer/moltify_try.png', fullPage: true });
    await browser.disconnect();
    console.log('done');
  } catch (e) {
    console.log('e');
  }
})();