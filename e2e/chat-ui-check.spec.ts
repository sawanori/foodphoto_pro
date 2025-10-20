import { test, expect } from '@playwright/test';

test('Chat Widget UI Verification', async ({ page }) => {
  // ホームページにアクセス
  await page.goto('http://localhost:3000');

  // ページが読み込まれるまで待つ
  await page.waitForLoadState('networkidle');

  // チャットボタンを探す
  const chatButton = page.locator('button[aria-label="チャットを開く"]');

  // チャットボタンが見えるか確認
  await expect(chatButton).toBeVisible({ timeout: 10000 });
  console.log('✓ Chat button found');

  // チャットボタンをクリック
  await chatButton.click();

  // チャットウィンドウが開くのを待つ
  await page.waitForTimeout(1000);

  // チャットウィンドウの全体スクリーンショット
  await page.screenshot({ path: 'playwright-report/chat-widget-full.png', fullPage: false });
  console.log('✓ Full page screenshot saved');

  // チャットウィンドウのエリアを取得
  const chatWindow = page.locator('[role="dialog"]');
  await expect(chatWindow).toBeVisible();
  console.log('✓ Chat window is visible');

  // チャットウィンドウのスクリーンショット
  await chatWindow.screenshot({ path: 'playwright-report/chat-window.png' });
  console.log('✓ Chat window screenshot saved');

  // メッセージエリアを探す
  const messagesArea = page.locator('[role="log"]');

  // メッセージが見えるか確認
  const messages = page.locator('[role="log"] div');
  const messageCount = await messages.count();
  console.log(`✓ Found ${messageCount} messages`);

  // メッセージエリアのスクリーンショット
  await messagesArea.screenshot({ path: 'playwright-report/messages-area.png' });
  console.log('✓ Messages area screenshot saved');

  // デバッグ用：黄色いバーを探す
  const debugBar = page.locator('text=Messages:');
  const isVisible = await debugBar.isVisible().catch(() => false);
  console.log(`✓ Debug bar visible: ${isVisible}`);

  if (isVisible) {
    const debugText = await debugBar.textContent();
    console.log(`✓ Debug text: ${debugText}`);
  }
});
