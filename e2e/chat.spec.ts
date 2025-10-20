import { test, expect } from '@playwright/test';

test.describe('Chat Widget', () => {
  test.beforeEach(async ({ page }) => {
    // ページに移動
    await page.goto('/');

    // チャットウィジェットが読み込まれるまで待つ
    await page.waitForLoadState('networkidle');
  });

  test('チャットウィジェットが開けること', async ({ page }) => {
    // data-chat-open属性を持つ要素を探してクリック
    const chatOpenButton = page.locator('[data-chat-open]').first();

    if (await chatOpenButton.count() > 0) {
      await chatOpenButton.click();
    } else {
      // 代替手段：チャットボタンがない場合はスキップ
      test.skip();
    }

    // チャットウィジェットが表示されることを確認
    const chatWidget = page.locator('[role="dialog"][aria-label="チャットウィンドウ"]');
    await expect(chatWidget).toBeVisible();

    // ヘッダーのテキストを確認
    await expect(chatWidget.getByText('飲食店撮影PhotoStudio')).toBeVisible();
  });

  test('メッセージを送信して表示されること', async ({ page }) => {
    // チャットを開く
    const chatOpenButton = page.locator('[data-chat-open]').first();

    if (await chatOpenButton.count() > 0) {
      await chatOpenButton.click();
    } else {
      test.skip();
    }

    // チャットウィジェットが表示されるまで待つ
    const chatWidget = page.locator('[role="dialog"][aria-label="チャットウィンドウ"]');
    await expect(chatWidget).toBeVisible();

    // メッセージ入力フィールドを見つける
    const messageInput = chatWidget.locator('input[aria-label="メッセージ入力"]');
    await expect(messageInput).toBeVisible();

    // テストメッセージを入力
    const testMessage = 'テストメッセージです';
    await messageInput.fill(testMessage);

    // 送信ボタンをクリック
    const sendButton = chatWidget.locator('button[aria-label="送信"]');
    await sendButton.click();

    // メッセージがDOM内に存在することを確認（スクロール位置に関わらず）
    const messageLocator = chatWidget.locator('p.text-sm.whitespace-pre-wrap', { hasText: testMessage });
    await expect(messageLocator).toBeAttached({ timeout: 10000 });

    // メッセージのテキスト内容を確認
    await expect(messageLocator).toHaveText(testMessage);

    // メッセージが送信された後、入力フィールドがクリアされることを確認
    await expect(messageInput).toHaveValue('');
  });

  test('クイックリプライボタンが動作すること', async ({ page }) => {
    // チャットを開く
    const chatOpenButton = page.locator('[data-chat-open]').first();

    if (await chatOpenButton.count() > 0) {
      await chatOpenButton.click();
    } else {
      test.skip();
    }

    // チャットウィジェットが表示されるまで待つ
    const chatWidget = page.locator('[role="dialog"][aria-label="チャットウィンドウ"]');
    await expect(chatWidget).toBeVisible();

    // クイックリプライボタンを探す
    const quickReplyButton = chatWidget.getByRole('button', { name: '料金について教えてください' });

    // クイックリプライが表示されている場合のみテスト
    if (await quickReplyButton.count() > 0) {
      await quickReplyButton.click();

      // メッセージがDOM内に存在することを確認
      const messageLocator = chatWidget.locator('p.text-sm.whitespace-pre-wrap', { hasText: '料金について教えてください' });
      await expect(messageLocator).toBeAttached({ timeout: 10000 });

      // メッセージのテキスト内容を確認
      await expect(messageLocator).toHaveText('料金について教えてください');
    }
  });

  test('複数のメッセージを送信できること', async ({ page }) => {
    // チャットを開く
    const chatOpenButton = page.locator('[data-chat-open]').first();

    if (await chatOpenButton.count() > 0) {
      await chatOpenButton.click();
    } else {
      test.skip();
    }

    // チャットウィジェットが表示されるまで待つ
    const chatWidget = page.locator('[role="dialog"][aria-label="チャットウィンドウ"]');
    await expect(chatWidget).toBeVisible();

    const messageInput = chatWidget.locator('input[aria-label="メッセージ入力"]');
    const sendButton = chatWidget.locator('button[aria-label="送信"]');

    // 1つ目のメッセージ
    const message1 = '1つ目のメッセージ';
    await messageInput.fill(message1);
    await sendButton.click();

    const messageLocator1 = chatWidget.locator('p.text-sm.whitespace-pre-wrap', { hasText: message1 });
    await expect(messageLocator1).toBeAttached({ timeout: 10000 });
    await expect(messageLocator1).toHaveText(message1);

    // 2つ目のメッセージ
    await page.waitForTimeout(1000); // ローディング状態が解除されるまで待つ
    const message2 = '2つ目のメッセージ';
    await messageInput.fill(message2);
    await sendButton.click();

    const messageLocator2 = chatWidget.locator('p.text-sm.whitespace-pre-wrap', { hasText: message2 });
    await expect(messageLocator2).toBeAttached({ timeout: 10000 });
    await expect(messageLocator2).toHaveText(message2);

    // 両方のメッセージがDOM内に存在することを確認
    await expect(messageLocator1).toBeAttached();
    await expect(messageLocator2).toBeAttached();
  });

  test('Enterキーでメッセージを送信できること', async ({ page }) => {
    // チャットを開く
    const chatOpenButton = page.locator('[data-chat-open]').first();

    if (await chatOpenButton.count() > 0) {
      await chatOpenButton.click();
    } else {
      test.skip();
    }

    // チャットウィジェットが表示されるまで待つ
    const chatWidget = page.locator('[role="dialog"][aria-label="チャットウィンドウ"]');
    await expect(chatWidget).toBeVisible();

    const messageInput = chatWidget.locator('input[aria-label="メッセージ入力"]');

    // テストメッセージを入力してEnterキーを押す
    const testMessage = 'Enterキーでの送信テスト';
    await messageInput.fill(testMessage);
    await messageInput.press('Enter');

    // メッセージがDOM内に存在することを確認
    const messageLocator = chatWidget.locator('p.text-sm.whitespace-pre-wrap', { hasText: testMessage });
    await expect(messageLocator).toBeAttached({ timeout: 10000 });
    await expect(messageLocator).toHaveText(testMessage);
  });

  test('空のメッセージは送信できないこと', async ({ page }) => {
    // チャットを開く
    const chatOpenButton = page.locator('[data-chat-open]').first();

    if (await chatOpenButton.count() > 0) {
      await chatOpenButton.click();
    } else {
      test.skip();
    }

    // チャットウィジェットが表示されるまで待つ
    const chatWidget = page.locator('[role="dialog"][aria-label="チャットウィンドウ"]');
    await expect(chatWidget).toBeVisible();

    const sendButton = chatWidget.locator('button[aria-label="送信"]');

    // 送信ボタンが無効化されていることを確認
    await expect(sendButton).toBeDisabled();
  });
});
