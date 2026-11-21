# AI handoff — offline transaction queue

## Agent tooling

```bash
git clone https://github.com/wharfkit/skill.git ~/.claude/skills/wharfkit
```

Primary packages for a **host** that later drains the queue:

| Package | Role |
| --- | --- |
| [@wharfkit/session](https://www.npmjs.com/package/@wharfkit/session) | `session.transact` |
| [@wharfkit/starter-wax](https://www.npmjs.com/package/@wharfkit/starter-wax) | WAX SessionKit defaults |
| [@wharfkit/antelope](https://www.npmjs.com/package/@wharfkit/antelope) | Types, APIClient |
| [wharfkit/skill](https://github.com/wharfkit/skill) | Session / patterns skill |

Official: [WharfKit](https://wharfkit.com/) · [docs.wax.io permissions](https://docs.wax.io/build/core-concepts/permissions)

## Non-negotiables

1. Pure core **never broadcasts**.
2. `maxPending` is **1..50**; cannot lower below active count.
3. Auto-drain is forbidden without **per-action user confirm** for fee-bearing work.
4. Re-validate TAPOS / expiration before any live drain.
5. Prefer SessionKit; do not teach eosjs as the default path.

## Prompt seeds (safe)

- "Add a host adapter interface that accepts a WharfKit Session and drains one item only after explicit confirm."
- "Serialize/parse the queue without changing capacity rules locked by tests."
- "Document why lowering maxPending below active length must throw."

## Do not

- Treat the queue as an auto-broadcaster while offline.
- Invent login inside this package.
- Skip idempotency checks after partial on-chain success.
