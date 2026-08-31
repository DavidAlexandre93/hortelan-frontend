import { MemoryRouter } from 'react-router-dom';
import { render, screen, waitFor } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { beforeEach, describe, expect, it, vi } from 'vitest';
import ThemeProvider from '../../../theme';
import { unavailableAiCapabilities } from '../contracts';
import AssistantExperience from './AssistantExperience';

const serviceMocks = vi.hoisted(() => ({
  createAiConversation: vi.fn(),
  deleteAiConversation: vi.fn(),
  getAiCapabilities: vi.fn(),
  getAiRuntimeConfig: vi.fn(),
  submitAiFeedback: vi.fn(),
  submitAiMessage: vi.fn(),
  uploadAiImage: vi.fn(),
}));

vi.mock('../service', () => serviceMocks);

const readyCapabilities = {
  ...unavailableAiCapabilities,
  available: true,
  status: 'ready',
  modalities: ['text', 'image'],
  features: {
    chat: true,
    semanticDiscovery: true,
    workflowPlanning: true,
    formAssistance: true,
    proactiveInsights: true,
    imageAnalysis: true,
  },
  consent: {
    required: true,
    processorCategory: 'provedor seguro de teste',
    policyVersion: 'policy-test-v1',
  },
  retention: { mode: 'session', summary: 'Conteudo mantido somente durante o teste.', deletionAvailable: true },
};

function renderAssistant(props = {}) {
  return render(
    <MemoryRouter>
      <ThemeProvider>
        <AssistantExperience
          open
          onClose={vi.fn()}
          pathname="/dashboard/alertas"
          {...props}
        />
      </ThemeProvider>
    </MemoryRouter>
  );
}

describe('AssistantExperience', () => {
  beforeEach(() => {
    serviceMocks.getAiRuntimeConfig.mockReturnValue({ enabled: true, fakeMode: false });
    serviceMocks.getAiCapabilities.mockResolvedValue(readyCapabilities);
    serviceMocks.createAiConversation.mockResolvedValue({ id: 'conversation-1' });
    serviceMocks.deleteAiConversation.mockResolvedValue({ success: true });
    serviceMocks.submitAiFeedback.mockResolvedValue({ success: true });
    serviceMocks.uploadAiImage.mockResolvedValue({ id: 'attachment-1' });
    serviceMocks.submitAiMessage.mockImplementation(async (_conversationId, input, options) => {
      const events = [
        { kind: 'ack', operationId: input.operationId, sequence: 0, messageId: 'message-1' },
        {
          kind: 'status',
          operationId: input.operationId,
          sequence: 1,
          stage: 'retrieving',
          label: 'Consultando fontes aprovadas',
        },
        { kind: 'text_delta', operationId: input.operationId, sequence: 2, delta: 'Verifique a umidade' },
        {
          kind: 'citation',
          operationId: input.operationId,
          sequence: 3,
          citation: {
            id: 'source-1',
            title: 'Fonte aprovada',
            authority: 'Hortelan',
            url: '/dashboard/suporte',
            provenance: 'curated',
          },
        },
        {
          kind: 'completed',
          operationId: input.operationId,
          sequence: 4,
          messageId: 'message-1',
          completedAt: '2026-08-31T12:00:00.000Z',
        },
      ];
      for (const event of events) await options.onEvent(event);
      return events;
    });
  });

  it('solicita consentimento antes de mostrar o compositor', async () => {
    renderAssistant();
    expect(await screen.findByText('Antes de comecar')).toBeInTheDocument();
    expect(screen.getByText(/alerta selecionado/i)).toBeInTheDocument();
    expect(screen.queryByPlaceholderText(/Pergunte sobre/)).not.toBeInTheDocument();
  });

  it('envia contexto allowlisted e renderiza resposta com fonte', async () => {
    const user = userEvent.setup();
    renderAssistant();
    await user.click(await screen.findByRole('button', { name: 'Concordar e continuar' }));
    await user.click(screen.getByRole('button', { name: /Explique os sinais mais importantes/i }));
    await user.click(screen.getByRole('button', { name: 'Enviar pergunta' }));

    expect(await screen.findByText('Verifique a umidade')).toBeInTheDocument();
    expect(await screen.findByText(/Fonte aprovada/)).toBeInTheDocument();
    expect(serviceMocks.submitAiMessage).toHaveBeenCalledWith(
      'conversation-1',
      expect.objectContaining({
        context: expect.objectContaining({ route: '/dashboard/alertas', resourceType: 'alert' }),
      }),
      expect.objectContaining({ signal: expect.any(globalThis.AbortSignal), onEvent: expect.any(Function) })
    );
  });

  it('preserva o produto quando a IA esta indisponivel', async () => {
    serviceMocks.getAiCapabilities.mockResolvedValueOnce({ ...unavailableAiCapabilities, status: 'unavailable' });
    renderAssistant();
    expect(await screen.findByText('Inteligencia indisponivel')).toBeInTheDocument();
    expect(screen.getByText(/demais recursos continuam funcionando/i)).toBeInTheDocument();
    await waitFor(() => expect(screen.queryByPlaceholderText(/Pergunte sobre/)).not.toBeInTheDocument());
  });
});
