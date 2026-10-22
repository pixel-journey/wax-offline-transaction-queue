# Offline queue meets WharfKit (educational)

**Trust label:** `educational-reference`

This repo’s pure queue does **not** sign or broadcast. The **WAX angle** is the pattern around it:

1. While offline (or while the user is browsing), the dApp **enqueues action drafts** (account + action name + data).
2. When online again, the UI walks the queue **FIFO**.
3. For each draft the user confirms, the app builds a WharfKit **Session** transaction and calls `session.transact(...)`.
4. On success, mark the item `ready`→terminal (in a production app you might use `broadcast`/`completed`); on failure, mark `failed` and keep the draft for retry.

That is the product story. This repository only implements step 1–2 and local status/storage so you can teach and test the queue without a wallet.

---

## Prefer WharfKit — not eosjs or Anchor Link

For **new** WAX / Antelope web apps, treat these as the default stack:

| Use | Avoid for new work |
|-----|--------------------|
| **`@wharfkit/session`** (Session Kit) | **eosjs** (legacy; do not start new projects on it) |
| **`@wharfkit/web-renderer`** | **UAL** (Universal Authenticator Library) |
| **`@wharfkit/wallet-plugin-anchor`** (and other wallet plugins) | Standalone **Anchor Link** (`@greymass/anchor-link`) as your primary app integration |
| **`@wharfkit/antelope`** types / API client | Older `@greymass/eosio` imports in greenfield code |

WharfKit is the maintained Antelope web SDK suite. Session Kit is how users **login**, **restore sessions**, and **sign** transactions through wallet plugins (Anchor, Cloud Wallet, etc.).

WAX docs: [WharfKit overview](https://docs.wax.io/build/tutorials/wharfkit/), [Session Kit in React](https://docs.wax.io/build/tutorials/wharfkit/howto_react), [session management](https://docs.wax.io/build/developing-apps/sdks/wharfkit/session-management).

Greymass maintainers have discussed deprecating UAL / leaning on Session Kit instead of maintaining Anchor Link as the primary integration path for new apps.

---

## Session Kit in one paragraph

- **`SessionKit`** — factory: `login()`, `logout()`, `restore()`, `getSessions()`.
- **`Session`** — connection to one account on one chain; exposes **`transact({ actions })`**.
- **Wallet plugins** — e.g. Anchor via `@wharfkit/wallet-plugin-anchor`.
- **WebRenderer** — default UI for login / approve flows.

“Session” here means an **app↔wallet session** (identity + signing channel), not a free-floating “session key” that replaces the wallet. The wallet remains the authority that signs; the app holds a restored Session object so it does not force a full login on every page load.

---

## Sketch: drain one queue item with WharfKit (not executed in this repo)

```ts
// Educational sketch — do not treat as production copy-paste without review.
// Packages: @wharfkit/session, @wharfkit/web-renderer, @wharfkit/wallet-plugin-anchor

import type { Session } from "@wharfkit/session";
import type { QueueItem } from "./types";

/** Map one offline draft to a Session.transact action list. */
export function draftToActions(item: QueueItem, actor: string) {
  return [
    {
      account: item.account,
      name: item.name,
      authorization: [{ actor, permission: "active" }],
      data: item.data ?? {},
    },
  ];
}

/**
 * When online: user confirms the next draft → session.transact.
 * This repo never calls this; host apps wire it after login/restore.
 */
export async function transactDraft(session: Session, item: QueueItem) {
  const actions = draftToActions(item, String(session.actor));
  // const result = await session.transact({ actions });
  // return result;
  void actions;
  throw new Error("Educational stub — call session.transact in the host app");
}
```

**Permission note:** start with the account’s normal `active` (or whatever the wallet session granted). Advanced patterns (custom permissions, limited keys, multi-sig) belong in dedicated permission / hardware blueprints — not inside the offline FIFO itself.

---

## What “freeze” meant in our workflow

When we say **Pass 4 freeze**, we only mean: *for this refinement cycle, document the repo as complete enough* (README status, verification log, completion report). It is **not** a ban on future work. You can always reopen and extend (e.g. optional WharfKit drain UI behind a feature flag).

---

## Related Pixel Journey blueprints

- `wax-hardware-wallet-integration-patterns` — readiness before high-value signs
- `wax-social-recovery-and-key-backup-tools` — owner/active hygiene
- `wax-drops-and-pack-opening-experience` — already uses optional WharfKit-wired claim flows in places
