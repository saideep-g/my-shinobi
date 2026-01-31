import { test, expect } from '@playwright/test';

/**
 * THE ROBOT STUDENT (E2E)
 * Simulates a student completing a 3-question "Speed Run" session.
 */

test.describe('Student Quest Flow', () => {

    test('should complete a quest and show the summary screen', async ({ page }) => {
        // 0. Step: Handle Login (Since routes are protected)
        await page.goto('/login');
        await page.click('[data-testid="login-button"]');

        // Wait for redirect to dashboard
        await expect(page).toHaveURL(/\/quest/);

        // 1. Navigate to a specific subject path
        await page.goto('/quest/english-g7');

        // 2. Ensure the Daily Mission card is visible
        await expect(page.locator('text=Daily Mission')).toBeVisible();

        // 3. Start the session (Clicking the first unlocked atom)
        await page.click('[data-testid="start-quest-btn"]');

        // Verify we are in the practice arena
        await expect(page).toHaveURL(/\/play/);

        // 4. Answer 3 questions (Simulating the 3-question Test Mode from Phase 46)
        for (let i = 0; i < 3; i++) {
            // Find the first option and click it
            // We added '.question-option' class to MCQ buttons
            const option = page.locator('.question-option').first();
            await option.click();

            // Click "Submit" (Now a Two-Step process as requested)
            await page.click('button:has-text("Submit")');

            // Wait for feedback animation
            await page.waitForTimeout(600);

            // Click "Next" (Continued to Next Challenge)
            // Using "Next" to match user's request, component has text "Continue to Next Challenge"
            await page.click('button:has-text("Next")');
        }

        // 5. Verify the "Quest Complete" screen appears
        // The component has "QUEST COMPLETE!" in the header
        await expect(page.locator('text=QUEST COMPLETE!')).toBeVisible({ timeout: 10000 });

        // 6. Check if XP was awarded
        const xpText = await page.locator('text=Power Points').textContent();
        expect(parseInt(xpText?.replace(/\D/g, '') || "0")).toBeGreaterThan(0);
    });
});
