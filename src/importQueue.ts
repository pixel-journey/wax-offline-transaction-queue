import { parseQueue } from "./queue";
import type { QueueItem, QueueState } from "./types";

export type MergeMode = "replace" | "append-active";

/**
 * Import JSON snapshot. append-active keeps current terminal history and
 * adds foreign pending/ready items (capped by maxPending).
 */
export function importQueueJson(
  raw: string,
  current: QueueState,
  mode: MergeMode = "replace"
): { ok: false; reason: string } | { ok: true; state: QueueState } {
  const parsed = parseQueue(raw);
  if (!parsed.ok) return parsed;

  if (mode === "replace") return { ok: true, state: parsed.state };

  const incomingActive = parsed.state.items.filter(
    (i) => i.status === "pending" || i.status === "ready"
  );
  const existingIds = new Set(current.items.map((i) => i.id));
  const merged: QueueItem[] = [...current.items];
  let active =
    current.items.filter((i) => i.status === "pending" || i.status === "ready")
      .length;

  for (const item of incomingActive) {
    if (existingIds.has(item.id)) continue;
    if (active >= current.maxPending) break;
    merged.push(item);
    existingIds.add(item.id);
    active += 1;
  }

  return {
    ok: true,
    state: { ...current, items: merged },
  };
}
