# wax-offline-transaction-queue

> **Trust Label:** `educational-reference`  
> **Verification:** [VERIFICATION-LOG.md](VERIFICATION-LOG.md)  
> **WharfKit path:** [WHARFKIT-AND-OFFLINE-FLOW.md](WHARFKIT-AND-OFFLINE-FLOW.md)  
> **Parent Catalog:** [wax-ecosystem-blueprint-catalog](https://github.com/pixel-journey/wax-ecosystem-blueprint-catalog)

## What this is (the real WAX angle)

A **client-side draft queue** for dApps:

1. User is offline (or just browsing) → app **enqueues** intended actions (`eosio.token` / `transfer`, etc.).
2. User is back online → UI walks the queue **FIFO**.
3. For each confirmed draft → host app signs with **WharfKit Session Kit** (`session.transact`), not with this library.

This repo implements the **queue + localStorage + conflict hints**. It does **not** call the chain.

## Prefer WharfKit

| Recommended | Avoid for new projects |
|-------------|-------------------------|
| `@wharfkit/session` + wallet plugins | **eosjs** |
| `@wharfkit/web-renderer` | **UAL** |
| `@wharfkit/wallet-plugin-anchor` (etc.) | Standalone **Anchor Link** as primary integration |

See [WHARFKIT-AND-OFFLINE-FLOW.md](WHARFKIT-AND-OFFLINE-FLOW.md) for session login/restore/`transact` orientation and a draft→actions sketch.

## Quick start

```bash
npm install && npm test && npm run dev
```

## Surface

| Piece | Role |
|-------|------|
| `enqueueItem` + statuses | Structured drafts |
| `conflictHints` | Duplicate active pairs |
| `storage.ts` | Soft-fail localStorage |
| `draftToActions` | Map draft → `session.transact` action shape (no call) |
| Demo | Interactive offline UI |

## License

MIT — **Pixel Journey**
