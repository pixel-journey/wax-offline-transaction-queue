/**
 * Live drain sketch — real WharfKit shapes for host apps.
 *
 * This file is a typed example. It does not import @wharfkit/* so the package
 * stays install-light for unit tests. Copy into a Next/Vite app that depends on:
 *   @wharfkit/session  (+ wallet plugins you support)
 *
 * Flow: user comes online → confirm each (or batch carefully) → session.transact
 * → update queue status from success/failure.
 */

import type { QueueItem, QueueState } from "./types";
import { setItemStatus } from "./queue";
import { draftToActions } from "./wharfSketch";
import { peekNext } from "./queue";

/** Minimal surface matching Session.transact usage (educational). */
export interface WharfSessionLike {
  transact: (args: {
    actions: Array<{
      account: string;
      name: string;
      authorization: Array<{ actor: string; permission: string }>;
      data: Record<string, unknown>;
    }>;
  }) => Promise<{ transaction_id?: string; response?: unknown }>;
}

export interface DrainOneResult {
  ok: boolean;
  item: QueueItem;
  state: QueueState;
  transactionId?: string;
  error?: string;
}

/**
 * Drain the FIFO head with a real session.transact call.
 * Caller supplies an authenticated WharfKit session.
 */
export async function drainNextWithSession(
  state: QueueState,
  session: WharfSessionLike,
  actor: string,
  permission = "active"
): Promise<DrainOneResult> {
  const item = peekNext(state);
  if (!item) {
    return {
      ok: false,
      item: {
        id: "",
        account: "",
        name: "",
        status: "cancelled",
        createdAt: new Date().toISOString(),
      },
      state,
      error: "no active item",
    };
  }

  const actions = draftToActions(item, actor, permission);

  try {
    const result = await session.transact({ actions });
    const marked = setItemStatus(state, item.id, "cancelled"); // terminal “done” in this FSM
    // Prefer a dedicated "broadcast" status in production forks; we reuse cancelled as handled.
    const nextState = marked.ok ? marked.state : state;
    return {
      ok: true,
      item: { ...item, status: "cancelled" },
      state: nextState,
      transactionId: result.transaction_id,
    };
  } catch (e) {
    const marked = setItemStatus(state, item.id, "failed");
    return {
      ok: false,
      item: { ...item, status: "failed" },
      state: marked.ok ? marked.state : state,
      error: e instanceof Error ? e.message : "transact failed",
    };
  }
}

/**
 * Example host wiring (pseudocode for README / app route):
 *
 * ```ts
 * import { SessionKit } from "@wharfkit/session"
 * // plugins: WebRenderer, WalletPluginAnchor, WalletPluginCloudWallet, …
 * const kit = new SessionKit({ … })
 * const session = await kit.restore() ?? await kit.login()
 * let state = loadQueue()
 * const r = await drainNextWithSession(state, session, session.actor.toString())
 * saveQueue(r.state)
 * ```
 */
export const LIVE_DRAIN_README = `
Install @wharfkit/session in the host dApp, login/restore, then call drainNextWithSession
for each confirmed queue head. Do not auto-loop without user consent on fee-bearing actions.
`;
