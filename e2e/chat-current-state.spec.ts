import { test, expect } from '@playwright/test';

test('Current Chat Widget State', async ({ page }) => {
  // ホームページにアクセス
  await page.goto('http://localhost:3000');
  await page.waitForLoadState('networkidle');

  console.log('✓ Page loaded');

  // 全体のスクリーンショット
  await page.screenshot({ path: 'playwright-report/01-homepage.png', fullPage: false });
  console.log('✓ Homepage screenshot saved');

  // チャットボタンを探す（複数の方法で）
  const chatButtonByAria = page.locator('button[aria-label="チャットを開く"]');
  const chatButtonByClass = page.locator('button').filter({ hasText: /チャット/i });
  const anyButton = page.locator('button');

  const ariaExists = await chatButtonByAria.count();
  const classExists = await chatButtonByClass.count();
  const totalButtons = await anyButton.count();

  console.log(`✓ Buttons with aria-label="チャットを開く": ${ariaExists}`);
  console.log(`✓ Buttons with "チャット" text: ${classExists}`);
  console.log(`✓ Total buttons on page: ${totalButtons}`);

  // 右下エリアのスクリーンショット
  const viewport = page.viewportSize();
  if (viewport) {
    await page.screenshot({
      path: 'playwright-report/02-bottom-right.png',
      clip: {
        x: viewport.width - 200,
        y: viewport.height - 200,
        width: 200,
        height: 200
      }
    });
    console.log('✓ Bottom-right corner screenshot saved');
  }

  // もしチャットボタンが見つかったら
  if (ariaExists > 0) {
    console.log('✓ Chat button found! Clicking...');
    await chatButtonByAria.first().click({ force: true });
    await page.waitForTimeout(2000);

    // 全画面スクリーンショット（クリック後）
    await page.screenshot({ path: 'playwright-report/03-after-click.png', fullPage: false });
    console.log('✓ After-click screenshot saved');

    // チャットウィンドウのスクリーンショット
    const chatDialog = page.locator('[role="dialog"]');
    const dialogExists = await chatDialog.count();
    console.log(`✓ Dialog count: ${dialogExists}`);

    if (dialogExists > 0) {
      await chatDialog.screenshot({ path: 'playwright-report/03-chat-window.png' });
      console.log('✓ Chat window screenshot saved');

      // メッセージエリアの確認
      const messagesArea = page.locator('[role="log"]');
      const messagesExists = await messagesArea.count();
      console.log(`✓ Messages area count: ${messagesExists}`);

      if (messagesExists > 0) {
        await messagesArea.screenshot({ path: 'playwright-report/04-messages-area.png' });
        console.log('✓ Messages area screenshot saved');

        // メッセージエリアのHTML取得
        const html = await messagesArea.innerHTML();
        console.log('✓ Messages area HTML length:', html.length);

        // 子要素の数を確認
        const children = await messagesArea.locator('> div').count();
        console.log(`✓ Direct children in messages area: ${children}`);
      }
    }
  } else {
    console.log('✗ Chat button NOT found');
  }

  // ページ全体のHTML構造をファイルに保存
  const htmlContent = await page.content();
  await page.evaluate((html) => {
    console.log('Page HTML length:', html.length);
  }, htmlContent);
});
