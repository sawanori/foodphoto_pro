import { chromium } from '@playwright/test';

(async () => {
  const browser = await chromium.launch({ headless: true });
  const context = await browser.newContext();
  const page = await context.newPage();

  try {
    await page.goto('http://localhost:3000', { waitUntil: 'networkidle' });
    await page.waitForTimeout(2000);

    // Click chat button
    await page.locator('[data-chat-open]').first().click();
    await page.waitForTimeout(1000);

    // Check header color
    const headerColor = await page.locator('.bg-gradient-to-r.from-orange-500.to-red-500').first().evaluate(el => {
      return window.getComputedStyle(el).color;
    });

    const h3Color = await page.locator('h3:has-text("飲食店撮影PhotoStudio")').first().evaluate(el => {
      return window.getComputedStyle(el).color;
    });

    const pColor = await page.locator('p:has-text("お気軽にご相談ください")').first().evaluate(el => {
      return window.getComputedStyle(el).color;
    });

    console.log('=== Header Text Colors ===');
    console.log(`Header div color: ${headerColor}`);
    console.log(`H3 color: ${h3Color}`);
    console.log(`P color: ${pColor}`);

    // Take screenshot
    await page.screenshot({ path: '/tmp/chat-header.png', fullPage: true });
    console.log('\nScreenshot saved: /tmp/chat-header.png');

    // Check if white (rgb(255, 255, 255))
    const isWhite = h3Color.includes('255, 255, 255') && pColor.includes('255, 255, 255');
    console.log(`\nText is white: ${isWhite ? 'YES ✓' : 'NO ✗'}`);

  } catch (error) {
    console.error('Error:', error.message);
  } finally {
    await browser.close();
  }
})();
