# Hortelan Frontend

Central operacional para monitoramento de cultivos, sensores, alertas, automações, tarefas e planejamento agronômico.
O frontend usa React, Material UI e Vite, com renderização SSR seletiva nas rotas públicas e SPA protegida no dashboard.

## Requisitos

- Node.js `24.x`
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
| `VITE_ENABLE_DEMO_AUTH`                  | Habilita demo fora do Vite local   | `false`                 |
| `VITE_DEMO_EMAIL` / `VITE_DEMO_PASSWORD` | Identidade demo local              | vazio                   |
| `VITE_SENTRY_DSN`                        | Telemetria Sentry                  | vazio                   |
| `VITE_ENABLE_ANALYTICS`                  | Métricas Vercel com consentimento  | `false`                 |
| `VITE_ENABLE_METICULOUS`                 | Gravação apenas em desenvolvimento | `false`                 |

Durante `npm run dev`, o adapter local temporário aceita `davidfernandes@hortelanagtech.com` com a senha `admin`, sem
configuração adicional. Fora do Vite local, o modo demo só é carregado com `VITE_ENABLE_DEMO_AUTH=true`; produção
continua backend-first. O scanner garante que o e-mail e o branch credencial local não entrem nos assets de produção.
Essa exceção deve ser removida assim que o acesso temporário deixar de ser necessário. Senhas, tokens de recuperação,
histórico de senhas e segredos MFA não são persistidos.

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

1. Explorar o problema, o impacto e os requisitos observáveis.
2. Criar uma change em `openspec/changes/<change>/` com proposta, delta specs, design e tarefas verificáveis.
3. Confirmar que todos os artefatos requeridos estão prontos antes de alterar a implementação.
4. Implementar pelo change ativo e marcar tarefas somente após produzir a evidência prevista.
5. Executar `npm run sdd:check` e os gates afetados; `npm run quality:gate` cobre a validação integral.
6. Sincronizar os deltas nas specs canônicas e arquivar somente quando tarefas e validações estiverem concluídas.

O CLI OpenSpec está fixado no projeto e deve ser usado pelos scripts npm, sem dependência de instalação global. O guia
completo, mapa de capacidades, critérios de pronto/concluído e política de rastreabilidade estão em
`docs/sdd-openspec-architecture.md`.

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

A CI usa Node 24, `npm ci`, OpenSpec, lint/format, cobertura, build, scanners, orçamento de bundle, auditoria do grafo e
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
