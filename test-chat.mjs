import { chromium } from '@playwright/test';

(async () => {
  const browser = await chromium.launch({ headless: true });
  const context = await browser.newContext();
  const page = await context.newPage();

  // Capture console logs
  const logs = [];
  page.on('console', msg => {
    const text = msg.text();
    logs.push(`[${msg.type()}] ${text}`);
    console.log(`[BROWSER CONSOLE] ${text}`);
  });

  try {
    console.log('=== Opening page ===');
    await page.goto('http://localhost:3000', { waitUntil: 'networkidle' });

    console.log('\n=== Looking for chat widget ===');
    // Wait for page to load
    await page.waitForTimeout(2000);

    // Try to find and click chat open button
    const chatButton = await page.locator('[data-chat-open]').first();
    const buttonExists = await chatButton.count() > 0;

    if (buttonExists) {
      console.log('Found chat button, clicking...');
      await chatButton.click();
      await page.waitForTimeout(1000);
    } else {
      console.log('No chat button found, checking if ChatWidget is directly rendered...');
    }

    // Check if chat widget is visible
    const chatWidget = await page.locator('[role="dialog"][aria-label*="チャット"]').first();
    const isVisible = await chatWidget.isVisible().catch(() => false);

    console.log(`\n=== Chat widget visible: ${isVisible} ===`);

    if (isVisible) {
      // Take screenshot of chat widget
      await page.screenshot({ path: '/tmp/chat-widget-initial.png', fullPage: true });
      console.log('Screenshot saved to /tmp/chat-widget-initial.png');

      // Check for debug info
      const debugInfo = await page.locator('.bg-yellow-100').first().textContent().catch(() => null);
      console.log('\n=== Debug Info ===');
      console.log(debugInfo || 'No debug info found');

      // Check messages
      const messageCount = await page.locator('[role="log"] .max-w-\\[75\\%\\]').count();
      console.log(`\n=== Message count: ${messageCount} ===`);

      // Get all messages
      if (messageCount > 0) {
        const messages = await page.locator('[role="log"] .max-w-\\[75\\%\\]').allTextContents();
        console.log('\n=== Messages ===');
        messages.forEach((msg, i) => {
          console.log(`Message ${i + 1}: ${msg}`);
        });
      }

      // Try sending a message
      console.log('\n=== Attempting to send message ===');
      const input = await page.locator('input[aria-label="メッセージ入力"]').first();
      await input.fill('テストメッセージ');
      await page.locator('button[aria-label="送信"]').first().click();

      console.log('Message sent, waiting for response...');
      await page.waitForTimeout(3000);

      // Take screenshot after sending
      await page.screenshot({ path: '/tmp/chat-widget-after-message.png', fullPage: true });
      console.log('Screenshot saved to /tmp/chat-widget-after-message.png');

      // Check debug info again
      const debugInfoAfter = await page.locator('.bg-yellow-100').first().textContent().catch(() => null);
      console.log('\n=== Debug Info After Message ===');
      console.log(debugInfoAfter || 'No debug info found');

      // Check messages again
      const messageCountAfter = await page.locator('[role="log"] .max-w-\\[75\\%\\]').count();
      console.log(`\n=== Message count after: ${messageCountAfter} ===`);

      if (messageCountAfter > 0) {
        const messagesAfter = await page.locator('[role="log"] .max-w-\\[75\\%\\]').allTextContents();
        console.log('\n=== Messages After ===');
        messagesAfter.forEach((msg, i) => {
          console.log(`Message ${i + 1}: ${msg}`);
        });
      }
    } else {
      console.log('Chat widget not visible, taking screenshot...');
      await page.screenshot({ path: '/tmp/page-no-chat.png', fullPage: true });
      console.log('Screenshot saved to /tmp/page-no-chat.png');
    }

    console.log('\n=== All Console Logs ===');
    const apiLogs = logs.filter(log => log.includes('ApiClient') || log.includes('ChatWidget'));
    if (apiLogs.length > 0) {
      apiLogs.forEach(log => console.log(log));
    } else {
      console.log('No ApiClient or ChatWidget logs found');
    }

  } catch (error) {
    console.error('Error during test:', error);
  } finally {
    await browser.close();
    console.log('\n=== Test complete ===');
  }
})();
