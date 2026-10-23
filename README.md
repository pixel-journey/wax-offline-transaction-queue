# wax-offline-transaction-queue

> **Trust label:** `educational-reference`  
> **Passes:** through 10 (reorder, purge, drain plan)

Client-side **FIFO of action drafts** for offline / deferred UX on WAX. Nothing is signed or broadcast in this repo.

## Core API

- `enqueueItem` / `markNext` / `conflictHints` / localStorage adapter
- **Pass 8–10:** `moveActive`, `purgeTerminal`, `markAllPendingReady`, `simulateDrainStep`, `exportDrainPlanMarkdown`

Prefer **WharfKit** (`SessionKit` → `session.transact`) when draining online. See [WHARFKIT-AND-OFFLINE-FLOW.md](./WHARFKIT-AND-OFFLINE-FLOW.md).

```bash
npm install && npm test && npm run dev
```

MIT — Pixel Journey
