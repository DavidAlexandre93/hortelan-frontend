const { test, expect } = require('@playwright/test');
const AxeBuilder = require('@axe-core/playwright').default;

const backendUser = {
  id: 'e2e-dashboard-user',
  email: 'dashboard@hortelan.local',
  name: 'Operação Hortelan',
  role: 'operator',
};

test.beforeEach(async ({ page }) => {
  await page.addInitScript(() => {
    sessionStorage.setItem('hortelan:intro-seen', 'true');
    localStorage.setItem('hortelan-cookie-consent-anon', JSON.stringify({ necessary: true }));
  });
  await page.route('http://localhost:3001/auth/login', (route) =>
    route.fulfill({
      status: 200,
      contentType: 'application/json',
      body: JSON.stringify({
        user: backendUser,
        session: { id: 'dashboard-session', expiresAt: new Date(Date.now() + 60 * 60 * 1000).toISOString() },
      }),
    })
  );
});

test('@a11y dashboard operacional permanece legível e responsivo', async ({ page }, testInfo) => {
  await page.goto('/login');
  await page.getByLabel('E-mail').fill(backendUser.email);
  await page.locator('input[name="password"]').fill('Senha!123');
  await page.getByRole('button', { name: 'Entrar', exact: true }).click();

  await expect(page).toHaveURL(/\/dashboard\/app$/);
  await expect(
    page.getByRole('heading', { name: /Visão geral do cultivo|Visao geral do cultivo/i }).first()
  ).toBeVisible();

  const overflow = await page.evaluate(
    () => document.documentElement.scrollWidth - document.documentElement.clientWidth
  );
  expect(overflow).toBeLessThanOrEqual(1);

  const results = await new AxeBuilder({ page }).analyze();
  const blocking = results.violations.filter((violation) => ['critical', 'serious'].includes(violation.impact));
  expect(blocking, blocking.map((item) => `${item.id}: ${item.help}`).join('\n')).toEqual([]);

  await page.screenshot({ path: testInfo.outputPath('dashboard.png'), fullPage: true });
});
