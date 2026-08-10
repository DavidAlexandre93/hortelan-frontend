const { test, expect } = require('@playwright/test');

const backendUser = {
  id: 'visual-user',
  email: 'visual@hortelan.local',
  name: 'Operacao Visual',
  role: 'operator',
};

const dashboardRoutes = [
  ['/dashboard/app', 'Visao geral do cultivo'],
  ['/dashboard/alertas', 'Central de alertas'],
  ['/dashboard/relatorios', 'Relatorios e desempenho'],
  ['/dashboard/products', 'Catalogo de especies'],
  ['/dashboard/hortelan-360', 'Hortelan 360'],
  ['/dashboard/onboarding', 'Configure sua operacao'],
  ['/dashboard/integracoes', 'Integracoes'],
  ['/dashboard/integracoes/ops', 'Operacoes de integracao'],
  ['/dashboard/blog', 'Conhecimento que cresce junto'],
  ['/dashboard/admin', 'Administracao da plataforma'],
  ['/dashboard/status', 'Status da plataforma'],
  ['/dashboard/security', 'Seguranca e acesso'],
  ['/dashboard/profile', 'Perfil e preferencias'],
  ['/dashboard/assinaturas', 'Planos e assinatura'],
  ['/dashboard/suporte', 'Como podemos ajudar?'],
];

test.beforeEach(async ({ page }) => {
  await page.emulateMedia({ reducedMotion: 'reduce' });
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
        session: { id: 'visual-session', expiresAt: '2027-08-10T12:00:00.000Z' },
      }),
    })
  );
});

async function login(page) {
  await page.goto('/login');
  await page.getByLabel('E-mail').fill(backendUser.email);
  await page.locator('input[name="password"]').fill('Senha!123');
  await page.getByRole('button', { name: 'Entrar', exact: true }).click();
  await expect(page).toHaveURL(/\/dashboard\/app$/);
}

test('revisao visual e overflow de todas as rotas privadas', async ({ page }, testInfo) => {
  test.setTimeout(120000);
  const runtimeErrors = [];
  page.on('pageerror', (error) => runtimeErrors.push(error.message));
  page.on('console', (message) => {
    if (message.type() === 'error') runtimeErrors.push(message.text());
  });
  await login(page);

  for (const [path, heading] of dashboardRoutes) {
    await page.goto(path);
    await expect(page.getByRole('heading', { name: new RegExp(heading, 'i') }).first()).toBeVisible();
    await page.waitForFunction(() => !document.querySelector('.MuiSkeleton-root'));
    await page.waitForTimeout(350);
    const overflow = await page.evaluate(
      () => document.documentElement.scrollWidth - document.documentElement.clientWidth
    );
    expect(overflow, `${path} possui overflow horizontal`).toBeLessThanOrEqual(1);
    if (path === '/dashboard/hortelan-360') {
      const contentHeading = await page
        .getByRole('heading', { name: 'Blueprint completo da plataforma' })
        .boundingBox();
      expect(contentHeading?.x).toBeGreaterThanOrEqual(16);
    }
    const slug = path.replace(/^\//, '').replaceAll('/', '-');
    await page.screenshot({ path: testInfo.outputPath(`${slug}.png`) });
  }

  expect(runtimeErrors).toEqual([]);
});

test('revisao visual das rotas publicas', async ({ page }, testInfo) => {
  const routes = ['/login', '/register', '/forgot-password', '/reset-password', '/404'];
  for (const path of routes) {
    await page.goto(path);
    await page.waitForFunction(() => !document.querySelector('.MuiSkeleton-root'));
    await page.waitForTimeout(250);
    const overflow = await page.evaluate(
      () => document.documentElement.scrollWidth - document.documentElement.clientWidth
    );
    expect(overflow, `${path} possui overflow horizontal`).toBeLessThanOrEqual(1);
    await page.screenshot({ path: testInfo.outputPath(`public-${path.slice(1)}.png`) });
  }
});
