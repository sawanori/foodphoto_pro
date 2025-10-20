import { chromium } from '@playwright/test';

(async () => {
  const browser = await chromium.launch({ headless: true });
  const context = await browser.newContext();
  const page = await context.newPage();

  const logs = [];
  page.on('console', msg => {
    const text = msg.text();
    if (text.includes('ApiClient') || text.includes('ChatWidget') || text.includes('Debug:')) {
      logs.push(text);
    }
  });

  try {
    console.log('=== Step 1: Open page and chat ===');
    await page.goto('http://localhost:3000', { waitUntil: 'networkidle' });
    await page.waitForTimeout(2000);

    await page.locator('[data-chat-open]').first().click();
    await page.waitForTimeout(2000);

    const debugInfo1 = await page.locator('.bg-yellow-50').first().textContent();
    console.log('Debug info 1:', debugInfo1);

    console.log('\n=== Step 2: Send a message ===');
    await page.locator('input[aria-label="メッセージ入力"]').first().fill('テストメッセージ1');
    await page.locator('button[aria-label="送信"]').first().click();
    await page.waitForTimeout(4000);

    const debugInfo2 = await page.locator('.bg-yellow-50').first().textContent();
    console.log('Debug info 2:', debugInfo2);

    // Get sessionStorage
    const conversationId = await page.evaluate(() => {
      return sessionStorage.getItem('chat_conversation_id');
    });
    console.log('Conversation ID:', conversationId);

    console.log('\n=== Step 3: Close and reopen chat ===');
    // Close chat (click outside or close button)
    await page.evaluate(() => {
      // Trigger the close handler
      const closeButton = document.querySelector('[role="dialog"]')?.parentElement;
      if (closeButton) {
        // Try to find close method
      }
    });
    await page.waitForTimeout(1000);

    // Reload page to simulate fresh visit
    console.log('\n=== Step 4: Reload page (simulating return visit) ===');
    await page.reload({ waitUntil: 'networkidle' });
    await page.waitForTimeout(2000);

    // Open chat again
    await page.locator('[data-chat-open]').first().click();
    await page.waitForTimeout(3000);

    const debugInfo3 = await page.locator('.bg-yellow-50').first().textContent();
    console.log('Debug info 3 (after reload):', debugInfo3);

    const messagesAreaHTML = await page.locator('[role="log"]').first().innerHTML();
    console.log('\nMessages area HTML (first 300 chars):', messagesAreaHTML.substring(0, 300));

    console.log('\n=== All relevant logs ===');
    logs.forEach(log => console.log(log));

  } catch (error) {
    console.error('Error:', error.message);
  } finally {
    await browser.close();
  }
})();
