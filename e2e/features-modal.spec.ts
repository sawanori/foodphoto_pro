import { test, expect } from '@playwright/test'

const devices = [
  { name: 'iPhone SE', width: 375, height: 667 },
  { name: 'iPhone SE Landscape', width: 667, height: 375 },
  { name: 'iPhone 12', width: 390, height: 844 },
  { name: 'iPhone 12 Landscape', width: 844, height: 390 },
  { name: 'iPad', width: 768, height: 1024 },
  { name: 'iPad Landscape', width: 1024, height: 768 },
  { name: 'Desktop', width: 1280, height: 800 },
  { name: 'Desktop Large', width: 1920, height: 1080 },
]

test.describe('Features Section Modal', () => {
  test.setTimeout(60000) // Increase timeout for loader animation

  for (const device of devices) {
    test(`should display modal correctly on ${device.name} (${device.width}x${device.height})`, async ({ page }) => {
      await page.setViewportSize({ width: device.width, height: device.height })
      await page.goto('/')

      // Wait for loader to disappear and features section to be visible
      await page.waitForSelector('#features', { state: 'visible', timeout: 30000 })

      // Scroll to features section
      await page.locator('#features').scrollIntoViewIfNeeded()
      await page.waitForTimeout(500)

      // Click on first feature card
      const featureCard = page.locator('[class*="aspect-square"]').first()
      await expect(featureCard).toBeVisible()
      await featureCard.click()

      // Wait for modal to appear (use more specific selector to avoid loader conflict)
      const modal = page.locator('.fixed.inset-0.z-50.bg-black\\/70')
      await expect(modal).toBeVisible()

      // Get modal inner container
      const modalContent = modal.locator('.bg-gray-800').first()
      await expect(modalContent).toBeVisible()

      // Verify modal dimensions are reasonable
      const boundingBox = await modalContent.boundingBox()
      expect(boundingBox).toBeTruthy()

      if (boundingBox) {
        // Modal should not exceed viewport
        expect(boundingBox.height).toBeLessThanOrEqual(device.height)
        expect(boundingBox.width).toBeLessThanOrEqual(device.width)

        // Modal should have reasonable minimum size
        expect(boundingBox.height).toBeGreaterThanOrEqual(260) // min image + min content
        expect(boundingBox.width).toBeGreaterThanOrEqual(300)
      }

      // Check that title is visible and not overflowing
      const title = modal.locator('h2')
      await expect(title).toBeVisible()

      // Check that description is visible
      const description = modal.locator('p').last()
      await expect(description).toBeVisible()

      // Check close button is visible and clickable
      const closeButton = modal.locator('button[aria-label="閉じる"]')
      await expect(closeButton).toBeVisible()

      // Test close functionality
      await closeButton.click()
      await expect(modal).not.toBeVisible()
    })
  }

  test('should close modal with Escape key', async ({ page }) => {
    await page.setViewportSize({ width: 1280, height: 800 })
    await page.goto('/')
    await page.waitForSelector('#features', { state: 'visible', timeout: 30000 })

    await page.locator('#features').scrollIntoViewIfNeeded()
    await page.waitForTimeout(500)

    const featureCard = page.locator('[class*="aspect-square"]').first()
    await featureCard.click()

    const modal = page.locator('.fixed.inset-0.z-50.bg-black\\/70')
    await expect(modal).toBeVisible()

    // Press Escape
    await page.keyboard.press('Escape')
    await expect(modal).not.toBeVisible()
  })

  test('should close modal by clicking backdrop', async ({ page }) => {
    await page.setViewportSize({ width: 1280, height: 800 })
    await page.goto('/')
    await page.waitForSelector('#features', { state: 'visible', timeout: 30000 })

    await page.locator('#features').scrollIntoViewIfNeeded()
    await page.waitForTimeout(500)

    const featureCard = page.locator('[class*="aspect-square"]').first()
    await featureCard.click()

    const modal = page.locator('.fixed.inset-0.z-50.bg-black\\/70')
    await expect(modal).toBeVisible()

    // Click on backdrop (outside modal content)
    await modal.click({ position: { x: 10, y: 10 } })
    await expect(modal).not.toBeVisible()
  })

  test('should prevent body scroll when modal is open', async ({ page }) => {
    await page.setViewportSize({ width: 1280, height: 800 })
    await page.goto('/')
    await page.waitForSelector('#features', { state: 'visible', timeout: 30000 })

    await page.locator('#features').scrollIntoViewIfNeeded()
    await page.waitForTimeout(500)

    const featureCard = page.locator('[class*="aspect-square"]').first()
    await featureCard.click()

    const modal = page.locator('.fixed.inset-0.z-50.bg-black\\/70')
    await expect(modal).toBeVisible()

    // Check body has overflow hidden
    const bodyOverflow = await page.evaluate(() => {
      return window.getComputedStyle(document.body).overflow
    })
    expect(bodyOverflow).toBe('hidden')
  })
})
