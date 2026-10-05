const { chromium } = require('playwright');

(async () => {
  const browser = await chromium.connect({ wsEndpoint: 'ws://localhost:9222/devtools/browser/1c951054-4f97-4a84-8784-f73b13fe6628' });
  const contexts = browser.contexts();
  const context = contexts[0];
  
  // Get the page that's on legiit create-gig or switch to it
  let page = context.pages().find(p => p.url().includes('legiit.com/seller/create-gig'));
  if (!page) {
    page = context.pages().find(p => p.url().includes('legiit'));
  }
  if (!page) {
    page = await context.newPage();
    await page.goto('https://legiit.com/seller/create-gig');
  }
  
  await page.bringToFront();
  await page.waitForTimeout(3000);
  
  try {
    await page.waitForSelector('input[name="title"]', { timeout: 15000 });
    await page.fill('input[name="title"]', "I'll build an AI LinkedIn post agent that writes posts in your exact style");
    console.log('title filled');
  } catch (e) {
    console.log('title err');
  }
  
  try {
    const desc = page.locator('div[contenteditable="true"]').first();
    await desc.click();
    await desc.fill("I'll build you a custom AI agent that creates LinkedIn posts tailored to your voice. It will write hooks, captions, hashtags, and CTAs that match your niche. Just share your style or examples and I'll deliver it ready to use. Works in OpenCode, Cursor, Cline, ChatGPT, Grok etc.");
    console.log('desc filled');
  } catch (e) {
    console.log('desc err');
  }
  
  await page.waitForTimeout(1500);
  
  await page.evaluate(() => {
    for (const b of document.querySelectorAll('button')) {
      if (b.textContent && b.textContent.includes('Save Draft')) {
        b.click();
        return true;
      }
    }
    return false;
  });
  
  console.log('draft action done');
  await page.screenshot({ path: 'D:/agent freelancer/gig_draft.png', fullPage: true });
  console.log('screenshot saved');
  
  await browser.disconnect();
  console.log('done');
})();