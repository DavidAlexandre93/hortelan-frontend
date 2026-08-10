import { describe, expect, it } from 'vitest';
import { createPermissionSet, normalizeAccessControl, normalizeProfilePayload } from './model';

describe('profile model', () => {
  it('aplica permissoes conservadoras por papel', () => {
    expect(createPermissionSet('operator')).toMatchObject({ automation: true, purchases: false });
    expect(createPermissionSet('unknown')).toMatchObject({ automation: false, reports: true });
  });

  it('normaliza controle de acesso incompleto', () => {
    expect(normalizeAccessControl({ accessControl: { collaborators: [{ email: 'ana@example.com' }] } })).toMatchObject({
      ownerId: 'self',
      collaborators: [expect.objectContaining({ email: 'ana@example.com', role: 'viewer' })],
    });
  });

  it('remove entradas vazias e higieniza membros antes de salvar', () => {
    const payload = normalizeProfilePayload({
      name: 'Ana',
      savedAddresses: [
        { label: ' Casa ', addressLine: ' Rua A ' },
        { label: '', addressLine: '' },
      ],
      gardens: [
        {
          name: '  ',
          location: 'Varanda',
          photoURL: '',
          sectors: [{ name: '', dimensions: '2x3' }],
          accessControl: {
            pendingInvites: [{ email: ' CONVITE@EXAMPLE.COM ' }],
            collaborators: [{ email: ' ANA@EXAMPLE.COM ', role: 'viewer', finePermissions: {} }],
          },
        },
      ],
    });
    expect(payload.savedAddresses).toHaveLength(1);
    expect(payload.gardens[0]).toMatchObject({ name: 'Horta sem nome', sectors: [{ name: 'Setor 1' }] });
    expect(payload.gardens[0].accessControl.collaborators[0].email).toBe('ana@example.com');
  });
});
