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
    if (text.includes('ChatWidget') || text.includes('ApiClient')) {
      console.log(`[CHAT LOG] ${text}`);
    }
  });

  try {
    console.log('=== Opening page ===');
    await page.goto('http://localhost:3000', { waitUntil: 'networkidle' });
    await page.waitForTimeout(3000);

    // Take full page screenshot
    await page.screenshot({ path: '/tmp/page-full.png', fullPage: true });
    console.log('Full page screenshot saved to /tmp/page-full.png');

    // Check if ChatWidget component exists in the page
    console.log('\n=== Checking for ChatWidget component ===');
    const chatWidgetExists = await page.evaluate(() => {
      const scripts = Array.from(document.querySelectorAll('script'));
      return scripts.some(s => s.textContent && s.textContent.includes('ChatWidget'));
    });
    console.log(`ChatWidget in page source: ${chatWidgetExists}`);

    // Check for chat open button
    console.log('\n=== Looking for chat open button ===');
    const chatButtons = await page.locator('[data-chat-open]').all();
    console.log(`Found ${chatButtons.length} elements with [data-chat-open]`);

    // Try different selectors
    const selectors = [
      'button:has-text("チャット")',
      'button:has-text("chat")',
      'a:has-text("チャット")',
      'a:has-text("chat")',
      '[role="dialog"]',
      'text=お気軽にご相談',
    ];

    for (const selector of selectors) {
      const count = await page.locator(selector).count();
      if (count > 0) {
        console.log(`Found ${count} elements with selector: ${selector}`);
      }
    }

    // Check FoodPhotoClient component
    console.log('\n=== Checking FoodPhotoClient ===');
    const foodPhotoClient = await page.locator('text=FoodPhotoClient').count();
    console.log(`FoodPhotoClient mentions: ${foodPhotoClient}`);

    // Check if there's a footer with chat link
    const footerChatLink = await page.locator('footer a, footer button').all();
    console.log(`Found ${footerChatLink.length} links/buttons in footer`);

    for (let i = 0; i < Math.min(footerChatLink.length, 10); i++) {
      const text = await footerChatLink[i].textContent();
      if (text && (text.includes('チャット') || text.includes('問い合わせ') || text.includes('相談'))) {
        console.log(`Footer link ${i}: ${text}`);
      }
    }

    // Look for where ChatWidget should be rendered
    console.log('\n=== Looking for ChatWidget render location ===');
    const bodyChildren = await page.evaluate(() => {
      const body = document.body;
      return Array.from(body.children).map(child => ({
        tag: child.tagName,
        id: child.id,
        className: child.className,
        hasDialogRole: child.querySelector('[role="dialog"]') !== null
      }));
    });
    console.log('Body children:', JSON.stringify(bodyChildren, null, 2));

    // Check all console logs for ChatWidget
    console.log('\n=== All ChatWidget/ApiClient related logs ===');
    const chatLogs = allLogs.filter(log =>
      log.includes('ChatWidget') ||
      log.includes('ApiClient') ||
      log.includes('chat')
    );

    if (chatLogs.length > 0) {
      chatLogs.forEach(log => console.log(log));
    } else {
      console.log('No ChatWidget or ApiClient logs found');
    }

    // Try to find where ChatWidget is imported
    console.log('\n=== Checking if ChatWidget is loaded ===');
    const hasReactComponents = await page.evaluate(() => {
      // Check if React DevTools can see components
      return typeof window !== 'undefined';
    });
    console.log(`Has window object: ${hasReactComponents}`);

  } catch (error) {
    console.error('Error during test:', error);
  } finally {
    await browser.close();
    console.log('\n=== Test complete ===');
  }
})();
