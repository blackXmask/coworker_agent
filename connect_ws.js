const { chromium } = require('playwright');

(async () => {
  const browser = await chromium.connect({ wsEndpoint: 'ws://localhost:9222/devtools/browser/1c951054-4f97-4a84-8784-f73b13fe6628' });
  const contexts = browser.contexts();
  let context = contexts[0];
  
  let page = context.pages().find(p => p.url().includes('legiit'));
  if (!page) page = context.newPage();
  await page.bringToFront();
  
  if (!page.url().includes('create-gig')) {
    await page.goto('https://legiit.com/seller/create-gig');
  }
  
  await page.waitForTimeout(4000);
  
  // Try title
  const title = page.locator('input[name="title"], input[placeholder*="Gig title"], input#title');
  await title.first().click({ timeout: 20000 });
  await title.first().fill("I'll build an AI LinkedIn post agent that writes posts in your exact style");
  console.log('title done');
  
  // Try desc
  const desc = page.locator('textarea, div[contenteditable="true"]').filter({ hasText: /describe/i }).first();
  if (await desc.isVisible()) {
    await desc.fill("I'll build you a custom AI agent that creates LinkedIn posts tailored to your voice. It will write hooks, captions, hashtags, and CTAs that match your niche. Just share your style or examples and I'll deliver it ready to use. Works in OpenCode, Cursor, Cline, ChatGPT, Grok etc.");
  } else {
    const desc2 = page.locator('div[contenteditable="true"]').first();
    await desc2.click();
    await desc2.fill("I'll build you a custom AI agent that creates LinkedIn posts tailored to your voice. It will write hooks, captions, hashtags, and CTAs that match your niche. Just share your style or examples and I'll deliver it ready to use. Works in OpenCode, Cursor, Cline, ChatGPT, Grok etc.");
  }
  console.log('desc done');
  
  await page.waitForTimeout(2000);
  await page.evaluate(() => {
    const btns = [...document.querySelectorAll('button')];
    const d = btns.find(b => (b.textContent||'').match(/Save.*Draft/i));
    if (d) d.click();
  });
  
  console.log('SAVED AS DRAFT');
  await page.screenshot({ path: 'D:/agent freelancer/gig_ok.png', fullPage: true });
  console.log('screenshot saved');
  await browser.disconnect();
})();