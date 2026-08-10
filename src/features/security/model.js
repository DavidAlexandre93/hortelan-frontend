export const METHOD_LABELS = {
  seed: 'Inicializacao do sistema',
  'reset-token': 'Redefinicao por token',
};

export const TWO_FACTOR_METHOD_LABELS = { email: 'E-mail', authenticator: 'App autenticador' };

export const CONSENT_LABELS = {
  cookies: 'Cookies opcionais (web)',
  notifications: 'Notificacoes',
  marketing: 'Marketing',
  analytics: 'Analytics',
  communications: 'Comunicacoes',
};

export const SECTION_CARD_SX = { borderRadius: 2 };
export const SECTION_CONTENT_SX = {
  p: { xs: 2, md: 3 },
  '&:last-child': { pb: { xs: 2, md: 3 } },
};
export const TABLE_CONTAINER_SX = {
  borderRadius: 1.5,
  border: (theme) => `1px solid ${theme.palette.divider}`,
};
