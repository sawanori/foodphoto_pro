import { test, expect } from '@playwright/test';

test('Chat Widget Messages Display', async ({ page }) => {
  // ホームページにアクセス
  await page.goto('http://localhost:3000');
  await page.waitForLoadState('networkidle');

  console.log('✓ Page loaded');

  // チャットボタンをクリック
  const chatButton = page.locator('button[aria-label="チャットを開く"]');
  await chatButton.click({ force: true });
  await page.waitForTimeout(1000);

  console.log('✓ Chat opened');

  // メッセージエリアを確認
  const messagesArea = page.locator('[role="log"]');
  const messagesAreaExists = await messagesArea.count();
  console.log(`✓ Messages area count: ${messagesAreaExists}`);

  if (messagesAreaExists > 0) {
    // メッセージエリアの子要素を確認
    const messages = await messagesArea.locator('> div').count();
    console.log(`✓ Message divs count: ${messages}`);

    // 特定のメッセージテキストを確認
    const msg1 = await page.locator('text=はじめまして！料理撮影のプロフェッショナル').count();
    const msg2 = await page.locator('text=料金について教えてください').count();
    const msg3 = await page.locator('text=スタンダードプランは44,000円').count();
    const msg4 = await page.locator('text=撮影の流れを知りたいです').count();
    const msg5 = await page.locator('text=撮影の流れは以下の通りです').count();
    const msg6 = await page.locator('text=納期はどのくらいですか').count();
    const msg7 = await page.locator('text=通常、撮影後1週間程度で納品').count();
    const msg8 = await page.locator('text=見積もりをお願いできますか').count();
    const msg9 = await page.locator('text=お見積もりをご希望の場合は').count();

    console.log(`✓ Message 1: ${msg1}`);
    console.log(`✓ Message 2: ${msg2}`);
    console.log(`✓ Message 3: ${msg3}`);
    console.log(`✓ Message 4: ${msg4}`);
    console.log(`✓ Message 5: ${msg5}`);
    console.log(`✓ Message 6: ${msg6}`);
    console.log(`✓ Message 7: ${msg7}`);
    console.log(`✓ Message 8: ${msg8}`);
    console.log(`✓ Message 9: ${msg9}`);

    // チャットウィンドウのスクリーンショット
    const chatDialog = page.locator('[role="dialog"]');
    await chatDialog.screenshot({ path: '/tmp/chat-widget.png' });
    console.log('✓ Chat widget screenshot saved to /tmp/chat-widget.png');

    // メッセージエリアだけのスクリーンショット
    await messagesArea.screenshot({ path: '/tmp/chat-messages.png' });
    console.log('✓ Messages area screenshot saved to /tmp/chat-messages.png');
  }
});
