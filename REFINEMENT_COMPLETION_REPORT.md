# Refinement completion — wax-offline-transaction-queue

**Trust label:** educational-reference  
**Frozen through:** Pass **20** (2026-10-23)

## Pass map (high level)

| Band | Delivered |
|------|-----------|
| Core | FIFO drafts, localStorage, conflict hints, WharfKit docs |
| 8–10 | Reorder, purge, drain plan, simulate step |
| 11–13 | TTL, JSON import, get_info probe |
| 14–16 | Status filter/summary, notes/search, maxPending + duplicate |
| 17–19 | Action data JSON, undo stack, CSV export |
| **20** | Freeze docs — no broadcast claim |

## Non-goals (still)

- No `session.transact` execution in this repo
- No private keys, no ABI validation of `data`
- Prefer **WharfKit** when implementing a real online drain

```bash
npm install && npm test && npm run typecheck
```
