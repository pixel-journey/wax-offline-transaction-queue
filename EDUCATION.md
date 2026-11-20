# Education — offline FIFO of action drafts

> **Rung:** `npm test` passes. The pure queue never broadcasts.  
> **The test is the rule.** A host app can pass a WharfKit session to `drainNextWithSession`. This file does not call it.

Offline queues exist so a player can **plan** actions while disconnected, then confirm each one when online. They are not silent auto-broadcasters.

## Learning outcomes

| Level | After this file |
| --- | --- |
| Beginner | Five drafts fill the default string FIFO; the sixth is refused |
| Intermediate | Peek is FIFO; mark failed removes the head from peek; duplicate active pairs warn |
| Masterclass | Capacity 1–50; live drain is host-supplied session only; never auto-loop fee actions |

---

## Beginner — predict, then run

| Call | Locked result |
| --- | --- |
| five names (`transfer` → `undelegate`), then `buyram` | the sixth is refused |
| dequeue after those five | the first name is `transfer` |
| two items, peek | the first name is `transfer` |
| mark the next failed | peek is null |
| two active pairs with the same account and name | a warn-level conflict hint |
| serialize then parse | the item count is 1 |

```bash
npm test
```

---

## Intermediate — layers

| Layer | Role |
| --- | --- |
| Pure core | Queue, storage, TTL, export — never silent-broadcast |
| Optional RPC probe | `get_info` soft-fail |
| Live drain sketch | `drainNextWithSession` → real `session.transact` only when **you** pass a WharfKit session |

### Capacity

`setMaxPending` accepts integers **1–50**. You cannot lower the cap below the current active count.

### Conflict hints

Two pending items with the same `account` + `name` produce a **warn** (not a hard refuse). The student decides whether that is intentional double-spend planning or a mistake.

### Serialize

`serializeQueue` / `parseQueue` round-trip for offline storage. Corrupt JSON fails closed.

---

## Masterclass — live drain honesty

`drainNextWithSession`:

1. Peeks the FIFO head.
2. Builds actions via `draftToActions`.
3. Calls **your** `session.transact`.
4. Marks success as terminal handled, or failure as `failed`.

This repository does **not** import `@wharfkit/session`. The sketch is typed for a host that already has SessionKit + wallet plugins.

### Attack → lab behavior

| Attack | Lab behavior |
| --- | --- |
| Sixth draft beyond default string FIFO | refused |
| Auto-broadcast on enqueue | never — pure core has no network |
| Lower maxPending below active count | refused |
| Drain without a session | host must supply one; tests do not |
| Loop drain without user consent | README forbids on fee-bearing actions |

### Exercises

1. After five enqueues, is `buyram` accepted? (**No**.)  
2. After mark failed, what does peek return? (**null**.)  
3. Does this repo call `orng.wax` or `eosio.token`? (**No**.)  
4. Who provides the WharfKit session for live drain? (**The host app.**)

---

## What this course will not teach

- Silent background broadcast of queued actions
- A bundled WharfKit login flow inside this package
- That queue status "cancelled" always means on-chain success in every product fork
