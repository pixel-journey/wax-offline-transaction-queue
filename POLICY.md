# Policy — simulations vs live examples

**Trust label:** educational-reference

## What we mean by “no automatic broadcast”

The **pure queue** (`enqueueItem`, localStorage, TTL, export, etc.) must never **silently** sign or push transactions. That is intentional: a draft FIFO should not spend user resources without an explicit wallet path.

That is **not** a ban on real WAX examples.

## What is in scope

| Layer | Behavior |
|-------|----------|
| Pure core | Drafts only — always safe offline |
| Soft probes | Optional `get_info` / RPC reads |
| **Live drain (optional)** | Real `session.transact` via **WharfKit** when the host app installs `@wharfkit/session` and the user confirms |

Host apps **should** ship a working drain: restore session → walk FIFO → `session.transact({ actions })` → mark item success/fail from the result. See `src/liveDrain.sketch.ts` and [WHARFKIT-AND-OFFLINE-FLOW.md](./WHARFKIT-AND-OFFLINE-FLOW.md).

## Stack

Prefer **WharfKit** for any live path. Do not start greenfield on eosjs or standalone Anchor Link as the primary stack.
