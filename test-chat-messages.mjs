import { chromium } from '@playwright/test';

(async () => {
  const browser = await chromium.launch({ headless: true });
  const context = await browser.newContext();
  const page = await context.newPage();

  // Capture all console logs
  const allLogs = [];
  page.on('console', msg => {
    const text = msg.text();
    allLogs.push(text);
    console.log(`[BROWSER] ${text}`);
  });

  try {
    console.log('=== Opening page at http://localhost:3002 ===');
    await page.goto('http://localhost:3002', { waitUntil: 'networkidle' });
    await page.waitForTimeout(2000);

    console.log('\n=== Clicking chat button ===');
    const chatButton = await page.locator('[data-chat-open]').first();
    await chatButton.click();
    await page.waitForTimeout(2000);

    // Take screenshot
    await page.screenshot({ path: '/tmp/chat-real-test.png', fullPage: true });
    console.log('Screenshot saved to /tmp/chat-real-test.png');

    // Get debug info
    const debugInfo = await page.locator('.bg-yellow-50').first().textContent().catch(() => null);
    console.log('\n=== Debug Info ===');
    console.log(debugInfo || 'Debug info not found');

    // Count message containers in the messages area
    const messagesArea = page.locator('[role="log"]').first();
    const allDivs = await messagesArea.locator('> div, > .flex').count();
    console.log(`\n=== Total divs in messages area: ${allDivs} ===`);

    // Check for message bubbles
    const messageBubbles = await page.locator('[role="log"] .max-w-\\[75\\%\\]').count();
    console.log(`=== Message bubbles found: ${messageBubbles} ===`);

    // Check for "no messages" text
    const noMessagesText = await page.locator('text=メッセージがありません').count();
    console.log(`=== "No messages" text found: ${noMessagesText} ===`);

    // Get all text in messages area
    const messagesAreaText = await messagesArea.textContent();
    console.log('\n=== Messages area content ===');
    console.log(messagesAreaText);

    // Check network requests
    console.log('\n=== Filtering API logs ===');
    const apiLogs = allLogs.filter(log =>
      log.includes('ApiClient') ||
      log.includes('ChatWidget') ||
      log.includes('Response data:') ||
      log.includes('Messages count:')
    );

    if (apiLogs.length > 0) {
      console.log('\n=== API Related Logs ===');
      apiLogs.forEach(log => console.log(log));
    } else {
      console.log('No API logs found');
    }

    // Try to get actual message elements
    console.log('\n=== Inspecting DOM structure ===');
    const domStructure = await page.locator('[role="log"]').first().evaluate(el => {
      return {
        children: el.children.length,
        childTags: Array.from(el.children).map(child => ({
          tag: child.tagName,
          className: child.className,
          textContent: child.textContent?.substring(0, 100)
        }))
      };
    });
    console.log('Messages area DOM:', JSON.stringify(domStructure, null, 2));

  } catch (error) {
    console.error('Error during test:', error);
    await page.screenshot({ path: '/tmp/error-screenshot.png', fullPage: true });
  } finally {
    await browser.close();
    console.log('\n=== Test complete ===');
  }
})();
