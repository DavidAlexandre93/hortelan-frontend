const { test, expect } = require('@playwright/test');
const AxeBuilder = require('@axe-core/playwright').default;

test.beforeEach(async ({ page }) => {
  await page.addInitScript(() => {
    sessionStorage.setItem('hortelan:intro-seen', 'true');
    localStorage.setItem('hortelan-cookie-consent-anon', JSON.stringify({ necessary: true }));
  });
});

test('@a11y login nao tem violacoes axe criticas ou serias', async ({ page }) => {
  await page.goto('/login');
  const results = await new AxeBuilder({ page }).analyze();
  const blocking = results.violations.filter((violation) => ['critical', 'serious'].includes(violation.impact));
  expect(blocking, blocking.map((item) => `${item.id}: ${item.help}`).join('\n')).toEqual([]);
});

test('@a11y navegacao por teclado, alvo de toque e overflow', async ({ page }) => {
  await page.goto('/login');
  await page.keyboard.press('Tab');
  const focused = page.locator(':focus');
  await expect(focused).toBeVisible();

  const buttons = await page.getByRole('button').evaluateAll((elements) =>
    elements.map((element) => {
      const rect = element.getBoundingClientRect();
      return {
        name: element.getAttribute('aria-label') || element.textContent.trim(),
        width: rect.width,
        height: rect.height,
      };
    })
  );
  expect(buttons.filter(({ width, height }) => width < 44 || height < 44)).toEqual([]);

  const overflow = await page.evaluate(
    () => document.documentElement.scrollWidth - document.documentElement.clientWidth
  );
  expect(overflow).toBeLessThanOrEqual(1);
});

test('@a11y respeita preferencia de movimento reduzido', async ({ page }) => {
  await page.emulateMedia({ reducedMotion: 'reduce' });
  await page.goto('/login');
  const duration = await page.locator('body').evaluate((element) => getComputedStyle(element).transitionDuration);
  expect(duration).toBe('0s');
});
