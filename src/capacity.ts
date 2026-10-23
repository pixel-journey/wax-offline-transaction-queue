import { enqueueItem } from "./queue";
import type { QueueItem, QueueState } from "./types";

export function setMaxPending(
  state: QueueState,
  maxPending: number
): { ok: false; reason: string } | { ok: true; state: QueueState } {
  if (!Number.isInteger(maxPending) || maxPending < 1 || maxPending > 50)
    return { ok: false, reason: "maxPending must be an integer 1–50" };
  const active = state.items.filter(
    (i) => i.status === "pending" || i.status === "ready"
  ).length;
  if (active > maxPending)
    return {
      ok: false,
      reason: `cannot lower cap below current active count (${active})`,
    };
  return { ok: true, state: { ...state, maxPending } };
}

/** Clone an item as a new pending draft (educational retry / variant). */
export function duplicateDraft(
  state: QueueState,
  id: string
): { ok: false; reason: string } | { ok: true; state: QueueState; item: QueueItem } {
  const src = state.items.find((i) => i.id === id);
  if (!src) return { ok: false, reason: "item not found" };
  return enqueueItem(state, {
    account: src.account,
    name: src.name,
    data: src.data ? { ...src.data } : undefined,
    note: src.note ? `${src.note} (copy)` : "copy",
  });
}
