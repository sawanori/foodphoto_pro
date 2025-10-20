import { test, expect } from '@playwright/test';

test('Simple Chat Widget Test', async ({ page }) => {
  // ホームページにアクセス
  await page.goto('http://localhost:3000');
  await page.waitForLoadState('networkidle');

  console.log('✓ Page loaded');

  // チャットボタンを探す
  const chatButton = page.locator('button[aria-label="チャットを開く"]');
  const buttonExists = await chatButton.count();
  console.log(`✓ Chat button count: ${buttonExists}`);

  if (buttonExists > 0) {
    // ボタンをクリック前の状態
    const dialogBefore = await page.locator('[role="dialog"]').count();
    console.log(`✓ Dialog count before click: ${dialogBefore}`);

    // ボタンをクリック
    await chatButton.click({ force: true });
    console.log('✓ Button clicked');

    // アニメーション完了を待つ
    await page.waitForTimeout(1000);

    // クリック後の状態
    const dialogAfter = await page.locator('[role="dialog"]').count();
    console.log(`✓ Dialog count after click: ${dialogAfter}`);

    // ヘッダーのテキストを確認
    const headerText = await page.locator('text=飲食店撮影PhotoStudio').count();
    console.log(`✓ Header text count: ${headerText}`);

    // チャットウィンドウの背景を確認
    const chatWindow = page.locator('.bg-white.md\\:rounded-2xl');
    const chatWindowCount = await chatWindow.count();
    console.log(`✓ Chat window count: ${chatWindowCount}`);

    // スクリーンショットを保存
    await page.screenshot({ path: '/tmp/chat-debug.png', fullPage: true });
    console.log('✓ Screenshot saved to /tmp/chat-debug.png');
  }
});
