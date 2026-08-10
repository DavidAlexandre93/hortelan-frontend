# Verification Notes

Final verification date: 2026-08-10. Runtime: Node v24.14.0.

## Before And After

| Measure                           |          OpenSpec baseline |     Final |
| --------------------------------- | -------------------------: | --------: |
| Main entry, minified              |                  825.19 kB | 334.15 kB |
| Main entry, gzip                  |                  274.61 kB | 106.76 kB |
| Chart vendor, minified            |                  516.28 kB | 414.48 kB |
| Production HTML                   |        approximately 55 kB |   1.87 kB |
| Known dependency vulnerabilities  |                         15 |         0 |
| Production modules over 800 lines |                          3 |         0 |
| Reachable production modules      | previous result unreliable |   142/142 |
| Vitest tests                      |   promotion utilities only |        87 |
| Node tests                        |   promotion utilities only |         8 |
| Browser executions per full gate  |                       none |        40 |

## Final Evidence

- `npm run openspec:validate`: 6 artifacts passed, 0 failed.
- `npm run lint` and `npm run format:check`: zero warnings or formatting drift.
- `npm run test:coverage`: 82.91% statements and 86.33% lines for the enforced Vitest scope.
- `npm run build:ssr`: client and selective SSR bundles generated under Node 24.
- `npm run security:assets` and `npm audit`: no prohibited bundle data and zero known vulnerabilities.
- `npm run bundle:check`: largest JavaScript chunk 414.48 kB; all budgets passed.
- `npm run audit:frontend`: 142 of 142 production modules reachable, no oversized or broken modules.
- Playwright covers authentication, profile save, destructive confirmation, navigation, offline recovery, safe aliases,
  route-chunk recovery, global-error recovery, axe, keyboard, reduced motion, and every public/private route at desktop
  and 320 px.

Static fixture routes use the explicit `Dados ilustrativos` success state, shared route loading, protected permissions,
and the global offline state. Backend-backed status and identity workflows additionally expose loading, canonical error,
retry, pending, and success feedback. Unavailable integrations remain labeled as unavailable rather than reporting a
fabricated success.
