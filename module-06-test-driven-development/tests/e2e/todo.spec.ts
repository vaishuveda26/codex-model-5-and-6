import { expect, test } from '@playwright/test';

test.describe('E2E ToDo flow', () => {
  test('TC-E2E-001: create task and mark complete', async ({ page }) => {
    await page.goto('/');

    await page.getByLabel('Task title').fill('Playwright task');
    await page.getByLabel('Optional due date').fill('2030-02-01');
    await page.getByLabel('Notes/details').fill('Created by e2e');
    await page.getByRole('button', { name: 'Save task to backend' }).click();

    await expect(page.getByText('Playwright task')).toBeVisible();

    await page.getByRole('button', { name: 'Mark complete' }).first().click();
    await expect(page.getByRole('button', { name: 'Mark undone' }).first()).toBeVisible();
  });

  test('TC-E2E-002: empty title blocked by validation', async ({ page }) => {
    await page.goto('/');
    await page.getByRole('button', { name: 'Save task to backend' }).click();

    const titleInput = page.getByLabel('Task title');
    await expect(titleInput).toBeFocused();

    const valueMissing = await titleInput.evaluate((element) => element.validity.valueMissing);
    expect(valueMissing).toBe(true);
  });
});