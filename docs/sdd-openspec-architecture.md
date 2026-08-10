# Arquitetura SDD com OpenSpec

## Objetivo

O Hortelan usa Specification-Driven Development (SDD) para transformar decisões de produto e arquitetura em
contratos duráveis, verificáveis e rastreáveis. O OpenSpec é a fonte da verdade para o comportamento esperado; o código
e os testes são a implementação e a evidência desses contratos.

O processo existe para que uma mudança responda, sem depender do histórico de uma conversa:

- por que ela é necessária;
- qual comportamento observável será adicionado, modificado ou removido;
- quais decisões técnicas e alternativas foram consideradas;
- quais tarefas implementam o contrato;
- quais evidências demonstram que o resultado está concluído.

## Princípios

1. **Especificação antes da implementação:** mudanças de comportamento ou contratos arquiteturais começam em uma
   change OpenSpec.
2. **Comportamento, não componentes:** specs descrevem o que o sistema deve garantir; nomes de arquivos e detalhes de
   React pertencem ao design e às tarefas.
3. **Uma responsabilidade por capacidade:** cada contrato possui um proprietário claro na taxonomia de domínios.
4. **Evidência proporcional ao risco:** autenticação, segurança, rotas e operações destrutivas exigem cobertura mais
   ampla do que uma alteração isolada de apresentação.
5. **Adoção brownfield:** áreas legadas são especificadas conforme mudanças reais as alcançam, sem reescrever todo o
   produto antecipadamente.
6. **Histórico preservado:** deltas concluídos entram nas specs canônicas antes de a change ser arquivada.

## Estrutura do repositório

| Caminho                                 | Responsabilidade                                                     |
| --------------------------------------- | -------------------------------------------------------------------- |
| `openspec/config.yaml`                  | Contexto do produto, regras dos artefatos e orientação dos workflows |
| `openspec/specs/<domain>/<capability>/` | Comportamento canônico atual e fonte da verdade                      |
| `openspec/changes/<change>/proposal.md` | Motivação, escopo, capacidades e impacto                             |
| `openspec/changes/<change>/specs/`      | Deltas `ADDED`, `MODIFIED` e `REMOVED`                               |
| `openspec/changes/<change>/design.md`   | Decisões, alternativas, riscos, migração e estratégia de validação   |
| `openspec/changes/<change>/tasks.md`    | Plano executável com checkboxes verificáveis                         |
| `openspec/changes/<change>/notes.md`    | Evidências finais, métricas, riscos residuais e contexto de entrega  |
| `openspec/changes/archive/`             | Histórico imutável de decisões concluídas                            |
| `.agents/skills/openspec-*`             | Workflows OpenSpec instalados para o Codex                           |
| `docs/sdd-openspec-architecture.md`     | Manual operacional deste processo                                    |
| `.github/PULL_REQUEST_TEMPLATE.md`      | Rastreabilidade e evidências exigidas na revisão                     |

## Taxonomia de capacidades

Capacidades usam o formato estável `<domain>/<capability>`. Antes de criar uma nova, deve-se confirmar que nenhuma
capacidade existente já possui a responsabilidade.

| Capacidade                            | Contrato principal                                                                |
| ------------------------------------- | --------------------------------------------------------------------------------- |
| `architecture/sdd-governance`         | Processo SDD, rastreabilidade, validação, sincronização e arquivamento            |
| `architecture/frontend-app-shell`     | Splash, rotas, proteção, lazy loading, recuperação, metadados e SSR seletivo      |
| `delivery/frontend-quality`           | Runtime Node 24, testes, build, segurança, bundles, auditorias e promoção         |
| `experience/accessible-responsive-ui` | Teclado, semântica, contraste, responsividade, movimento, idioma e sistema visual |
| `experience/operational-workflows`    | Loading, vazio, erro, offline, mutações, navegação e dados demo                   |
| `identity/auth-session`               | Backend-first auth, demo explícito, MFA, sessões, privacidade e redirects seguros |
| `platform/api-reliability`            | URLs, erros canônicos, timeout, cancelamento, retry, contratos e telemetria       |
| `platform/browser-security`           | Headers, credenciais, persistência, dependências, telemetria e recursos externos  |

### Regras de classificação

- **Nova capacidade:** comportamento independente sem proprietário atual. Exige `Purpose` claro e caminho não
  sobreposto.
- **Capacidade modificada:** altera um contrato existente. O requisito `MODIFIED` repete o requisito completo e mantém
  exatamente o nome canônico.
- **Sem delta spec:** permitido somente quando o workflow registra explicitamente que não há mudança observável nem de
  contrato arquitetural, como formatação, documentação isolada ou saída gerada.
- **Mudança cross-cutting:** pode modificar várias capacidades, mas cada requisito continua em um único proprietário.

## Contrato dos artefatos

### Proposal

O `proposal.md` define `Why`, `What Changes`, `Capabilities` e `Impact`. Ele deve distinguir escopo e não objetivos,
marcar mudanças incompatíveis e explicar impacto para usuário, segurança, operação, confiabilidade ou performance.

### Delta specs

Cada requisito usa `SHALL` ou `MUST` e possui cenários observáveis no formato:

```md
### Requirement: Stable requirement name

The system MUST expose the expected behavior.

#### Scenario: Observable outcome

- **WHEN** a triggering condition occurs
- **THEN** the verifiable result is produced
```

Um requisito `MODIFIED` contém o texto final completo, não apenas a frase alterada. Isso permite substituir o requisito
canônico por nome durante a sincronização sem perder cenários anteriores.

### Design

