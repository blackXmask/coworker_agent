const { chromium } = require('playwright');

(async () => {
  console.log('bro, launching Chrome with your profile...');
  const userDataDir = process.env.LOCALAPPDATA + '\\Google\\Chrome\\User Data';
  
  const context = await chromium.launchPersistentContext(userDataDir, {
    headless: false,
    channel: 'chrome',
    viewport: { width: 1920, height: 1080 },
    args: [
      '--disable-blink-features=AutomationControlled',
      '--disable-infobars'
    ]
  });
  
  const page = await context.newPage();
  
  try {
    console.log('Going to Legiit seller dashboard...');
    await page.goto('https://legiit.com/seller/dashboard', { waitUntil: 'networkidle', timeout: 90000 });
    await page.waitForTimeout(4000);
    
    console.log('Clicking Create Gig...');
    // Try direct button clicks
    const clicked = await page.evaluate(() => {
      const buttons = Array.from(document.querySelectorAll('a, button'));
      const createGig = buttons.find(b => b.textContent && b.textContent.includes('Create Gig'));
      if (createGig) {
        createGig.click();
        return true;
      }
      return false;
    });
    
    if (!clicked) {
      await page.goto('https://legiit.com/seller/create-gig', { waitUntil: 'networkidle', timeout: 90000 });
    }
    
    await page.waitForTimeout(5000);
    
    // Fill title
    await page.fill('input[name="title"], #title, input[placeholder*="Title"]', "I'll build an AI LinkedIn post agent that writes posts in your exact style");
    console.log('Title filled');
    
    // Fill description
    await page.fill('textarea[name="description"], div[contenteditable="true"]', "I'll build you a custom AI agent that creates LinkedIn posts tailored to your voice. It will write hooks, captions, hashtags, and CTAs that match your niche. Just share your style or examples and I'll deliver it ready to use. Works in OpenCode, Cursor, Cline, ChatGPT, Grok etc.");
    console.log('Description filled');
    
    // Save as draft
    await page.evaluate(() => {
      const btns = Array.from(document.querySelectorAll('button'));
      const draft = btns.find(b => b.textContent && (b.textContent.includes('Save Draft') || b.textContent.includes('Draft')));
      if (draft) draft.click();
    });
    console.log('Saved as DRAFT');
    
    await page.screenshot({ path: 'D:/agent freelancer/legiit_done.png', fullPage: true });
    console.log('DONE - Saved as Draft. Not published. Screenshot saved.');
  } catch (e) {
    console.error('err', e.message);
    await page.screenshot({ path: 'D:/agent freelancer/legiit_err.png', fullPage: true });
  }
})();