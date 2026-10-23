# wax-offline-transaction-queue

> **Trust label:** `educational-reference`  
> **Status:** Passes 1–20 frozen · Pass 21+ post-freeze (live drain sketch)

Client-side **FIFO of action drafts** for offline / deferred WAX UX, plus a **real WharfKit drain sketch** for host apps.

## Layers

| Layer | Role |
|-------|------|
| Pure core | Queue, storage, TTL, export — never silent-broadcast |
| Optional RPC probe | `get_info` soft-fail |
| **Live drain** | `drainNextWithSession` → real `session.transact` when you pass a WharfKit session |

See [POLICY.md](./POLICY.md) and [WHARFKIT-AND-OFFLINE-FLOW.md](./WHARFKIT-AND-OFFLINE-FLOW.md).

```bash
npm install && npm test && npm run dev
```

In your dApp: install `@wharfkit/session`, login/restore, call `drainNextWithSession`.

MIT — Pixel Journey
