# Sources

| Source | Use |
| --- | --- |
| [WharfKit](https://wharfkit.com/) | Prefer SessionKit to drain |
| [wharfkit/skill](https://github.com/wharfkit/skill) | Session / patterns skill |
| [@wharfkit/session](https://www.npmjs.com/package/@wharfkit/session) | `session.transact` |
| [@wharfkit/starter-wax](https://www.npmjs.com/package/@wharfkit/starter-wax) | WAX SessionKit defaults |
| [@wharfkit/antelope](https://www.npmjs.com/package/@wharfkit/antelope) | Types, APIClient |
| [docs.wax.io permissions](https://docs.wax.io/build/core-concepts/permissions) | Auth context |
| [endpoint failover](https://github.com/pixel-journey/wax-public-endpoint-failover) | Pinned chain id before live drain |
| [session keys](https://github.com/pixel-journey/wax-wharfkit-session-keys-and-linked-permissions) | Limited keys ≠ auto-drain |

```bash
git clone https://github.com/wharfkit/skill.git ~/.claude/skills/wharfkit
```

## Product facts locked by tests

- Pure core **never broadcasts**.
- `maxPending` is **1..50**; cannot lower below active count.
- Auto-drain is forbidden without **per-action user confirm** for fee-bearing work.
- Re-validate TAPOS / expiration before any live drain.
- Prefer SessionKit; do not teach eosjs as the default path.

## Portability

Queue discipline ports. Chain id, node URL, and SessionKit preset (`starter-wax` is WAX-shaped) are local. WAX mainnet chain id: `1064487b3cd1a897ce03ae5b6a865651747e2e152090f99c1d19d44e01aea5a4`.

## Suggested topics

`antelope` `education` `pixel-journey` `wharfkit` `wax`
