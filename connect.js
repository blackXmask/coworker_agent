const { chromium } = require('playwright');

(async () => {
  console.log('Connecting to Chrome on port 9222...');
  const browser = await chromium.connectOverCDP('http://localhost:9222');
  console.log('Connected!');
  
  const context = browser.contexts()[0];
  const page = context.pages()[0] || await context.newPage();
  
  await page.goto('https://legiit.com/seller/create-gig');
  
  // Fill
  try {
    await page.locator('input[name="title"]').fill("I'll build an AI LinkedIn post agent that writes posts in your exact style");
  } catch (e) {
    await page.fill('input', "I'll build an AI LinkedIn post agent that writes posts in your exact style");
  }
  
  try {
    await page.locator('div[contenteditable="true"], textarea').first().fill("I'll build you a custom AI agent that creates LinkedIn posts tailored to your voice. It will write hooks, captions, hashtags, and CTAs that match your niche. Just share your style or examples and I'll deliver it ready to use. Works in OpenCode, Cursor, Cline, ChatGPT, Grok etc.");
  } catch (e) {}
  
  // Save draft
  await page.evaluate(() => {
    for (let b of document.querySelectorAll('button')) {
      if ((b.textContent||'').includes('Draft')) { b.click(); break; }
    }
  });
  
  console.log('Saved as DRAFT');
  await page.screenshot({path:'D:/agent freelancer/gig_done.png'});
  console.log('Done - check browser');
  
  await browser.disconnect();
})();