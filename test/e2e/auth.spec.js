const { test, expect } = require('@playwright/test');

const backendUser = {
  id: 'e2e-user',
  email: 'operacao@hortelan.local',
  name: 'Operacao Hortelan',
  role: 'operator',
};

test.beforeEach(async ({ page }) => {
  await page.addInitScript(() => {
    sessionStorage.setItem('hortelan:intro-seen', 'true');
    localStorage.setItem('hortelan-cookie-consent-anon', JSON.stringify({ necessary: true }));
  });
});

test('login, retorno protegido e persistencia sem senha', async ({ page }) => {
  await page.route('http://localhost:3001/auth/login', (route) =>
    route.fulfill({
      status: 200,
      contentType: 'application/json',
      body: JSON.stringify({
        user: backendUser,
        session: { id: 'e2e-session', expiresAt: '2027-08-10T12:00:00.000Z' },
      }),
    })
  );

  await page.goto('/login?returnTo=%2Fdashboard%2Fprofile');
  await page.getByLabel('E-mail').fill(backendUser.email);
  await page.locator('input[name="password"]').fill('Senha!123');
  await page.getByRole('button', { name: 'Entrar', exact: true }).click();

  await expect(page).toHaveURL(/\/dashboard\/profile$/);
  await expect(page.getByRole('heading', { name: /Perfil e preferencias/i }).first()).toBeVisible();

  const storage = await page.evaluate(() => JSON.stringify({ ...localStorage, ...sessionStorage }));
  expect(storage).not.toContain('Senha!123');
  expect(storage).not.toMatch(/reset-token|mfa-challenges/);
});

test('cadastro valida consentimento e confirma resposta do servico', async ({ page }) => {
  await page.route('http://localhost:3001/auth/register', (route) =>
    route.fulfill({
      status: 200,
      contentType: 'application/json',
      body: JSON.stringify({ success: true }),
    })
  );

  await page.goto('/register');
  await page.getByLabel('Nome completo').fill('Ana Teste');
  await page.getByLabel('E-mail').fill('ana@hortelan.local');
  await page.locator('input[name="password"]').fill('Senha!123');
  await page.getByLabel(/Eu aceito/i).check();
  await page.getByRole('button', { name: 'Criar conta' }).click();

  await expect(page.getByText(/Cadastro realizado com sucesso/i)).toBeVisible();
  await expect(page.getByRole('link', { name: /Ir para login/i })).toBeVisible();
});

test('falha do backend permanece recuperavel e sanitizada', async ({ page }) => {
  await page.route('http://localhost:3001/auth/login', (route) => route.abort('failed'));
  await page.goto('/login');
  await page.getByLabel('E-mail').fill(backendUser.email);
  await page.locator('input[name="password"]').fill('Senha!123');
  await page.getByRole('button', { name: 'Entrar', exact: true }).click();
  await expect(page.getByRole('alert')).toContainText(/indispon.vel|conectar/i);
  await expect(page).toHaveURL(/\/login$/);
});

test('rota protegida redireciona visitante para login', async ({ page }) => {
  await page.goto('/dashboard/app');
  await expect(page).toHaveURL(/\/login$/);
});
