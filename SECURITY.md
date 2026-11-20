# Security — offline transaction queue

## Closed in tests

| Issue | Behavior |
| --- | --- |
| Default string FIFO overflow | sixth name refused after five |
| Mark next failed | head no longer peeks |
| Duplicate active account+name | warn-level conflict hint |
| Serialize / parse | round-trip length preserved |
| maxPending bounds | integer 1–50; cannot lower below active |

## Not closed (production)

| Concern | Guidance |
| --- | --- |
| Live `session.transact` | Host supplies WharfKit session; this package does not login |
| Auto-drain loops | Require explicit user confirm per fee-bearing action |
| Persistent storage integrity | Host encrypts / integrity-checks local snapshots |
| TTL expiry vs chain state | Re-validate actions before broadcast; TAPOS / expiration can stale |

## Attack angles

1. Treating the queue as an auto-broadcaster while the user is offline.  
2. Enqueueing hostile drafts into a shared device profile without review.  
3. Lowering capacity mid-flight to drop pending work silently (refused when active > new max).  
4. Replaying a drained item after a partial on-chain success without idempotency checks in the host.

## Honesty limits

Pure core never broadcasts. Live drain is a **sketch** for apps that already depend on `@wharfkit/session`. Official signing: [WharfKit](https://wharfkit.com/). Permissions model: [docs.wax.io permissions](https://docs.wax.io/build/core-concepts/permissions).
