# Relatório de Conformidade do Frontend

Data de revisão: 10 de agosto de 2026

## Escopo

- Arquitetura SDD/OpenSpec e rastreabilidade de requisitos.
- Segurança de dependências, HTML, assets, storage, telemetria e headers.
- Rotas, autenticação, contratos HTTP, SSR seletivo e recuperação de falhas.
- Identidade visual, responsividade, teclado, movimento reduzido e acessibilidade axe.
- Testes, cobertura, bundle, grafo de módulos, CI e documentação operacional.

## Resultado

O frontend possui agora um gate reproduzível em Node 24 com OpenSpec, ESLint sem warnings, Prettier, testes Node,
Vitest com cobertura, build cliente/SSR, scanner de assets, orçamento de bundle, auditoria de alcançabilidade,
`npm audit` e Playwright desktop/mobile.

### Arquitetura e confiabilidade

- Manifesto central de rotas com acesso, metadata, aliases, lazy loading e seleção SSR.
- Providers compartilhados entre cliente e servidor.
- Adaptadores explícitos para identidade backend e demo; demo desabilitado por padrão.
- Cliente HTTP com timeout, cancelamento, retry somente idempotente, erros canônicos e validação Zod.
- Estados reutilizáveis de loading, vazio, erro, offline, permissão, status e confirmação.
- Auditoria por AST cobrindo imports estáticos, dinâmicos, reexports, aliases e entradas cliente/SSR.

### Segurança e privacidade

- `npm audit` sem vulnerabilidades conhecidas no lockfile revisado.
- CSP de scripts limitada a `'self'`, sem script inline/eval; headers SSR e Vercel cobertos por contrato.
- New Relic embutido, credenciais antigas, Faker de produção e fallbacks implícitos removidos.
- Sentry, Analytics e Meticulous centralizados e condicionados a configuração/consentimento.
- Limpeza unidirecional de senha, histórico, reset token, desafio MFA e rate-limit legados do navegador.
- Scanner falha para credenciais demo, tokens privados, loaders de gravação indevidos ou módulos proibidos.

### Experiência e acessibilidade

- Autenticação redesenhada com imagem local de estufa, hierarquia responsiva e fluxos separados de cadastro/recuperação.
- Shell operacional mais compacto, contexto por rota, navegação semântica e estados online/offline explícitos.
- Gráficos Recharts acessíveis com resumo textual; ApexCharts e runtime Faker removidos.
- Skip link, foco global, alvos mínimos de 44 px, labels, alt text e política de movimento reduzido.
- Axe sem violações críticas/sérias nas telas representativas de login e dashboard em 1440 e 320 px.
- Consentimento de cookies corrigido para não cortar texto nem provocar overflow no primeiro acesso mobile.

## Métricas

Baseline anterior: 6 de março de 2026. Baseline final: `docs/performance-baseline.json`, Node `v24.14.0`.

| Métrica               |          Antes |                 Depois |       Variação |
| --------------------- | -------------: | ---------------------: | -------------: |
| JS/CSS bruto total    |    4.607,85 kB |            1.608,45 kB |         -65,1% |
| Entrada principal     |    2.992,25 kB |              483,75 kB |         -83,8% |
| Vendor de gráficos    |      528,70 kB |              414,48 kB |         -21,6% |
| Rota de monitoramento |      159,36 kB |               84,59 kB |         -46,9% |
| Tempo de build        |        26,71 s |                16,27 s |         -39,1% |
| HTML                  | não registrado | 1,72 kB / 0,69 kB gzip | baseline atual |
| JS/CSS gzip total     | não registrado |              482,60 kB | baseline atual |

Todos os chunks JavaScript minificados permanecem abaixo do limite bruto de 500 kB. O grafo final contém 111 módulos
de produção, todos alcançáveis a partir das entradas configuradas, sem imports quebrados ou órfãos detectados.

## Testes

- Vitest/Testing Library/MSW: autenticação, guards, rotas, contratos HTTP, cancelamento/stale requests e domínio.
- Node test runner: regras de promoção, composição SSR e contrato dos headers.
- Playwright: login, cadastro, retorno protegido, falha do backend, storage sem senha, rota protegida, axe, teclado,
  movimento reduzido, alvos de toque, overflow e dashboard operacional.
- SSR de produção: conteúdo público, um único `<title>`, fallback SPA privado, asset local e headers verificados.

## Riscos residuais

- `MonitoringPage`, `ProfileSettingsPage` e `session.js` continuam acima de 800 linhas e devem ser decompostos em
  mudanças OpenSpec próprias, preservando os testes já criados.
- Contratos Zod completos ainda devem ser estendidos aos domínios de monitoramento, relatórios, assinaturas e
  integrações quando os respectivos endpoints backend forem estabilizados.
- MFA, dispositivos confiáveis e operações de privacidade possuem implementação local histórica; a autoridade final
  deve migrar para APIs backend antes de uso regulado em produção.
