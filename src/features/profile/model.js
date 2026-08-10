export const CULTIVATION_LEVEL_OPTIONS = [
  { value: 'iniciante', label: 'Iniciante' },
  { value: 'intermediario', label: 'Intermediário' },
  { value: 'avancado', label: 'Avançado' },
];

export const LANGUAGE_OPTIONS = [
  { value: 'pt-BR', label: 'Português (Brasil)' },
  { value: 'en-US', label: 'English (US)' },
  { value: 'es-ES', label: 'Español' },
];

export const TIMEZONE_OPTIONS = [
  { value: 'America/Sao_Paulo', label: 'America/Sao_Paulo (GMT-3)' },
  { value: 'America/Manaus', label: 'America/Manaus (GMT-4)' },
  { value: 'UTC', label: 'UTC (GMT+0)' },
];

export const GARDEN_TYPE_OPTIONS = [
  { value: 'solo', label: 'Solo' },
  { value: 'vaso', label: 'Vaso' },
  { value: 'vertical', label: 'Vertical' },
  { value: 'hidroponia', label: 'Hidroponia' },
  { value: 'indoor', label: 'Indoor' },
  { value: 'estufa', label: 'Estufa' },
];

export const SECTOR_TYPE_OPTIONS = [
  { value: 'sol_pleno', label: 'Luz solar total' },
  { value: 'meia_sombra', label: 'Meia sombra' },
  { value: 'sombra_total', label: 'Sombra total' },
  { value: 'indoor', label: 'Indoor' },
  { value: 'estufa', label: 'Estufa' },
];

export const createEmptySector = () => ({
  id: `sector-${Date.now()}-${Math.random().toString(16).slice(2)}`,
  name: '',
  dimensions: '',
  sectorType: 'sol_pleno',
});

export const createEmptyGarden = () => ({
  id: `garden-${Date.now()}-${Math.random().toString(16).slice(2)}`,
  name: '',
  gardenType: 'solo',
  location: '',
  photoURL: '',
  sectors: [createEmptySector()],
});

export const ROLE_OPTIONS = [
  {
    value: 'owner',
    label: 'Proprietário',
    description: 'Controle total da horta e gestão de acessos.',
  },
  {
    value: 'admin',
    label: 'Administrador da horta',
    description: 'Gerencia rotinas, equipe e integrações.',
  },
  {
    value: 'operator',
    label: 'Operador/cuidador',
    description: 'Executa tarefas operacionais e intervenções diárias.',
  },
  {
    value: 'viewer',
    label: 'Visualizador',
    description: 'Acompanhamento em modo leitura.',
  },
];

export const FINE_PERMISSION_OPTIONS = [
  { key: 'automation', label: 'Automação' },
  { key: 'purchases', label: 'Compras' },
  { key: 'reports', label: 'Relatórios' },
  { key: 'community', label: 'Comunidade' },
];

const ROLE_DEFAULT_PERMISSIONS = {
  owner: { automation: true, purchases: true, reports: true, community: true },
  admin: { automation: true, purchases: true, reports: true, community: true },
  operator: {
    automation: true,
    purchases: false,
    reports: true,
    community: false,
  },
  viewer: {
    automation: false,
    purchases: false,
    reports: true,
    community: true,
  },
};

export const createPermissionSet = (role = 'viewer', overrides = {}) => ({
  ...(ROLE_DEFAULT_PERMISSIONS[role] || ROLE_DEFAULT_PERMISSIONS.viewer),
  ...overrides,
});

export const createAuditEntry = ({ action, actor, target }) => ({
  id: `audit-${Date.now()}-${Math.random().toString(16).slice(2)}`,
  action,
  actor,
  target,
  createdAt: new Date().toISOString(),
});

export const normalizeAccessControl = (garden) => {
  const accessControl = garden.accessControl || {};
  const collaborators = (accessControl.collaborators || []).map((member, memberIndex) => {
    const role = member.role || 'viewer';
    return {
      id: member.id || `collaborator-${Date.now()}-${memberIndex}`,
      name: member.name || `Membro ${memberIndex + 1}`,
      email: member.email || '',
      role,
      status: member.status || 'active',
      invitedAt: member.invitedAt || new Date().toISOString(),
      finePermissions: createPermissionSet(role, member.finePermissions || {}),
    };
  });

  return {
    ownerId: accessControl.ownerId || 'self',
    inviteDraftEmail: accessControl.inviteDraftEmail || '',
    inviteDraftRole: accessControl.inviteDraftRole || 'viewer',
    pendingInvites: (accessControl.pendingInvites || []).map((invite, inviteIndex) => ({
      id: invite.id || `invite-${Date.now()}-${inviteIndex}`,
      email: invite.email || '',
      role: invite.role || 'viewer',
      status: invite.status || 'pending',
      invitedBy: invite.invitedBy || 'Você',
      createdAt: invite.createdAt || new Date().toISOString(),
    })),
    collaborators,
    auditLogs: (accessControl.auditLogs || []).map((entry, entryIndex) => ({
      id: entry.id || `audit-${Date.now()}-${entryIndex}`,
      action: entry.action || 'Ação registrada',
      actor: entry.actor || 'Sistema',
      target: entry.target || 'Horta',
      createdAt: entry.createdAt || new Date().toISOString(),
    })),
  };
};
export const sectionCardContentSx = {
  p: { xs: 2.5, md: 3 },
};

export const nestedPanelSx = {
  p: { xs: 1.5, md: 2 },
  borderRadius: 2,
};

export function normalizeProfilePayload(form) {
  return {
    ...form,
    savedAddresses: form.savedAddresses.filter((item) => item.label.trim() || item.addressLine.trim()),
    gardens: form.gardens
      .filter((item) => item.name.trim() || item.location.trim() || item.photoURL.trim())
      .map((item) => ({
        ...item,
        name: item.name.trim() || 'Horta sem nome',
        sectors: (item.sectors || [])
          .filter((sector) => sector.name.trim() || sector.dimensions.trim())
          .map((sector, sectorIndex) => ({
            ...sector,
            name: sector.name.trim() || `Setor ${sectorIndex + 1}`,
            dimensions: sector.dimensions.trim(),
          })),
        accessControl: {
          ...normalizeAccessControl(item),
          pendingInvites: (item.accessControl?.pendingInvites || []).map((invite) => ({
            ...invite,
            email: invite.email?.trim().toLowerCase() || '',
          })),
          collaborators: (item.accessControl?.collaborators || [])
            .filter((member) => member.email?.trim())
            .map((member) => ({
              ...member,
              email: member.email.trim().toLowerCase(),
              name: member.name?.trim() || member.email.split('@')[0],
              finePermissions: createPermissionSet(member.role, member.finePermissions || {}),
            })),
        },
      })),
  };
}
