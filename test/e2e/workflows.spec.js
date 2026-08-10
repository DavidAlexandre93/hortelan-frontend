const { test, expect } = require('@playwright/test');

const backendUser = {
  id: 'workflow-user',
  email: 'fluxos@hortelan.local',
  name: 'Operacao Fluxos',
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
      body: JSON.stringify({ user: backendUser, session: { id: 'workflow-session' } }),
    })
  );

  await page.goto('/login');
  await page.getByLabel('E-mail').fill(backendUser.email);
  await page.locator('input[name="password"]').fill('Senha!123');
  await page.getByRole('button', { name: 'Entrar', exact: true }).click();
  await expect(page).toHaveURL(/\/dashboard\/app$/);
});

test('salva o perfil pelo contrato remoto e atualiza a sessao', async ({ page }) => {
  let receivedProfile;
  await page.route('http://localhost:3001/profile', async (route) => {
    receivedProfile = route.request().postDataJSON();
    await route.fulfill({
      status: 200,
      contentType: 'application/json',
      body: JSON.stringify({
        success: true,
        user: { ...backendUser, name: receivedProfile.name, bio: receivedProfile.bio },
      }),
    });
  });

  await page.goto('/dashboard/profile');
  await page.getByLabel('Nome', { exact: true }).fill('Equipe Norte');
  await page.getByLabel('Bio', { exact: true }).fill('Cultivo integrado e rastreavel.');
  await page.getByRole('button', { name: /Salvar altera..es/i }).click();

  await expect(page.getByRole('alert')).toContainText(/Perfil atualizado com sucesso/i);
  expect(receivedProfile).toMatchObject({ name: 'Equipe Norte', bio: 'Cultivo integrado e rastreavel.' });
});

test('exige confirmacao nominal antes de solicitar exclusao', async ({ page }) => {
  let deletionRequests = 0;
  await page.route('http://localhost:3001/auth/account/deletion-request', async (route) => {
    deletionRequests += 1;
    await route.fulfill({
      status: 200,
      contentType: 'application/json',
      body: JSON.stringify({
        success: true,
        request: { id: 'delete-1', requestedAt: '2026-08-10T12:00:00.000Z', status: 'pending' },
      }),
    });
  });

  await page.goto('/dashboard/security');
  await page.getByRole('button', { name: /Solicitar exclus.o de conta/i }).click();
  const dialog = page.getByRole('dialog', { name: /Solicitar exclusao da conta/i });
  const confirmButton = dialog.getByRole('button', { name: 'Confirmar' });

  await expect(confirmButton).toBeDisabled();
  await dialog.getByLabel(/Digite EXCLUIR para confirmar/i).fill('excluir');
  await expect(confirmButton).toBeDisabled();
  await dialog.getByLabel(/Digite EXCLUIR para confirmar/i).fill('EXCLUIR');
  await expect(confirmButton).toBeEnabled();
  await confirmButton.click();

  await expect(page.getByRole('alert').filter({ hasText: /Solicita..o de exclus.o registrada/i })).toBeVisible();
  expect(deletionRequests).toBe(1);
});

test('redireciona alias legado preservando apenas parametros permitidos', async ({ page }) => {
  await page.goto('/hortelan360?tab=roadmap&returnTo=https%3A%2F%2Fevil.example');
  await expect(page).toHaveURL(/\/dashboard\/hortelan-360\?tab=roadmap$/);
  await expect(page.getByRole('heading', { name: 'Hortelan 360' }).first()).toBeVisible();
});

test('navega pelo menu e recupera o monitoramento depois de ficar offline', async ({ page }) => {
  const openNavigation = page.getByRole('button', { name: 'Abrir navegacao' });
  if (page.viewportSize()?.width < 1200) {
    await expect(openNavigation).toBeVisible();
    await openNavigation.click();
  }
  await page.getByText('Alertas', { exact: true }).filter({ visible: true }).click();
  await expect(page).toHaveURL(/\/dashboard\/alertas$/);
  await expect(page.getByRole('heading', { name: 'Central de alertas' }).first()).toBeVisible();

  await page.goto('/dashboard/app');
  await page.context().setOffline(true);
  await expect(page.getByRole('alert').filter({ hasText: /Voce esta offline/i })).toBeVisible();
  await page.context().setOffline(false);
  await expect(page.getByRole('alert').filter({ hasText: /Voce esta offline/i })).toBeHidden();
});

test('recupera uma falha transitoria de carregamento de rota', async ({ page }) => {
  let blockedOnce = false;
  await page.route(/\/src\/pages\/dashboard\/ReportsPage\.js(?:\?.*)?$/, async (route) => {
    if (!blockedOnce) {
      blockedOnce = true;
      await route.abort('failed');
      return;
    }
    await route.continue();
  });

  await page.goto('/dashboard/relatorios');
  await expect(page.getByRole('alert').filter({ hasText: /pagina nao terminou de carregar/i })).toBeVisible();
  await page.getByRole('button', { name: /Recarregar pagina/i }).click();

  await expect(page).toHaveURL(/\/dashboard\/relatorios$/);
  await expect(page.getByRole('heading', { name: 'Relatorios e desempenho' }).first()).toBeVisible();
});

test('diferencia erro inesperado e permite recuperacao global', async ({ page }) => {
  await page.addInitScript(() => {
    const originalToLocaleString = Date.prototype.toLocaleString;
    Date.prototype.toLocaleString = function patchedToLocaleString(...args) {
      if (sessionStorage.getItem('hortelan:e2e-render-fault') === 'true') {
        throw new Error('E2E unexpected render failure');
      }
      return originalToLocaleString.apply(this, args);
    };
  });
  await page.evaluate(() => sessionStorage.setItem('hortelan:e2e-render-fault', 'true'));
  await page.goto('/dashboard/security');

  await expect(page.getByRole('heading', { name: /Vamos tentar de novo/i })).toBeVisible();
  await expect(page.getByText(/Seus dados nao foram alterados/i)).toBeVisible();
  await page.evaluate(() => sessionStorage.removeItem('hortelan:e2e-render-fault'));
  await page.getByRole('button', { name: /Tentar novamente/i }).click();

  await expect(page.getByRole('heading', { name: /Seguran.a da conta/i })).toBeVisible();
});
