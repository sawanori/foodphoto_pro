#!/usr/bin/env node

/**
 * Final verification test for mock chat messages
 * Tests auto-clear functionality and message display
 */

import { chromium } from '@playwright/test';

async function verifyMockChat() {
  console.log('🎯 Final Verification Test for Mock Chat\n');

  const browser = await chromium.launch({ headless: false });
  const context = await browser.newContext();
  const page = await context.newPage();

  try {
    // Set up console logging
    page.on('console', msg => {
      if (msg.text().includes('[ChatWidget]')) {
        console.log('  📝', msg.text());
      }
    });

    // Navigate to the page
    console.log('1️⃣  Navigating to http://localhost:3000');
    await page.goto('http://localhost:3000', { waitUntil: 'networkidle' });
    await page.waitForTimeout(1000);

    // Add a fake old conversationId to test auto-clear
    console.log('2️⃣  Adding fake old conversationId to test auto-clear...');
    await page.evaluate(() => {
      sessionStorage.setItem('chat_conversation_id', 'old-fake-id-from-supabase');
    });

    // Find and click chat button
    console.log('3️⃣  Opening chat widget...');
    const chatButton = page.locator('[data-chat-open], button:has-text("チャット")').first();

    if (await chatButton.count() > 0) {
      await chatButton.click();
      await page.waitForTimeout(3000); // Wait for initialization
    }

    // Check for chat widget
    const chatWidget = page.locator('div[role="dialog"][aria-label*="チャット"]');

    if (await chatWidget.count() === 0) {
      console.log('❌ Chat widget not found');
      await browser.close();
      return;
    }

    console.log('4️⃣  Chat widget opened successfully\n');

    // Wait for messages to load
    await page.waitForTimeout(2000);

    // Check for messages
    const messageElements = page.locator('div[role="log"] .rounded-2xl');
    const messageCount = await messageElements.count();

    console.log('📊 Results:');
    console.log(`  💬 Total messages: ${messageCount}`);

    if (messageCount === 6) {
      console.log('  ✅ Correct number of messages (6)');

      // Get all message texts
      const messages = await page.locator('div[role="log"] .rounded-2xl p.text-sm').allTextContents();

      console.log('\n📝 Message Timeline:');
      messages.forEach((msg, i) => {
        const role = i === 0 ? 'システム' : i % 2 === 1 ? 'ユーザー' : '運営';
        const preview = msg.substring(0, 40).replace(/\n/g, ' ');
        console.log(`  ${i + 1}. [${role}] ${preview}${msg.length > 40 ? '...' : ''}`);
      });

      // Verify message content
      const expectedMessages = [
        'はじめまして！料理撮影のプロフェッショナル',
        '料金について教えてください',
        'お問い合わせありがとうございます',
        'スタンダードプランで検討しています',
        '撮影の流れをご説明させていただきます',
        'ありがとうございます！来週の撮影をお願いできますか'
      ];

      let allCorrect = true;
      expectedMessages.forEach((expected, i) => {
        if (!messages[i]?.includes(expected.substring(0, 20))) {
          console.log(`  ⚠️  Message ${i + 1} doesn't match expected content`);
          allCorrect = false;
        }
      });

      if (allCorrect) {
        console.log('\n✅ ✅ ✅ SUCCESS! All messages are displaying correctly! ✅ ✅ ✅\n');
        console.log('チャットタイムラインに以下が表示されています：');
        console.log('  - システムメッセージ（ウェルカムメッセージ）');
        console.log('  - ユーザーからの質問（3件）');
        console.log('  - 運営からの回答（2件）');
        console.log('\nモックモードが正常に動作しています！\n');
      } else {
        console.log('\n⚠️  Messages are displaying but content doesn\'t match exactly\n');
      }
    } else {
      console.log(`  ❌ Expected 6 messages, but got ${messageCount}`);

      if (messageCount > 0) {
        const messages = await page.locator('div[role="log"] .rounded-2xl p.text-sm').allTextContents();
        console.log('\n  Found messages:');
        messages.forEach((msg, i) => {
          console.log(`    ${i + 1}. ${msg.substring(0, 50)}`);
        });
      }

      // Take screenshot for debugging
      await page.screenshot({ path: '/tmp/chat-verification-failed.png' });
      console.log('\n  📸 Screenshot saved to /tmp/chat-verification-failed.png');
    }

    // Keep browser open for inspection
    console.log('\n⏸️  Keeping browser open for 20 seconds for inspection...');
    await page.waitForTimeout(20000);

  } catch (error) {
    console.error('\n❌ Test failed with error:', error.message);
    await page.screenshot({ path: '/tmp/chat-verification-error.png' });
    console.log('📸 Error screenshot saved to /tmp/chat-verification-error.png');
  } finally {
    await browser.close();
  }
}

verifyMockChat().catch(console.error);
