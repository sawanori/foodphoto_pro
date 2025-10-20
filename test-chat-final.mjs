import { chromium } from '@playwright/test';

(async () => {
  const browser = await chromium.launch({ headless: true });
  const context = await browser.newContext();
  const page = await context.newPage();

  // Capture console logs
  const chatLogs = [];
  page.on('console', msg => {
    const text = msg.text();
    if (text.includes('ChatWidget') || text.includes('ApiClient') || text.includes('Debug:')) {
      chatLogs.push(text);
      console.log(`[BROWSER] ${text}`);
    }
  });

  try {
    console.log('=== Opening page at http://localhost:3002 ===');
    await page.goto('http://localhost:3002', { waitUntil: 'networkidle' });
    await page.waitForTimeout(2000);

    console.log('\n=== Clicking chat open button ===');
    const chatButton = await page.locator('[data-chat-open]').first();
    await chatButton.click();
    await page.waitForTimeout(1000);

    // Take screenshot after clicking
    await page.screenshot({ path: '/tmp/chat-opened.png', fullPage: true });
    console.log('Screenshot saved to /tmp/chat-opened.png');

    // Check if chat widget is visible
    const chatWidget = await page.locator('[role="dialog"][aria-label*="チャット"]').first();
    const isVisible = await chatWidget.isVisible().catch(() => false);
    console.log(`\n=== Chat widget visible: ${isVisible} ===`);

    if (isVisible) {
      // Get debug info
      const debugInfo = await page.locator('.bg-yellow-100').first().textContent().catch(() => 'Not found');
      console.log('\n=== Debug Info from UI ===');
      console.log(debugInfo);

      // Count messages
      const messageCount = await page.locator('[role="log"] > div').count();
      console.log(`\n=== Total message elements: ${messageCount} ===`);

      // Try sending a message
      console.log('\n=== Sending test message ===');
      const input = await page.locator('input[aria-label="メッセージ入力"]').first();
      await input.fill('こんにちは');
      await page.locator('button[aria-label="送信"]').first().click();

      console.log('Waiting for response...');
      await page.waitForTimeout(5000);

      // Take screenshot after sending
      await page.screenshot({ path: '/tmp/chat-with-message.png', fullPage: true });
      console.log('Screenshot saved to /tmp/chat-with-message.png');

      // Get debug info again
      const debugInfoAfter = await page.locator('.bg-yellow-100').first().textContent().catch(() => 'Not found');
      console.log('\n=== Debug Info After Message ===');
      console.log(debugInfoAfter);

      // Count messages again
      const messageCountAfter = await page.locator('[role="log"] > div').count();
      console.log(`\n=== Total message elements after: ${messageCountAfter} ===`);

      // Get all message contents
      const messages = await page.locator('[role="log"] .whitespace-pre-wrap').allTextContents();
      console.log('\n=== All message contents ===');
      if (messages.length > 0) {
        messages.forEach((msg, i) => {
          console.log(`Message ${i + 1}: ${msg.substring(0, 100)}`);
        });
      } else {
        console.log('No messages found');
      }
    }

    console.log('\n=== All ChatWidget/ApiClient logs ===');
    if (chatLogs.length > 0) {
      chatLogs.forEach(log => console.log(log));
    } else {
      console.log('No ChatWidget or ApiClient logs captured');
    }

  } catch (error) {
    console.error('Error during test:', error);
    await page.screenshot({ path: '/tmp/error-screenshot.png', fullPage: true });
  } finally {
    await browser.close();
    console.log('\n=== Test complete ===');
  }
})();
