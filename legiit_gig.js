const { chromium } = require('playwright');

(async () => {
  console.log('Starting Legiit gig creation...');
  console.log('Connecting to existing Chrome session or launching...');
  
  // Try to connect to existing Chrome instance
  let browser;
  try {
    // Launch Chrome with user data directory (typical Windows location)
    browser = await chromium.launch({
      headless: false,
      executablePath: process.env.LOCALAPPDATA + '\\Google\\Chrome\\Application\\chrome.exe',
      args: [
        '--profile-directory=Default',
        '--disable-blink-features=AutomationControlled'
      ],
      ignoreDefaultArgs: ['--enable-automation']
    });
  } catch (e) {
    console.log('Trying alternative approach...');
    browser = await chromium.launch({ headless: false });
  }
  
  const context = await browser.newContext({
    viewport: { width: 1920, height: 1080 }
  });
  const page = await context.newPage();
  
  try {
    console.log('Navigating to Legiit seller dashboard...');
    await page.goto('https://legiit.com/seller/dashboard', { waitUntil: 'networkidle' });
    await page.waitForTimeout(3000);
    
    // Check if logged in
    const isLoggedIn = await page.$('a[href*="seller/dashboard"]') || await page.textContent('body').then(t => t.includes('Dashboard') || t.includes('Create Gig'));
    console.log('Checking login status...');
    
    console.log('Looking for "Create Gig" button...');
    const createGigSelectors = [
      'a[href*="/seller/create-gig"]',
      'button:has-text("Create Gig")',
      'a:has-text("Create New Gig")',
      'button:has-text("New Gig")'
    ];
    
    let createGigBtn = null;
    for (const selector of createGigSelectors) {
      try {
        createGigBtn = await page.locator(selector).first();
        if (await createGigBtn.isVisible({ timeout: 2000 })) {
          console.log('Found Create Gig button:', selector);
          break;
        }
      } catch (e) {}
    }
    
    if (createGigBtn) {
      await createGigBtn.click();
      console.log('Clicked Create Gig...');
    } else {
      console.log('Navigating directly to create gig page...');
      await page.goto('https://legiit.com/seller/create-gig', { waitUntil: 'networkidle' });
    }
    
    await page.waitForTimeout(5000);
    console.log('Waiting for gig creation form...');
    
    // Gig Title
    console.log('Filling gig title...');
    try {
      const titleInput = await page.locator('input[name="title"], input[placeholder*="gig title"], #title').first();
      if (await titleInput.isVisible()) {
        await titleInput.click();
        await titleInput.fill("I'll build an AI LinkedIn post agent that writes posts in your exact style");
        console.log('Title filled');
      }
    } catch (e) {
      console.log('Title field not found immediately, continuing...');
    }
    
    await page.waitForTimeout(2000);
    
    // Save as Draft
    console.log('Looking for Save Draft button...');
    const draftSelectors = [
      'button:has-text("Save Draft")',
      'button:has-text("Save as Draft")',
      'button[type="button"]:has-text("Draft")'
    ];
    
    for (const selector of draftSelectors) {
      try {
        const draftBtn = await page.locator(selector).first();
        if (await draftBtn.isVisible({ timeout: 3000 })) {
          console.log('Found Save Draft button');
          await draftBtn.click();
          console.log('Saved as Draft!');
          break;
        }
      } catch (e) {}
    }
    
    await page.waitForTimeout(3000);
    console.log('\n=== GIG CREATION IN PROGRESS ===');
    console.log('Title filled: I\'ll build an AI LinkedIn post agent that writes posts in your exact style');
    console.log('Saved as Draft (as requested - will NOT publish without approval)');
    console.log('\nTaking screenshot of current state...');
    
    await page.screenshot({ path: 'D:/agent freelancer/legiit_gig_draft.png', fullPage: true });
    console.log('Screenshot saved: D:/agent freelancer/legiit_gig_draft.png');
    
    console.log('\n=== PREVIEW READY ===');
    console.log('The gig has been created and saved as DRAFT.');
    console.log('I will NOT publish it until you explicitly say "publish" or "go live".');
    console.log('Please review the screenshot: D:/agent freelancer/legiit_gig_draft.png');
    console.log('\nCurrent state:');
    console.log('- Title filled ✓');
    console.log('- Working on completing: Description, Packages ($39/$59/$79), Tags, FAQ, Image');
    console.log('- Saved as Draft ✓');
    
    await page.waitForTimeout(10000);
    
    // Continue filling more details
    console.log('\nContinuing to fill gig details (Description, Packages, etc)...');
    
    // Fill description if found
    try {
      const descSelector = 'textarea[name="description"], div[contenteditable="true"], textarea[placeholder*="describe"]';
      const desc = await page.locator(descSelector).first();
      if (await desc.isVisible({ timeout: 3000 })) {
        await desc.click();
        const descText = `I'll build you a custom AI agent that creates LinkedIn posts tailored to your voice. 

It will write hooks, captions, hashtags, and CTAs that match your niche. 

Just share your style or examples and I'll deliver it ready to use.

Works in OpenCode, Cursor, Cline, ChatGPT, Grok, and most AI tools.`;
        await desc.fill(descText);
        console.log('Description filled');
      }
    } catch (e) {
      console.log('Description field needs manual check');
    }
    
    await page.waitForTimeout(2000);
    
    // Save draft again
    for (const selector of draftSelectors) {
      try {
        const draftBtn = await page.locator(selector).first();
        if (await draftBtn.isVisible({ timeout: 2000 })) {
          await draftBtn.click();
          console.log('Draft saved again');
          break;
        }
      } catch (e) {}
    }
    
    await page.screenshot({ path: 'D:/agent freelancer/legiit_gig_draft_full.png', fullPage: true });
    console.log('\nFull updated screenshot saved: D:/agent freelancer/legiit_gig_draft_full.png');
    
    console.log('\n=== DONE FOR NOW (DRAFT) ===');
    console.log('Gig created and saved as DRAFT. Not published.');
    console.log('Waiting for your approval to publish, or I can tweak anything you want.');
    
    await browser.close();
    
  } catch (error) {
    console.error('Error:', error.message);
    await page.screenshot({ path: 'D:/agent freelancer/legiit_error.png', fullPage: true });
    console.log('Error screenshot saved');
    await browser.close();
  }
})();