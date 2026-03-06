# Revisão completa da aplicação (Frontend)

Data: 2026-03-06  
Escopo: repositório `hortelan-frontend` (camada frontend React + SSR local em Node para renderização seletiva).

## Metodologia aplicada

### Comandos executados
- `npm run lint`
- `npm run build`
- `npm run audit:frontend`
- `npm audit --audit-level=moderate` *(falhou por bloqueio do endpoint de auditoria no ambiente)*

### Leitura técnica de artefatos
- Estrutura de projeto, scripts e dependências em `package.json`.
- Pipeline CI/CD em `.github/workflows/ci.yml` e `.github/workflows/cd.yml`.
- Camada de autenticação/sessão local em `src/auth/session.js` e `src/auth/AuthContext.js`.
- Cliente HTTP em `src/services/apiClient.js` e `src/services/authApi.js`.
- Inicialização da app e telemetria em `src/index.js`.
- Rotas em `src/routes.js`.
- Configuração de deploy em `vercel.json`, SSR em `server/ssr-server.mjs` e bundling em `vite.config.js`.

---

## 1) Arquitetura & Design

### Pontos positivos
- Há separação básica por domínio de UI (`pages`, `sections`, `components`, `layouts`, `services`, `auth`).
- Existe `AuthContext` centralizando estado de autenticação e serviços dedicados para chamadas HTTP.

### Lacunas
- **Média**: Arquitetura ainda orientada por estrutura de template UI (Material Kit), não por bounded contexts da aplicação (ex.: auth, observabilidade, billing, segurança) com fronteiras fortes.
- **Média**: `src/auth/session.js` concentra muitas responsabilidades (autenticação, consentimento, 2FA, sessões, retenção, deleção, controle de acesso), violando SRP e aumentando acoplamento.
- **Baixa**: Não há abstração explícita de injeção de dependências para facilitar testes em serviços críticos.

### Recomendação
- Extrair `session.js` em módulos menores (`authStore`, `mfaService`, `consentService`, `sessionService`, `accountLifecycleService`) e expor interfaces estáveis no contexto.

---

## 2) Clean Code & Qualidade

### Pontos positivos
- Base com ESLint configurado e comando padrão de lint.
- Nomes em geral compreensíveis no domínio do produto.

### Lacunas
- **Média**: Lint acusa warning de dependência desnecessária em hook (`Login.js`, `useMemo`) indicando inconsciência de regras de hooks.
- **Média**: Funções grandes e com múltiplas responsabilidades na camada de sessão.
- **Média**: Auditoria estrutural identificou **52 potenciais arquivos órfãos**, sugerindo dívida de manutenção e possível código morto.

### Recomendação
- Tratar warnings de hooks como erro em CI.
- Remover/confirmar arquivos órfãos com análise de uso real.

---

## 3) Boas Práticas de API (integração frontend)

### Pontos positivos
- Endpoints de autenticação estão encapsulados em `authApi`.
- Cliente HTTP possui tratamento básico de payload e de erro por status.

### Lacunas
- **Média**: Não há camada explícita de validação forte de contratos de resposta (ex.: Zod/Yup para responses).
- **Média**: Não há política padronizada de retry/backoff/timeout no cliente HTTP.
- **Baixa**: Sem tipagem forte dos DTOs em tempo de compilação (TypeScript não está sendo utilizado na base atual).

### Recomendação
- Introduzir schema validation de request/response e normalização de erros (error shape canônico).

---

## 4) Segurança (Obrigatório)

### Pontos positivos
- Existe política de senha no frontend (`securityPolicy`).
- Há fluxo de 2FA e noções de dispositivo confiável no estado de sessão.

### Riscos críticos
- **Alta**: Credenciais de demonstração e dados de usuário seedados no frontend/localStorage (`session.js`), inclusive senha simples (`admin`).
- **Alta**: DSN do Sentry hardcoded em `src/index.js` (deveria vir por variável de ambiente por ambiente).
- **Alta**: Ausência de headers de segurança explícitos em `vercel.json` (CSP, X-Frame-Options, Referrer-Policy, etc.).
- **Média**: Fallback silencioso para login local quando backend falha (`AuthContext`) pode mascarar indisponibilidade e enfraquecer modelo de autenticação real.
- **Média**: Não foi possível executar SCA (`npm audit`) por bloqueio do endpoint no ambiente; risco de CVEs sem visibilidade no momento.

### Recomendação
- Remover credenciais seedadas em produção.
- Mover DSN/chaves para `VITE_*` por ambiente.
- Configurar headers de segurança no edge/deploy.
- Isolar modo demo por feature-flag explícita e desligada em produção.

---

## 5) Tratamento de Erros & Confiabilidade

### Pontos positivos
- `apiClient` converte erro HTTP em exceção com status e payload.
- App possui interceptação de erros críticos para redirecionar à página de erro.

### Lacunas
- **Média**: Ausência de timeout/retry com limites para chamadas externas.
- **Média**: Alguns catches absorvem erro e aplicam fallback funcional sem telemetria de degradação.
- **Baixa**: Sem estratégia explícita de idempotência para ações potencialmente repetíveis no cliente.

---

## 6) Performance & Escalabilidade

### Achados
- **Alta**: Build gera chunk único muito grande (~4.68 MB minificado) com warning do Vite para code splitting.
- **Média**: Ainda sem lazy loading de rotas pesadas no roteador principal.
- **Baixa**: Não há budget de bundle formal no CI.

### Recomendação
- Aplicar `React.lazy`/`Suspense` por rota e `manualChunks` no Vite.
- Adicionar gate de tamanho de bundle no pipeline.

