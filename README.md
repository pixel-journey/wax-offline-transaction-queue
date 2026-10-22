# wax-offline-transaction-queue

> **Trust Label:** `educational-reference`  
> **Verification:** [VERIFICATION-LOG.md](VERIFICATION-LOG.md)  
> **Status:** 🔄 Mid-tier deepen — structured items + status + conflicts  
> **Parent Catalog:** [wax-ecosystem-blueprint-catalog](https://github.com/pixel-journey/wax-ecosystem-blueprint-catalog)

Pure **offline FIFO** for educational action drafts. Nothing is signed or broadcast.

## Quick start

```bash
npm install && npm test && npm run dev
```

## Surface

| Piece | Role |
|-------|------|
| Legacy `enqueue` / `dequeue` | Name-only FIFO (cap 5) |
| `enqueueItem` | Account + action + optional data |
| Status | `pending` · `ready` · `failed` · `cancelled` |
| `conflictHints` | Duplicate active account/action pairs |
| Snapshot | `serializeQueue` / `parseQueue` / markdown export |
| Demo | Interactive offline UI |

## Non-goals

- No wallet session, no `push_transaction`, no durable IndexedDB adapter in this pass
- Status changes are local education only

## License

MIT — **Pixel Journey**
