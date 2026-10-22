# wax-offline-transaction-queue

> **Trust Label:** `educational-reference`  
> **Verification:** [VERIFICATION-LOG.md](VERIFICATION-LOG.md)  
> **Status:** 🔄 Mid-tier deepen — structured queue + localStorage + related  
> **Parent Catalog:** [wax-ecosystem-blueprint-catalog](https://github.com/pixel-journey/wax-ecosystem-blueprint-catalog)

Pure **offline FIFO** for educational action drafts, with optional browser **localStorage** persistence. Nothing is signed or broadcast.

## Quick start

```bash
npm install && npm test && npm run dev
```

## Surface

| Piece | Role |
|-------|------|
| Legacy `enqueue` / `dequeue` | Name-only FIFO (cap 5) |
| `enqueueItem` + statuses | Structured drafts |
| `conflictHints` | Duplicate active pairs |
| Snapshot JSON / markdown | Portable export |
| `storage.ts` | Soft-fail localStorage save / load / clear |
| Demo | Auto-hydrate + controls + related blueprints |

## Non-goals

- No wallet session or `push_transaction`
- Storage may be blocked (private mode / SSR) — pure queue still works in memory

## License

MIT — **Pixel Journey**
