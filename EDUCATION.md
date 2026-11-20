# Education — a FIFO of drafts, not a broadcast

> **Rung:** `npm test` passes. The pure queue never broadcasts.  
> **The test is the rule.** A host app can pass a WharfKit session to `drainNextWithSession`. This file does not call it.

## Predict, then run

| Call | Locked result |
| --- | --- |
| five names (`transfer` through `undelegate`), then `buyram` | the sixth is refused |
| dequeue after those five | the first name is `transfer` |
| two items, peek | the first name is `transfer` |
| mark the next failed | peek is null |
| two active pairs with the same account and name | a warn-level conflict hint |
| serialize then parse | the item count is 1 |

The live drain is a sketch for a host that already has a session. This repository does not log in and does not broadcast by itself.
