import { chromium } from '@playwright/test';

(async () => {
  const browser = await chromium.launch({ headless: true });
  const context = await browser.newContext();
  const page = await context.newPage();

  try {
    await page.goto('http://localhost:3002', { waitUntil: 'networkidle' });
    await page.waitForTimeout(2000);

    // Check sessionStorage before opening chat
    const sessionStorageBefore = await page.evaluate(() => {
      const storage = {};
      for (let i = 0; i < sessionStorage.length; i++) {
        const key = sessionStorage.key(i);
        storage[key] = sessionStorage.getItem(key);
      }
      return storage;
    });

    console.log('=== SessionStorage before opening chat ===');
    console.log(JSON.stringify(sessionStorageBefore, null, 2));

    // Click chat button
    await page.locator('[data-chat-open]').first().click();
    await page.waitForTimeout(2000);

    // Check sessionStorage after opening chat
    const sessionStorageAfter = await page.evaluate(() => {
      const storage = {};
      for (let i = 0; i < sessionStorage.length; i++) {
        const key = sessionStorage.key(i);
        storage[key] = sessionStorage.getItem(key);
      }
      return storage;
    });

    console.log('\n=== SessionStorage after opening chat ===');
    console.log(JSON.stringify(sessionStorageAfter, null, 2));

    // Check cookies
    const cookies = await context.cookies();
    console.log('\n=== Cookies ===');
    console.log(JSON.stringify(cookies, null, 2));

  } catch (error) {
    console.error('Error:', error.message);
  } finally {
    await browser.close();
  }
})();
