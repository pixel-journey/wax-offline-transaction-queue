# Architecture — offline FIFO of action drafts

## Layers

```
┌─────────────────────────────────────────┐
│  Host app (SessionKit + wallet plugins) │
│  supplies session to drainNextWithSession│
└───────────────────┬─────────────────────┘
                    │ optional
┌───────────────────▼─────────────────────┐
│  Live drain sketch                       │
│  peek → draftToActions → session.transact│
│  success → handled · failure → failed    │
└───────────────────┬─────────────────────┘
                    │
┌───────────────────▼─────────────────────┐
│  Pure core (always present)              │
│  enqueue · dequeue · peek · markFailed   │
│  serialize / parse · capacity 1..50      │
│  conflict warn on same account+name      │
│  NEVER network · NEVER sign              │
└─────────────────────────────────────────┘
```

## Default beginner capacity

The locked teaching scene uses a five-slot string FIFO. The pure API allows `setMaxPending` in **1..50**, refused if the new cap is below the current active count.

## What is not in the tree

- `@wharfkit/session` dependency
- Silent background broadcast on enqueue
- Auto-loop drain without user consent on fee-bearing actions

## UI

`Demo.tsx` exercises the pure core offline. It does not open a socket and it does not sign.

## Verification

`npm test` locks the five-then-refuse scene, peek/mark-failed, conflict warn, and serialize round-trip.
