# wax-offline-transaction-queue

> **Trust label:** `educational-reference`  
> **Status:** Course-format upgrade (2026-11-26)  
> **Catalog:** `wax-ecosystem-blueprint-catalog` (private index; not this public course)

**One-sentence goal:** Teach a **client-side FIFO of action drafts** — plan offline, confirm later — without silent auto-broadcast.

## Locked scene

| Call | Result |
| --- | --- |
| Five names (`transfer` → `undelegate`), then `buyram` | sixth refused |
| Dequeue after five | head is `transfer` |
| Mark next failed | peek is null |
| Same account+name twice while active | warn-level conflict hint |

```bash
npm install && npm test && npm run dev
```

## Layers

| Layer | Role |
| --- | --- |
| Pure core | Queue, storage, TTL, export — never silent-broadcast |
| Optional RPC probe | `get_info` soft-fail |
| Live drain sketch | `drainNextWithSession` → your WharfKit `session.transact` only when **you** pass a session |

This package does **not** import `@wharfkit/session`. The host app installs SessionKit + wallet plugins and supplies the session.

## Capacity

`setMaxPending` accepts integers **1–50**. You cannot lower the cap below the current active count. Default string FIFO in the beginner scene is five.

## Boundaries

- Pure core never opens a socket or signs
- Live drain is host-supplied session only — no auto-loop of fee-bearing actions
- Conflict hints are **warn**, not hard refuse

## Docs

| File | Role |
| --- | --- |
| [EDUCATION.md](EDUCATION.md) | Beginner → Intermediate → Masterclass course |
| [ARCHITECTURE.md](ARCHITECTURE.md) | Layer diagram |
| [POLICY.md](POLICY.md) · [WHARFKIT-AND-OFFLINE-FLOW.md](WHARFKIT-AND-OFFLINE-FLOW.md) | Honesty + host integration |

## Related

- WharfKit session patterns in host dApps (not bundled here)
- [wax-reduced-motion-dashboard](https://github.com/pixel-journey/wax-reduced-motion-dashboard) — offline UX flags

## License

MIT — Pixel Journey
