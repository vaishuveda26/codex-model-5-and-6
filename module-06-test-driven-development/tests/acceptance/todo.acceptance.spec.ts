import { expect, test } from '@playwright/test';

test.describe('Acceptance scenarios', () => {
  test('TC-ACC-001: add task from UI and confirm in list', async ({ page }) => {
    await page.goto('/');

    await page.getByLabel('Task title').fill('Acceptance task');
    await page.getByRole('button', { name: 'Save task to backend' }).click();

    await expect(page.getByText('Acceptance task')).toBeVisible();
  });

  test('TC-ACC-002: complete and uncomplete task', async ({ page }) => {
    await page.goto('/');

    await page.getByLabel('Task title').fill('Toggle acceptance task');
    await page.getByRole('button', { name: 'Save task to backend' }).click();

    const completeButton = page.getByRole('button', { name: 'Mark complete' }).first();
    await completeButton.click();
    await expect(page.getByRole('button', { name: 'Mark undone' }).first()).toBeVisible();

    await page.getByRole('button', { name: 'Mark undone' }).first().click();
    await expect(page.getByRole('button', { name: 'Mark complete' }).first()).toBeVisible();
  });
});