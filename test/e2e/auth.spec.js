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

test('falha do backend permanece recuperavel no modo de demonstracao', async ({ page }) => {
  await page.route('http://localhost:3001/auth/login', (route) => route.abort('failed'));
  await page.goto('/login');
  await page.getByLabel('E-mail').fill(backendUser.email);
  await page.locator('input[name="password"]').fill('Senha!123');
  await page.getByRole('button', { name: 'Entrar', exact: true }).click();
  await expect(page.getByRole('alert').filter({ hasText: /Credenciais de demonstracao invalidas/i })).toBeVisible();
  await expect(page).toHaveURL(/\/login$/);
});

test('rota protegida redireciona visitante para login', async ({ page }) => {
  await page.goto('/dashboard/app');
  await expect(page).toHaveURL(/\/login$/);
});

test('login temporario local autentica pela credencial fixa de desenvolvimento', async ({ page }) => {
  await page.goto('/login');
  await page.getByLabel('E-mail').fill('davidfernandes@hortelanagtech.com');
  await page.locator('input[name="password"]').fill('admin');
  await page.getByRole('button', { name: 'Entrar', exact: true }).click();
  await expect(page).toHaveURL(/\/dashboard\/app$/);
});

test('login social do ambiente demo permanece isolado e nao chama um OAuth inexistente', async ({ page }) => {
  let backendSocialRequests = 0;
  await page.route('http://localhost:3001/auth/social-login', (route) => {
    backendSocialRequests += 1;
    return route.abort('failed');
  });

  await page.goto('/login');
  await expect(page.getByRole('button', { name: 'Google (demo)' })).toBeVisible();
  await expect(page.getByRole('button', { name: 'Apple (demo)' })).toBeVisible();
  await page.getByRole('button', { name: 'Google (demo)' }).click();

  await expect(page).toHaveURL(/\/dashboard\/app$/);
  expect(backendSocialRequests).toBe(0);
});

test('retorno externo malicioso e descartado apos o login', async ({ page }) => {
  await page.route('http://localhost:3001/auth/login', (route) =>
    route.fulfill({
      status: 200,
      contentType: 'application/json',
      body: JSON.stringify({ user: backendUser, session: { id: 'safe-return-session' } }),
    })
  );
  await page.goto('/login?returnTo=https%3A%2F%2Fevil.example%2Froubo');
  await page.getByLabel('E-mail').fill(backendUser.email);
  await page.locator('input[name="password"]').fill('Senha!123');
  await page.getByRole('button', { name: 'Entrar', exact: true }).click();
  await expect(page).toHaveURL(/\/dashboard\/app$/);
});

test('recuperacao preserva resposta generica e conclui redefinicao valida', async ({ page }) => {
  await page.route('http://localhost:3001/auth/forgot-password', (route) =>
    route.fulfill({ status: 200, contentType: 'application/json', body: JSON.stringify({ success: true }) })
  );
  await page.goto('/forgot-password');
  await page.getByLabel('E-mail').fill('pessoa@hortelan.local');
  await page.getByRole('button', { name: 'Enviar instrucoes' }).click();
  await expect(page.getByText(/Se houver uma conta/)).toBeVisible();

  await page.route(/http:\/\/localhost:3001\/auth\/validate-reset-token.*/, (route) =>
    route.fulfill({ status: 200, contentType: 'application/json', body: JSON.stringify({ valid: true }) })
  );
  await page.route('http://localhost:3001/auth/reset-password', (route) =>
    route.fulfill({ status: 200, contentType: 'application/json', body: JSON.stringify({ success: true }) })
  );
  await page.goto('/reset-password?token=token-valido');
  await page.getByLabel('Nova senha', { exact: true }).fill('NovaSenha!123');
  await page.getByLabel('Confirmar nova senha').fill('NovaSenha!123');
  await page.getByRole('button', { name: 'Salvar nova senha' }).click();
  await expect(page.getByText(/Senha atualizada/)).toBeVisible();
});

test('logout seguro encerra a sessao e retorna ao login', async ({ page }) => {
  await page.route('http://localhost:3001/auth/login', (route) =>
    route.fulfill({
      status: 200,
      contentType: 'application/json',
      body: JSON.stringify({ user: backendUser, session: { id: 'logout-session' } }),
    })
  );
  await page.goto('/login');
  await page.getByLabel('E-mail').fill(backendUser.email);
  await page.locator('input[name="password"]').fill('Senha!123');
  await page.getByRole('button', { name: 'Entrar', exact: true }).click();
  await page.getByRole('button', { name: 'Abrir menu da conta' }).click();
  await page.getByRole('menuitem', { name: 'Logout seguro' }).click();
  await expect(page).toHaveURL(/\/login$/);
});
