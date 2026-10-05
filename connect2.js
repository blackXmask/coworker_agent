const { chromium } = require('playwright');

(async () => {
  const browser = await chromium.connectOverCDP('http://localhost:9222');
  const context = browser.contexts()[0];
  
  // Use first visible page or create new
  let page = context.pages().find(p => p.url().includes('legiit'));
  if (!page) page = context.pages()[0] || await context.newPage();
  
  await page.bringToFront();
  
  if (!page.url().includes('create-gig')) {
    await page.goto('https://legiit.com/seller/create-gig');
  }
  
  await page.waitForTimeout(3000);
  
  // Fill title - wait for it
  const title = page.locator('input[name="title"], #gig-title, input[placeholder*="title"]');
  await title.first().waitFor({ state: 'visible', timeout: 30000 });
  await title.first().fill("I'll build an AI LinkedIn post agent that writes posts in your exact style");
  console.log('ok title');
  
  // Desc
  const desc = page.locator('div[contenteditable="true"], textarea[name="description"]');
  if (await desc.first().isVisible()) {
    await desc.first().fill("I'll build you a custom AI agent that creates LinkedIn posts tailored to your voice. It will write hooks, captions, hashtags, and CTAs that match your niche. Just share your style or examples and I'll deliver it ready to use. Works in OpenCode, Cursor, Cline, ChatGPT, Grok etc.");
    console.log('ok desc');
  }
  
  await page.waitForTimeout(1500);
  
  await page.evaluate(() => {
    for (let b of document.querySelectorAll('button')) {
      const t = (b.textContent||'').trim();
      if (t === 'Save Draft' || t === 'Save as Draft') { b.click(); return; }
    }
  });
  
  console.log('DRAFT SAVED');
  await page.screenshot({path:'D:/agent freelancer/gig_final.png'});
  
  await browser.disconnect();
  console.log('done');
})();