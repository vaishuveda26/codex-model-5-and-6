import { expect, test } from '@playwright/test';

test.describe('Smoke frontend', () => {
  test('TC-SMOKE-002: app loads with heading and form', async ({ page }) => {
    await page.goto('/');

    await expect(page.getByRole('heading', { name: 'ToDo App (React + Node)' })).toBeVisible();
    await expect(page.getByLabel('Task title')).toBeVisible();
  });
});