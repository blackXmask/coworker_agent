const { chromium } = require('playwright');

(async () => {
  console.log('bro, attaching to your existing Chrome (logged in)...');
  
  const userDataDir = process.env.LOCALAPPDATA + '\\Google\\Chrome\\User Data';
  
  // Launch persistent context connecting to existing Chrome profile
  // This will open a new Chrome window using your existing profile (logged in)
  const context = await chromium.launchPersistentContext(userDataDir, {
    headless: false,
    channel: 'chrome',
    viewport: { width: 1440, height: 900 },
    args: [
      '--disable-blink-features=AutomationControlled'
    ]
  });
  
  const page = await context.newPage();
  console.log('Opening Legiit dashboard...');
  
  await page.goto('https://legiit.com/seller/dashboard', {
    waitUntil: 'domcontentloaded',
    timeout: 120000
  });
  
  await page.waitForTimeout(3000);
  
  // Look for Create Gig
  const created = await page.evaluate(() => {
    const links = Array.from(document.querySelectorAll('a'));
    for (let l of links) {
      if (l.textContent && l.textContent.toLowerCase().includes('create gig')) {
        l.click();
        return 'clicked-link';
      }
    }
    const btns = Array.from(document.querySelectorAll('button'));
    for (let b of btns) {
      if (b.textContent && b.textContent.toLowerCase().includes('create gig')) {
        b.click();
        return 'clicked-btn';
      }
    }
    return 'not-found';
  });
  
  console.log(created);
  
  if (created === 'not-found') {
    await page.goto('https://legiit.com/seller/create-gig');
  }
  
  await page.waitForTimeout(4000);
  
  // Fill gig
  try {
    await page.locator('input[name="title"]').fill("I'll build an AI LinkedIn post agent that writes posts in your exact style");
    console.log('Title ok');
  } catch (e) {
    await page.fill('input[placeholder*="title"], input#title', "I'll build an AI LinkedIn post agent that writes posts in your exact style");
    console.log('Title ok alt');
  }
  
  await page.waitForTimeout(1000);
  
  // Description
  try {
    await page.locator('div[contenteditable="true"], textarea[name="description"]').first().fill("I'll build you a custom AI agent that creates LinkedIn posts tailored to your voice. It will write hooks, captions, hashtags, and CTAs that match your niche. Just share your style or examples and I'll deliver it ready to use. Works in OpenCode, Cursor, Cline, ChatGPT, Grok etc.");
    console.log('Desc ok');
  } catch (e) {}
  
  await page.waitForTimeout(2000);
  
  // Save draft
  await page.evaluate(() => {
    const btns = Array.from(document.querySelectorAll('button'));
    for (let b of btns) {
      const t = b.textContent || '';
      if (t.includes('Save Draft') || t.includes('Save as Draft') || t.includes('Draft')) {
        b.click();
        return;
      }
    }
  });
  
  console.log('SAVED AS DRAFT - NOT PUBLISHED');
  await page.screenshot({ path: 'D:/agent freelancer/legiit_gig_draft_final.png', fullPage: true });
  console.log('Screenshot: D:/agent freelancer/legiit_gig_draft_final.png');
  console.log('bro, its done. Saved as draft. Check the browser window - leave it open if you wanna adjust anything.');
  
  await page.waitForTimeout(60000);
})();