---

## 7) Banco de Dados & Migrações

- **Não aplicável diretamente ao repositório frontend**.
- Entretanto, há simulação de persistência de usuários/sessões no `localStorage`, o que deve ser estritamente modo demo.

---

## 8) Observabilidade

### Pontos positivos
- Integração com Sentry e inicialização de telemetria de confiabilidade.

### Lacunas
- **Média**: Configuração de tracing com sample rate alto e alvo genérico; precisa calibração por ambiente para custo/ruído.
- **Média**: Não há padrão documentado de logs estruturados por fluxo de negócio no frontend.
- **Baixa**: Sem indicadores/SLO explícitos definidos em documentação do projeto.

---

## 9) Testes

### Achados
- **Alta**: Script `npm test` não executa testes reais (`echo "No test runner configured"`).
- **Alta**: Ausência de suíte unitária/integração/e2e automatizada no estado atual.
- **Média**: Sem meta de cobertura nem quality gate de cobertura em CI.

### Recomendação
- Prioridade imediata: cobertura de fluxos críticos (login, recuperação de senha, proteção de rota, falhas de API).

---

## 10) Frontend

### Pontos positivos
- Estrutura de componentes e páginas está organizada para evolução incremental.
- Há uso de hooks e componentes reutilizáveis de formulário.

### Lacunas
- **Média**: Estados de erro/loading existem em alguns fluxos, mas não há padrão transversal e documentado.
- **Média**: A11y não está validada por testes automatizados (axe/lighthouse-ci).
- **Alta**: Segurança de browser depende de ajustes de headers/CSP e remoção de dados sensíveis do cliente.

---

## 11) CI/CD & Qualidade Automatizada

### Pontos positivos
- CI com lint + build.
- CD automatizado para GitHub Pages.

### Lacunas
- **Média**: Sem execução de testes reais na CI.
- **Média**: Sem gates de cobertura, SAST e SCA no pipeline.
- **Baixa**: Sem estratégia explícita de release versionada (tags/changelog automatizado).

---

## 12) Docker/Infra

- **Não aplicável no estado atual** (não há Dockerfile/compose no repositório).
- Se for necessário ambiente padronizado de dev/homologação, recomenda-se introduzir `Dockerfile` multi-stage e `docker-compose` mínimo.

---

## 13) Documentação (README)

### Pontos positivos
- README contém setup inicial, variáveis de API e comandos SSR.

### Lacunas
- **Média**: Falta seção robusta de arquitetura e decisões técnicas.
- **Média**: Falta guia de testes/cobertura (pois não há suíte).
- **Baixa**: Falta troubleshooting, governança de contribuições e checklist de PR.

---

## 14) Entregáveis do review

## Lista priorizada de problemas

### Alta prioridade
1. Remover autenticação local com credenciais seedadas em produção e segredos hardcoded.
2. Introduzir suíte de testes automatizados (mínimo para fluxos críticos).
3. Reduzir bundle principal com code splitting (impacto direto em UX/perf).
4. Adicionar headers de segurança (CSP e correlatos).

### Média prioridade
1. Refatorar `session.js` em módulos coesos.
2. Padronizar error handling com timeout/retry/backoff.
3. Implementar SAST/SCA + coverage gate na CI.
4. Revisar e eliminar arquivos órfãos após validação funcional.

### Baixa prioridade
1. Formalizar estratégia de release (tags/changelog).
2. Melhorar documentação operacional e de contribuição.

## Sugestões de refatoração (exemplo antes/depois)

### Exemplo A — Fallback de autenticação
**Antes (comportamento atual):** backend falha e login local entra automaticamente.  
**Depois (recomendado):** fallback só quando `VITE_ENABLE_DEMO_AUTH=true`; caso contrário, erro explícito e telemetria.

Pseudo-fluxo recomendado:
1. Tentar backend.
2. Se falhar e feature-flag demo ativa, usar mock + banner “modo demonstração”.
3. Se falhar e demo desativada, retornar erro padronizado `AUTH_BACKEND_UNAVAILABLE`.

### Exemplo B — Serviço de sessão monolítico
**Antes:** um arquivo com múltiplas capacidades transversais.  
**Depois:** módulos por capacidade + façade no `AuthContext`.

Estrutura sugerida:
- `src/auth/services/sessionService.js`
- `src/auth/services/mfaService.js`
- `src/auth/services/consentService.js`
- `src/auth/services/accountLifecycleService.js`
- `src/auth/storage/localAuthStore.js`

## Plano de ação proposto

### Quick wins (1–2 sprints)
1. Corrigir warning de hooks e elevar lint warnings críticos para falha em CI.
2. Introduzir lazy loading por rota e medir queda do bundle inicial.
3. Externalizar DSN/configurações sensíveis para variáveis de ambiente.
4. Implementar headers de segurança no deploy.
5. Criar testes para login e rotas protegidas.

### Refactor maior (3–6 sprints)
1. Modularizar `session.js` e reduzir acoplamento em `AuthContext`.
2. Padronizar camada HTTP com timeout/retry/backoff e taxonomia de erros.
3. Implantar estratégia completa de qualidade: testes, cobertura, SAST/SCA e budget de bundle.
4. Consolidar documentação de arquitetura e ADRs principais.

## Resultado geral

**Maturidade atual:** intermediária em estrutura de frontend, mas com gaps relevantes em segurança operacional, testes automatizados e performance de bundle.  
**Risco atual:** moderado-alto para produção sem hardening adicional.
