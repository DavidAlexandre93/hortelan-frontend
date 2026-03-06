# Plano de baseline + hardening de performance e confiabilidade

Este plano traduz o checklist solicitado para o contexto atual do frontend HORTELAN.

## 1) Baseline antes de mexer

### Métricas-alvo iniciais

- Latência frontend por rota: **p95 <= 1500ms**, **p99 <= 2500ms**.
- Taxa de erro API (cliente): **< 1%** por endpoint.
- Throughput: requests por endpoint via telemetria (`apiMetrics`).
- Build: **<= 60s**.
- Tamanho total de bundles JS/CSS: acompanhar em baseline contínuo.

### Como coletar baseline

1. Rodar baseline automático:
   - `npm run perf:baseline`
2. Abrir o relatório gerado:
   - `docs/performance-baseline.json`
3. Verificar telemetria local em runtime:
   - `getReliabilityState().observability.apiMetrics`

## 2) Banco de dados (dependente de backend)

O frontend não executa queries SQL diretamente. Ações práticas:

- Exigir no backend:
  - auditoria N+1,
  - índices por `WHERE/JOIN/ORDER BY/GROUP BY`,
  - `EXPLAIN ANALYZE` para endpoints lentos,
  - slow query log habilitado,
  - cursor pagination em listas muito grandes.
- No frontend, validar sempre paginação e limites em chamadas de listagem.

## 3) Cache

- No cliente, priorizar cache de respostas idempotentes com baixa volatilidade.
- Nunca cachear globalmente dados com escopo de permissão de usuário.
- Quando backend suportar, usar `ETag`/`Cache-Control` por endpoint.

## 4) Chamadas externas/API

Implementado neste ciclo:

- Timeout com `AbortController`.
- Retry com backoff exponencial + jitter para métodos idempotentes.
- Métricas por endpoint (volume, erro, latência).

Próximos passos:

- Circuit breaker (estado aberto/semiaberto) por integração crítica.
- Limite de concorrência por domínio externo (bulkhead).
- Deduplicação de requests repetidos no mesmo fluxo.

## 5) Concorrência e I/O

- Manter requests de UI leves; mover processamento pesado para backend/jobs.
- Evitar processamento síncrono caro durante render.

## 6) Payload e serialização

- Restringir payloads por endpoint e remover campos desnecessários.
- Paginação obrigatória em listas volumosas.

## 7) Frontend performance

Já existe lazy loading de páginas via `React.lazy`.

Próximos passos:

- Medir custo por rota (bundle por chunk).
- Virtualizar listas extensas.
- Revisar dependências pesadas para tree-shaking e substituições.

## 8) Memória e leaks

Implementado neste ciclo:

- Limite de cardinalidade de métricas por endpoint (máx. 40), evitando crescimento sem controle.

## 9) Bugs e qualidade

- Fortalecer validação de inputs em todas as bordas de formulário/integração.
- Padronizar erros de API por tipo/código para facilitar observabilidade.

## 10) Testes

Fluxo mínimo recomendado em CI:

- `npm run lint`
- `npm run build`
- `npm run perf:baseline`

## 11) Observabilidade

Implementado neste ciclo:

- Métricas de request no cliente por endpoint:
  - total de requests,
  - total de erros,
  - latência aproximada p50/p95/p99,
  - último status observado.

## 12) Limites e proteção

- Definir limites de payload no backend e validação no cliente.
- Aplicar rate limiting por usuário/IP no backend.

## 13) Deploy/build/runtime

- Baseline de build automatizado (`perf:baseline`) para regressão rápida.

## 14) Segurança e estabilidade

- Revisar dependências periodicamente (audit + atualização seletiva).
- Evitar logs com dados sensíveis.
