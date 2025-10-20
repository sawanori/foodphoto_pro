#!/usr/bin/env node

/**
 * Test script to verify mock chat messages are displaying
 * This clears sessionStorage and checks if messages appear
 */

import { chromium } from '@playwright/test';

async function testMockChat() {
  console.log('🚀 Starting mock chat test...\n');

  const browser = await chromium.launch({ headless: false });
  const context = await browser.newContext();
  const page = await context.newPage();

  try {
    // Navigate to the page
    console.log('📍 Navigating to http://localhost:3000');
    await page.goto('http://localhost:3000', { waitUntil: 'networkidle' });

    // Clear sessionStorage to remove old conversationId
    console.log('🧹 Clearing sessionStorage...');
    await page.evaluate(() => {
      sessionStorage.clear();
      console.log('[TEST] SessionStorage cleared');
    });

    // Refresh to apply changes
    await page.reload({ waitUntil: 'networkidle' });

    // Wait a moment for page to settle
    await page.waitForTimeout(1000);

    // Try to find and click chat button
    console.log('🔍 Looking for chat button...');
    const chatButton = page.locator('[data-chat-open], button:has-text("チャット")').first();

    if (await chatButton.count() > 0) {
      console.log('✅ Found chat button, clicking...');
      await chatButton.click();
      await page.waitForTimeout(2000);
    } else {
      console.log('⚠️  Chat button not found, trying to open chat widget directly...');
    }

    // Check for chat widget
    const chatWidget = page.locator('div[role="dialog"][aria-label*="チャット"]');
    if (await chatWidget.count() > 0) {
      console.log('✅ Chat widget is visible');

      // Check debug info
      const debugInfo = await page.locator('.bg-yellow-100').textContent().catch(() => null);
      if (debugInfo) {
        console.log('\n📊 Debug Info:');
        console.log(debugInfo);
      }

      // Check for messages
      const messageCount = await page.locator('div[role="log"] .rounded-2xl').count();
      console.log(`\n💬 Messages found: ${messageCount}`);

      if (messageCount > 0) {
        console.log('\n✅ SUCCESS! Messages are displaying in the chat widget!\n');

        // Show first few messages
        const messages = await page.locator('div[role="log"] .rounded-2xl p.text-sm').allTextContents();
        console.log('First 3 messages:');
        messages.slice(0, 3).forEach((msg, i) => {
          console.log(`  ${i + 1}. ${msg.substring(0, 50)}${msg.length > 50 ? '...' : ''}`);
        });
      } else {
        console.log('\n❌ FAILED: No messages are displaying');

        // Take screenshot for debugging
        await page.screenshot({ path: '/tmp/chat-debug.png' });
        console.log('📸 Screenshot saved to /tmp/chat-debug.png');
      }

    } else {
      console.log('❌ Chat widget not found');
    }

    // Keep browser open for manual inspection
    console.log('\n⏸️  Browser will stay open for 30 seconds for manual inspection...');
    await page.waitForTimeout(30000);

  } catch (error) {
    console.error('❌ Test failed:', error);
    await page.screenshot({ path: '/tmp/chat-error.png' });
    console.log('📸 Error screenshot saved to /tmp/chat-error.png');
  } finally {
    await browser.close();
  }
}

testMockChat().catch(console.error);