O `design.md` é obrigatório para mudanças cross-cutting, segurança, autenticação, API, rota, SSR, persistência,
dependências, build, CI ou deploy. Deve registrar contexto, objetivos, decisões, alternativas, riscos, migração,
rollback e validação aplicável. Implementação mecânica de baixo risco pode dispensá-lo somente quando as instruções do
schema permitirem.

### Tasks

Cada checkbox deve representar trabalho executável e evidência objetiva. Tarefas seguem a ordem de dependência e risco,
incluem testes e gates afetados e só são marcadas depois que implementação e validação estiverem concluídas.

## Ciclo de vida

### 1. Explorar

Use `$openspec-explore` quando o problema, os trade-offs ou o proprietário da capacidade ainda estiverem incertos. A
exploração não altera specs nem código.

### 2. Propor

Use `$openspec-propose` com uma descrição objetiva. O workflow cria a change e todos os artefatos de planejamento
exigidos pelo schema `spec-driven`. Revise os contratos antes de iniciar a aplicação.

### 3. Aplicar

Use `$openspec-apply-change` indicando a change quando houver mais de uma ativa. O workflow lê proposal, specs, design e
tasks, implementa em escopo e atualiza cada checkbox assim que sua evidência existir. Divergências descobertas durante a
implementação exigem atualização dos artefatos antes de ampliar o código.

### 4. Verificar

Execute primeiro os testes focados da mudança. Antes de concluir, rode `npm run sdd:check` e todos os gates afetados. A
entrega integral usa `npm run quality:gate`.

### 5. Sincronizar

Use `$openspec-sync-specs` para incorporar deltas concluídos em `openspec/specs` sem arquivar. Requisitos modificados são
substituídos pelo nome estável; requisitos adicionados entram uma única vez; requisitos não afetados permanecem.

### 6. Arquivar

Use `$openspec-archive-change` somente depois de confirmar tarefas, validação, sincronização e ausência de pendências. O
arquivo preserva proposta, decisões, tarefas e evidências como histórico consultável.

## Definition of Ready

Uma change está pronta para aplicação quando:

- motivação, impacto, escopo e não objetivos estão claros;
- capacidades novas e modificadas usam a taxonomia correta;
- todos os delta specs requeridos estão estruturalmente válidos;
- decisões materiais, riscos e alternativas estão no design;
- tarefas são ordenadas, verificáveis e cobrem validação;
- `openspec status --change <change>` não apresenta artefato obrigatório bloqueado.

## Definition of Done

Uma change está concluída quando:

- todos os requisitos e cenários planejados estão implementados;
- cada tarefa marcada possui evidência correspondente;
- testes focados cobrem sucesso, falha e recuperação conforme o risco;
- `npm run sdd:check` passa com validação estrita de specs e changes;
- lint, formato, cobertura, builds, segurança, bundle, auditoria e browser passam quando afetados;
- migração, compatibilidade, rollback e riscos residuais estão registrados;
- delta specs foram sincronizadas com as specs canônicas;
- o arquivamento foi revisado e não esconde trabalho pendente.

## Rastreabilidade

A revisão deve conseguir percorrer esta cadeia:

```text
necessidade -> proposal -> capability/requisito -> decisão de design -> tarefa -> código -> teste/gate -> evidência
```

O template de pull request exige a change, capacidades, requisitos verificados e comandos executados. Uma notificação de
sucesso, um checkbox ou uma captura isolada não substitui evidência reproduzível.

## Comandos locais

O projeto fixa `@fission-ai/openspec` em versão exata. Os scripts npm resolvem o binário local e evitam diferenças de uma
instalação global.

```bash
npm run openspec:status    # lista changes ativas
npm run openspec:list      # lista specs canônicas
npm run openspec:doctor    # diagnostica raiz, configuração e integração
npm run openspec:validate  # valida tudo em modo estrito e não interativo
npm run sdd:check          # combina doctor e validação estrita
npm run openspec:update    # atualiza integrações geradas da versão fixada
npm run quality:gate       # SDD e gate completo de entrega
```

Para inspecionar uma change específica:

```bash
npm exec -- openspec status --change <change>
npm exec -- openspec show <change>
npm exec -- openspec validate <change> --strict --no-interactive
```

## Integração com CI

A CI usa Node.js 24, instala com `npm ci` e executa `npm run sdd:check` antes dos demais controles. A mesma sequência
continua com lint, formato, testes Node/Vitest e cobertura, build cliente/SSR, scanner de assets, orçamento de bundle,
auditoria de alcançabilidade, auditoria de dependências e jornadas Playwright de browser e acessibilidade.

Como o comando local e a CI compartilham scripts, uma validação aceita localmente não depende de uma versão global do
OpenSpec nem de opções interativas.

## Prevenção de drift

- Não edite comportamento relevante diretamente no código sem identificar a capability proprietária.
- Não renomeie requisitos em deltas `MODIFIED`; uma renomeação intencional é remoção mais adição.
- Não copie apenas trechos alterados para um requisito modificado.
- Não marque tarefas antecipadamente para obter status completo.
- Não arquive deltas ainda ausentes das specs canônicas.
- Não crie capabilities sinônimas para evitar atualizar um contrato existente.
- Não use chat, issue ou pull request como única fonte de uma decisão arquitetural durável.
- Execute `npm run sdd:check` após editar configuração, specs, changes ou integrações OpenSpec.

## Manutenção

Ao atualizar o OpenSpec, altere a versão exata no `package.json`, regenere as integrações com
`npm run openspec:update`, revise o diff em `.agents/skills`, execute `npm run sdd:check` e depois o gate completo. Mudanças
de schema ou formato devem ser registradas na capacidade `architecture/sdd-governance` antes da migração.
