import { test, expect } from '@playwright/test';

test('Chat Widget Visual Verification', async ({ page }) => {
  // ホームページにアクセス
  await page.goto('http://localhost:3000');
  await page.waitForLoadState('networkidle');

  // チャットボタンをクリック
  const chatButton = page.locator('button[aria-label="チャットを開く"]');
  await chatButton.click({ force: true });

  // アニメーション完了を十分待つ
  await page.waitForTimeout(2000);

  // チャットダイアログ全体のスクリーンショット（高品質）
  const chatDialog = page.locator('[role="dialog"]');

  // ページ全体のスクリーンショット
  await page.screenshot({
    path: '/tmp/chat-fullpage.png',
    fullPage: false,
    animations: 'disabled'
  });
  console.log('✓ Full page screenshot saved');

  // メッセージエリアまでスクロール
  const messagesArea = page.locator('[role="log"]');
  await messagesArea.evaluate((el) => {
    el.scrollTop = 0; // トップにスクロール
  });
  await page.waitForTimeout(500);

  // トップ部分のスクリーンショット
  await chatDialog.screenshot({
    path: '/tmp/chat-top.png',
    animations: 'disabled'
  });
  console.log('✓ Chat top screenshot saved');

  // 中間までスクロール
  await messagesArea.evaluate((el) => {
    el.scrollTop = el.scrollHeight / 2;
  });
  await page.waitForTimeout(500);

  await chatDialog.screenshot({
    path: '/tmp/chat-middle.png',
    animations: 'disabled'
  });
  console.log('✓ Chat middle screenshot saved');

  // 最下部までスクロール
  await messagesArea.evaluate((el) => {
    el.scrollTop = el.scrollHeight;
  });
  await page.waitForTimeout(500);

  await chatDialog.screenshot({
    path: '/tmp/chat-bottom.png',
    animations: 'disabled'
  });
  console.log('✓ Chat bottom screenshot saved');

  // メッセージカウント確認
  const messageCount = await messagesArea.locator('> div').count();
  console.log(`✓ Total message divs: ${messageCount}`);

  // 各メッセージの可視性を確認
  const visibleMessages = await messagesArea.locator('> div').evaluateAll((divs) => {
    return divs.map((div, index) => ({
      index,
      visible: div.offsetHeight > 0,
      height: div.offsetHeight,
      text: div.textContent?.substring(0, 50)
    }));
  });

  console.log('✓ Message visibility:', JSON.stringify(visibleMessages, null, 2));
});
