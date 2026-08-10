# Hortelan Frontend

Central operacional para monitoramento de cultivos, sensores, alertas, automações, tarefas e planejamento agronômico.
O frontend usa React, Material UI e Vite, com renderização SSR seletiva nas rotas públicas e SPA protegida no dashboard.

## Requisitos

- Node.js `20.x`
- npm compatível com o lockfile
- Backend de identidade acessível por `VITE_API_BASE_URL`

## Início rápido

```bash
npm ci
copy .env.example .env
npm run dev
```

A aplicação fica disponível em [http://127.0.0.1:5173](http://127.0.0.1:5173).

## Ambiente

As opções suportadas estão documentadas em `.env.example`.

| Variável                                 | Finalidade                         | Padrão seguro           |
| ---------------------------------------- | ---------------------------------- | ----------------------- |
| `VITE_API_BASE_URL`                      | Origem da API                      | Backend local explícito |
| `VITE_API_TIMEOUT_MS`                    | Timeout das requisições            | `12000`                 |
| `VITE_ENABLE_DEMO_AUTH`                  | Habilita adaptador local           | `false`                 |
| `VITE_DEMO_EMAIL` / `VITE_DEMO_PASSWORD` | Identidade demo local              | vazio                   |
| `VITE_SENTRY_DSN`                        | Telemetria Sentry                  | vazio                   |
| `VITE_ENABLE_ANALYTICS`                  | Métricas Vercel com consentimento  | `false`                 |
| `VITE_ENABLE_METICULOUS`                 | Gravação apenas em desenvolvimento | `false`                 |

O modo demo só é carregado quando `VITE_ENABLE_DEMO_AUTH=true`. Falhas ou configuração ausente do backend não ativam
fallback local. Senhas, tokens de recuperação, histórico de senhas e segredos MFA não são persistidos na jornada de
produção.

## Comandos

```bash
npm run dev                 # Vite em desenvolvimento
npm run build               # bundle cliente de produção
npm run build:ssr           # bundle cliente + entrada SSR
npm run serve:ssr           # servidor SSR seletivo
npm run test:coverage       # Vitest + testes Node com cobertura
npm run test:e2e            # Chromium desktop e mobile 320 px
npm run lint                # hooks, a11y, imports e regras JS
npm run format:check        # Prettier em código, testes, scripts e docs
npm run audit:frontend      # grafo de alcançabilidade cliente/SSR
npm run bundle:check        # orçamento por entry, rota e vendor
npm run security:assets     # credenciais e módulos proibidos no build
npm run openspec:validate   # valida specs e mudanças OpenSpec
npm run quality:gate        # gate completo usado pela CI
```

## Arquitetura

- `src/routing/routeManifest.js`: caminhos, acesso, metadata, aliases e lazy loading.
- `src/app/AppProviders.js`: árvore compartilhada de providers cliente/SSR.
- `src/auth/identity/`: adaptadores de identidade backend e demo explícito.
- `src/services/apiClient.js`: timeout, cancelamento, retry idempotente, erros canônicos e contratos Zod.
- `src/components/states/`: estados operacionais, recuperação lazy e confirmações.
- `src/features/`: regras de domínio isoladas e testáveis.
- `server/`: SSR seletivo, composição do HTML e cabeçalhos de segurança.
- `openspec/`: especificações fonte da verdade, propostas e tarefas de implementação.

Rotas públicas (`/login`, `/register`, `/forgot-password`, `/reset-password` e `/404`) podem ser renderizadas no
servidor. Rotas `/dashboard/*` recebem o shell cliente e continuam protegidas pelos guards de autenticação.

## SDD com OpenSpec

Mudanças relevantes seguem este fluxo:

1. Explorar o problema e os requisitos observáveis.
2. Criar uma change em `openspec/changes/<change>/` com proposta, design, deltas e tarefas.
3. Validar com `npm run openspec:validate`.
4. Implementar e atualizar os checkboxes conforme evidência real.
5. Sincronizar as specs e arquivar somente após todos os gates passarem.

O guia completo está em `docs/sdd-openspec-architecture.md`.

## Segurança e privacidade

- CSP de scripts restrita a `'self'`, sem `unsafe-inline` ou `unsafe-eval`.
- HSTS, `nosniff`, proteção contra framing, política de referrer, permissões e COOP.
- Sentry, Analytics e gravação condicionados a ambiente/configuração/consentimento.
- Scanner de assets impede credenciais demo, loaders de desenvolvimento e tokens privados no bundle.
- `npm audit` bloqueia advisories altos ou críticos de produção.

## Testes e acessibilidade

O projeto combina testes Node, Vitest/Testing Library/MSW e Playwright. As jornadas E2E cobrem login, cadastro,
retorno protegido, falha do backend, persistência sem senha, shell operacional, teclado, movimento reduzido, alvos de
toque, axe e overflow em desktop e 320 px.

## Deploy

A CI usa Node 20, `npm ci`, OpenSpec, lint/format, cobertura, build, scanners, orçamento de bundle, auditoria do grafo e
Playwright. A configuração da Vercel replica os cabeçalhos do servidor SSR; um teste de contrato impede divergência.

Para produção SSR:

```bash
npm run build:ssr
set NODE_ENV=production
npm run serve:ssr
```

Documentos complementares:

- `docs/frontend-compliance-report.md`
- `docs/performance-baseline.json`
- `docs/performance-hardening-plan.md`
- `docs/sdd-openspec-architecture.md`
