# wax-offline-transaction-queue

> **Trust label:** `educational-reference`  
> **Status:** Passes **1–20 frozen** (2026-10-23)

Client-side **FIFO of action drafts** for offline / deferred WAX UX. Nothing is signed or broadcast here.

## Highlights

- Enqueue / status FSM / conflict hints / localStorage
- Reorder, purge, TTL, import JSON, connectivity probe
- Notes, search, filters, maxPending, duplicate, action `data` JSON
- Undo stack, markdown / CSV / drain-plan exports

When going online, prefer **WharfKit** (`SessionKit` → `session.transact`). See [WHARFKIT-AND-OFFLINE-FLOW.md](./WHARFKIT-AND-OFFLINE-FLOW.md).

```bash
npm install && npm test && npm run dev
```

MIT — Pixel Journey
