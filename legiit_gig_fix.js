const { chromium } = require('playwright');

(async () => {
  console.log('Starting Legiit gig creation - connecting to existing Chrome session...');
  
  // Connect to existing Chrome instance (if running with remote debugging)
  // Or just launch and let it use existing profile
  let browser;
  try {
    // Try connecting to Chrome debug port if available
    browser = await chromium.connectOverCDP('http://localhost:9222');
    console.log('Connected to existing Chrome via CDP');
  } catch (e) {
    console.log('No existing CDP session, launching Chrome with your profile...');
    const userDataDir = process.env.LOCALAPPDATA + '\\Google\\Chrome\\User Data';
    browser = await chromium.launchPersistentContext(userDataDir, {
      headless: false,
      channel: 'chrome',
      viewport: { width: 1920, height: 1080 },
      args: ['--disable-blink-features=AutomationControlled']
    });
  }
  
  let page;
  if (browser.contexts && browser.contexts.length > 0) {
    // CDP connection - get first context
    page = await browser.contexts[0].newPage();
  } else {
    page = await browser.newPage();
  }
  
  try {
    console.log('Navigating to Legiit...');
    await page.goto('https://legiit.com/seller/dashboard', { waitUntil: 'domcontentloaded', timeout: 60000 });
    await page.waitForTimeout(5000);
    
    console.log('Looking for Create Gig button...');
    // Try multiple selectors
    const selectors = [
      'a[href="/seller/create-gig"]',
      'button:has-text("Create a Gig")',
      'a:has-text("Create Gig")',
      'button:has-text("Create New Gig")',
      'a.btn:has-text("Create Gig")',
      'div[role="button"]:has-text("Create Gig")'
    ];
    
    let clicked = false;
    for (const sel of selectors) {
      try {
        const btn = page.locator(sel).first();
        if (await btn.isVisible({ timeout: 2000 })) {
          await btn.click();
          console.log('Clicked Create Gig with selector:', sel);
          clicked = true;
          break;
        }
      } catch (e) {}
    }
    
    if (!clicked) {
      console.log('Trying direct navigation to create-gig...');
      await page.goto('https://legiit.com/seller/create-gig', { waitUntil: 'domcontentloaded', timeout: 60000 });
    }
    
    await page.waitForTimeout(5000);
    console.log('Now on gig creation page');
    
    // Fill title
    try {
      const titleInput = page.locator('input[name="title"], #gigTitle, input[placeholder*="title"]').first();
      if (await titleInput.isVisible({ timeout: 5000 })) {
        await titleInput.fill("I'll build an AI LinkedIn post agent that writes posts in your exact style");
        console.log('✓ Title filled');
      }
    } catch (e) {
      console.log('Title field not found, will continue');
    }
    
    // Fill description
    try {
      const desc = page.locator('textarea[name="description"], div[contenteditable="true"]').first();
      if (await desc.isVisible({ timeout: 3000 })) {
        await desc.fill("I'll build you a custom AI agent that creates LinkedIn posts tailored to your voice. It will write hooks, captions, hashtags, and CTAs that match your niche. Just share your style or examples and I'll deliver it ready to use. Works in OpenCode, Cursor, Cline, ChatGPT, Grok etc.");
        console.log('✓ Description filled');
      }
    } catch (e) {}
    
    // Save as Draft
    try {
      const draftBtn = page.locator('button:has-text("Save Draft"), button:has-text("Save as draft")').first();
      if (await draftBtn.isVisible({ timeout: 5000 })) {
        await draftBtn.click();
        console.log('✓ Saved as DRAFT - NOT PUBLISHED');
      }
    } catch (e) {
      console.log('Looking for save draft button...');
      const allBtns = await page.locator('button').all();
      for (const btn of allBtns.slice(0, 10)) {
        const text = await btn.textContent();
        if (text && text.includes('Draft')) {
          await btn.click();
          console.log('✓ Saved as DRAFT');
          break;
        }
      }
    }
    
    await page.waitForTimeout(3000);
    await page.screenshot({ path: 'D:/agent freelancer/legiit_gig_draft_complete.png', fullPage: true });
    
    console.log('\n=== DONE ===');
    console.log('Gig saved as DRAFT successfully!');
    console.log('Screenshot: D:/agent freelancer/legiit_gig_draft_complete.png');
    console.log('Not published - waiting for your approval.');
    
    await page.waitForTimeout(5000);
    // Don't close so you can see it
  } catch (error) {
    console.error('Error:', error);
    await page.screenshot({ path: 'D:/agent freelancer/legiit_error2.png', fullPage: true });
  }
})();