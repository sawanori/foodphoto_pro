import { chromium } from '@playwright/test';

(async () => {
  const browser = await chromium.launch({ headless: true });
  const context = await browser.newContext();
  const page = await context.newPage();

  const logs = [];
  page.on('console', msg => {
    const text = msg.text();
    if (text.includes('ChatWidget') || text.includes('ApiClient') || text.includes('messages')) {
      logs.push(text);
    }
  });

  try {
    await page.goto('http://localhost:3000', { waitUntil: 'networkidle' });
    await page.waitForTimeout(2000);

    await page.locator('[data-chat-open]').first().click();
    await page.waitForTimeout(2000);

    console.log('=== BEFORE sending message ===');
    const debugBefore = await page.locator('.bg-yellow-50').first().textContent();
    console.log(debugBefore);

    // Send message
    console.log('\n=== Sending message ===');
    await page.locator('input[aria-label="メッセージ入力"]').first().fill('テスト');
    await page.locator('button[aria-label="送信"]').first().click();
    await page.waitForTimeout(5000);

    console.log('\n=== AFTER sending message ===');
    const debugAfter = await page.locator('.bg-yellow-50').first().textContent();
    console.log(debugAfter);

    const redBox = await page.locator('.bg-red-100').first().textContent();
    console.log('\nRed box:', redBox);

    const greenBox = await page.locator('.bg-green-100').count();
    console.log('Green box count:', greenBox);

    if (greenBox > 0) {
      const greenText = await page.locator('.bg-green-100').first().textContent();
      console.log('Green box text:', greenText);
    }

    // Count actual message elements
    const messageElements = await page.locator('[role="log"] .max-w-\\[75\\%\\]').count();
    console.log('\nActual message bubble count:', messageElements);

    // Get all visible text in messages area
    const messagesAreaText = await page.locator('[role="log"]').first().textContent();
    console.log('\nMessages area visible text:');
    console.log(messagesAreaText);

    // Take screenshot
    await page.screenshot({ path: '/tmp/chat-after-send.png', fullPage: true });
    console.log('\nScreenshot: /tmp/chat-after-send.png');

    console.log('\n=== Relevant Console Logs ===');
    logs.slice(-15).forEach(log => console.log(log));

  } catch (error) {
    console.error('Error:', error.message);
  } finally {
    await browser.close();
  }
})();
