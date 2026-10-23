/**
 * Extra pure ops for offline queue (Passes 8–9).
 * Still no sign / broadcast.
 */

import { conflictHints, peekNext, setItemStatus } from "./queue";
import type { QueueItem, QueueState } from "./types";
import { draftsToActions } from "./wharfSketch";

function activeIndices(state: QueueState): number[] {
  return state.items
    .map((item, i) =>
      item.status === "pending" || item.status === "ready" ? i : -1
    )
    .filter((i) => i >= 0);
}

/** Reorder among active items only (failed/cancelled stay put). */
export function moveActive(
  state: QueueState,
  id: string,
  direction: "up" | "down"
): { ok: false; reason: string } | { ok: true; state: QueueState } {
  const indices = activeIndices(state);
  const pos = indices.findIndex((i) => state.items[i].id === id);
  if (pos < 0) return { ok: false, reason: "active item not found" };
  const swapWith = direction === "up" ? pos - 1 : pos + 1;
  if (swapWith < 0 || swapWith >= indices.length)
    return { ok: false, reason: "already at edge of active list" };

  const a = indices[pos];
  const b = indices[swapWith];
  const items = state.items.slice();
  const tmp = items[a];
  items[a] = items[b];
  items[b] = tmp;
  return { ok: true, state: { ...state, items } };
}

/** Drop failed + cancelled history rows (keeps pending/ready). */
export function purgeTerminal(
  state: QueueState
): { ok: true; state: QueueState; removed: number } {
  const items = state.items.filter(
    (i) => i.status === "pending" || i.status === "ready"
  );
  return {
    ok: true,
    state: { ...state, items },
    removed: state.items.length - items.length,
  };
}

/** Mark every pending item ready (educational "online, about to walk"). */
export function markAllPendingReady(
  state: QueueState
): { ok: true; state: QueueState; count: number } {
  let count = 0;
  let next = state;
  for (const item of state.items) {
    if (item.status === "pending") {
      const r = setItemStatus(next, item.id, "ready");
      if (r.ok) {
        next = r.state;
        count += 1;
      }
    }
  }
  return { ok: true, state: next, count };
}

export function activeItems(state: QueueState): QueueItem[] {
  return state.items.filter(
    (i) => i.status === "pending" || i.status === "ready"
  );
}

/**
 * Human + WharfKit-oriented drain plan. Not executed.
 */
export function exportDrainPlanMarkdown(
  state: QueueState,
  actor: string
): string {
  const active = activeItems(state);
  const actions = draftsToActions(active, actor, "active");
  const lines = [
    `# Offline → online drain plan`,
    "",
    `> Actor: \`${actor}\` · active drafts: ${active.length}`,
    "",
    "Educational only. Prefer **WharfKit** `session.transact` per step (or batched carefully).",
    "",
    "## FIFO walk",
    "",
  ];
  if (active.length === 0) lines.push("- (empty)");
  else
    active.forEach((item, i) => {
      lines.push(
        `${i + 1}. \`${item.account}::${item.name}\` (${item.status}) id=${item.id}`
      );
    });

  lines.push("", "## Action sketches", "", "```json");
  lines.push(JSON.stringify(actions, null, 2));
  lines.push("```", "");
  for (const h of conflictHints(state))
    lines.push(`- **${h.level}:** ${h.message}`);
  lines.push("");
  return lines.join("\n");
}

/** Simulate one successful online step: mark FIFO head cancelled as "done". */
export function simulateDrainStep(
  state: QueueState
): { ok: false; reason: string } | { ok: true; state: QueueState; item: QueueItem } {
  const next = peekNext(state);
  if (!next) return { ok: false, reason: "no active item" };
  // Use cancelled as terminal "handled offline demo" without a broadcasted status
  const r = setItemStatus(state, next.id, "cancelled");
  if (!r.ok) return r;
  return {
    ok: true,
    state: r.state,
    item: { ...next, status: "cancelled" },
  };
}
