import { chromium } from '@playwright/test';

(async () => {
  const browser = await chromium.launch({ headless: true });
  const context = await browser.newContext();
  const page = await context.newPage();

  try {
    console.log('Opening page...');
    await page.goto('http://localhost:3000', { waitUntil: 'networkidle' });
    await page.waitForTimeout(2000);

    console.log('Opening chat...');
    await page.locator('[data-chat-open]').first().click();
    await page.waitForTimeout(2000);

    // Get header element
    const header = page.locator('.bg-gradient-to-r.from-orange-500.to-red-500').first();

    // Get computed styles
    const styles = await header.evaluate(el => {
      const computed = window.getComputedStyle(el);
      const h3 = el.querySelector('h3');
      const p = el.querySelector('p');

      return {
        headerColor: computed.color,
        headerBg: computed.background,
        h3Color: h3 ? window.getComputedStyle(h3).color : 'not found',
        h3Text: h3 ? h3.textContent : 'not found',
        pColor: p ? window.getComputedStyle(p).color : 'not found',
        pText: p ? p.textContent : 'not found'
      };
    });

    console.log('\n=== Chat Header Styles ===');
    console.log('Header color:', styles.headerColor);
    console.log('H3 (飲食店撮影PhotoStudio) color:', styles.h3Color);
    console.log('H3 text:', styles.h3Text);
    console.log('P (お気軽に...) color:', styles.pColor);
    console.log('P text:', styles.pText);

    const isWhite = styles.h3Color === 'rgb(255, 255, 255)' && styles.pColor === 'rgb(255, 255, 255)';
    console.log('\n✓ Text is WHITE:', isWhite ? 'YES' : 'NO');

    // Take close-up screenshot of header
    const headerBox = await header.boundingBox();
    if (headerBox) {
      await page.screenshot({
        path: '/tmp/chat-header-closeup.png',
        clip: {
          x: headerBox.x,
          y: headerBox.y,
          width: headerBox.width,
          height: headerBox.height
        }
      });
      console.log('\nHeader screenshot: /tmp/chat-header-closeup.png');
    }

    // Full screenshot
    await page.screenshot({ path: '/tmp/chat-full.png', fullPage: true });
    console.log('Full screenshot: /tmp/chat-full.png');

  } catch (error) {
    console.error('Error:', error.message);
  } finally {
    await browser.close();
  }
})();
