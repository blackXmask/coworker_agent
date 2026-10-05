const { chromium } = require('playwright');

(async () => {
  console.log('bro - opening Chrome with profile');
  
  // Just launch with persistent context - don't close existing windows
  const userDataDir = process.env.LOCALAPPDATA + '\\Google\\Chrome\\User Data';
  const context = await chromium.launchPersistentContext(userDataDir, {
    headless: false,
    channel: 'chrome',
    viewport: { width: 1280, height: 720 },
    args: ['--disable-blink-features=AutomationControlled'],
    // Don't close other contexts
    acceptDownloads: true
  });
  
  const page = await context.newPage();
  console.log('Opening Legiit seller dashboard...');
  await page.goto('https://legiit.com/seller/dashboard');
  console.log('Page opened. Please leave this window open - I will continue automation.');
  console.log('Current URL:', page.url());
  
  // Wait longer so we can see it
  await page.waitForTimeout(20000);
  
  console.log('Continuing...');
})();