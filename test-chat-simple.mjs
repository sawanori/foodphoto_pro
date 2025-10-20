import { chromium } from '@playwright/test';

(async () => {
  const browser = await chromium.launch({ headless: true });
  const context = await browser.newContext();
  const page = await context.newPage();

  // Only capture specific logs
  const importantLogs = [];
  page.on('console', msg => {
    const text = msg.text();
    if (text.includes('ApiClient') || text.includes('ChatWidget') || text.includes('messages')) {
      importantLogs.push(text);
    }
  });

  try {
    await page.goto('http://localhost:3002', { waitUntil: 'networkidle' });
    await page.waitForTimeout(2000);

    // Click chat button
    await page.locator('[data-chat-open]').first().click();
    await page.waitForTimeout(3000);

    // Get debug info
    const debugInfo = await page.locator('.bg-yellow-50').first().textContent();
    console.log('=== Debug Info ===');
    console.log(debugInfo);

    // Count elements in messages area
    const messagesAreaHTML = await page.locator('[role="log"]').first().innerHTML();
    console.log('\n=== Messages Area HTML (first 500 chars) ===');
    console.log(messagesAreaHTML.substring(0, 500));

    // Get all important console logs
    console.log('\n=== Console Logs ===');
    importantLogs.forEach(log => console.log(log));

  } catch (error) {
    console.error('Error:', error.message);
  } finally {
    await browser.close();
  }
})();
