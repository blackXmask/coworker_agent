const { chromium } = require('playwright');

(async () => {
  const browser = await chromium.connect({ wsEndpoint: 'ws://localhost:9222/devtools/browser/1c951054-4f97-4a84-8784-f73b13fe6628' });
  const context = browser.contexts()[0];
  
  let page = context.pages().find(p => p.url().includes('create-gig')) || 
             context.pages().find(p => p.url().includes('seller/create')) ||
             context.pages().find(p => p.url().includes('legiit'));
  
  if (!page) {
    page = await context.newPage();
    await page.goto('https://legiit.com/seller/create-gig');
  }
  
  await page.bringToFront();
  await page.goto('https://legiit.com/seller/create-gig');
  await page.waitForTimeout(5000);
  
  // Title
  await page.waitForSelector('input[name="title"]', { timeout: 20000 });
  await page.fill('input[name="title"]', "I'll build an AI LinkedIn post agent that writes posts in your exact style");
  
  // Category - try to find
  await page.waitForTimeout(1000);
  
  // Description
  const desc = page.locator('div[contenteditable="true"]').first();
  await desc.click();
  await desc.fill("I'll build you a custom AI agent that creates LinkedIn posts tailored to your voice. It will write hooks, captions, hashtags, and CTAs that match your niche. Just share your style or examples and I'll deliver it ready to use. Works in OpenCode, Cursor, Cline, ChatGPT, Grok etc.");
  
  await page.waitForTimeout(1500);
  await page.evaluate(() => {
    const btns = [...document.querySelectorAll('button')];
    for (let b of btns) {
      if (b.textContent && /Save Draft/i.test(b.textContent)) {
        b.click();
        console.log('clicked');
        return;
      }
    }
  });
  
  await page.screenshot({ path: 'D:/agent freelancer/legiit_draft_now.png', fullPage: true });
  console.log('saved');
  await browser.disconnect();
})();