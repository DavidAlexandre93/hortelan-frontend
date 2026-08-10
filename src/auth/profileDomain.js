const GARDEN_ROLE_DEFAULT_PERMISSIONS = {
  owner: { automation: true, purchases: true, reports: true, community: true },
  admin: { automation: true, purchases: true, reports: true, community: true },
  operator: { automation: true, purchases: false, reports: true, community: false },
  viewer: { automation: false, purchases: false, reports: true, community: true },
};

export const normalizeGardenAccessControl = (accessControl = {}) => ({
  ownerId: accessControl.ownerId || 'self',
  inviteDraftEmail: accessControl.inviteDraftEmail || '',
  inviteDraftRole: accessControl.inviteDraftRole || 'viewer',
  pendingInvites: (accessControl.pendingInvites || []).map((invite, inviteIndex) => ({
    id: invite.id || `invite-${Date.now()}-${inviteIndex}`,
    email: invite.email || '',
    role: invite.role || 'viewer',
    status: invite.status || 'pending',
    invitedBy: invite.invitedBy || 'Voce',
    createdAt: invite.createdAt || new Date().toISOString(),
  })),
  collaborators: (accessControl.collaborators || []).map((member, memberIndex) => {
    const role = member.role || 'viewer';
    return {
      id: member.id || `collaborator-${Date.now()}-${memberIndex}`,
      name: member.name || `Membro ${memberIndex + 1}`,
      email: member.email || '',
      role,
      status: member.status || 'active',
      invitedAt: member.invitedAt || new Date().toISOString(),
      finePermissions: {
        ...(GARDEN_ROLE_DEFAULT_PERMISSIONS[role] || GARDEN_ROLE_DEFAULT_PERMISSIONS.viewer),
        ...(member.finePermissions || {}),
      },
    };
  }),
  auditLogs: (accessControl.auditLogs || []).map((entry, entryIndex) => ({
    id: entry.id || `audit-${Date.now()}-${entryIndex}`,
    action: entry.action || 'Acao registrada',
    actor: entry.actor || 'Sistema',
    target: entry.target || 'Horta',
    createdAt: entry.createdAt || new Date().toISOString(),
  })),
});
