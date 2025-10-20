import { chromium } from '@playwright/test';

(async () => {
  const browser = await chromium.launch({ headless: true });
  const context = await browser.newContext();
  const page = await context.newPage();

  const logs = [];
  page.on('console', msg => {
    const text = msg.text();
    if (text.includes('ChatWidget') || text.includes('ApiClient') || text.includes('Debug')) {
      logs.push(text);
    }
  });

  try {
    await page.goto('http://localhost:3000', { waitUntil: 'networkidle' });
    await page.waitForTimeout(2000);

    // Click chat button
    await page.locator('[data-chat-open]').first().click();
    await page.waitForTimeout(2000);

    // Take screenshot
    await page.screenshot({ path: '/tmp/chat-debug.png', fullPage: true });
    console.log('Screenshot: /tmp/chat-debug.png');

    // Look for debug boxes
    const redBox = await page.locator('.bg-red-100').count();
    const greenBox = await page.locator('.bg-green-100').count();
    const yellowBox = await page.locator('.bg-yellow-50').count();

    console.log('\n=== Debug Boxes ===');
    console.log(`Red box (messages area debug): ${redBox}`);
    console.log(`Green box (render message): ${greenBox}`);
    console.log(`Yellow box (input area debug): ${yellowBox}`);

    if (yellowBox > 0) {
      const yellowText = await page.locator('.bg-yellow-50').first().textContent();
      console.log('\n=== Yellow Box Content ===');
      console.log(yellowText);
    }

    if (redBox > 0) {
      const redText = await page.locator('.bg-red-100').first().textContent();
      console.log('\n=== Red Box Content ===');
      console.log(redText);
    }

    if (greenBox > 0) {
      const greenText = await page.locator('.bg-green-100').first().textContent();
      console.log('\n=== Green Box Content ===');
      console.log(greenText);
    }

    // Get messages area HTML
    const messagesHTML = await page.locator('[role="log"]').first().innerHTML();
    console.log('\n=== Messages Area HTML (first 500 chars) ===');
    console.log(messagesHTML.substring(0, 500));

    console.log('\n=== Console Logs ===');
    logs.forEach(log => console.log(log));

  } catch (error) {
    console.error('Error:', error.message);
  } finally {
    await browser.close();
  }
})();
