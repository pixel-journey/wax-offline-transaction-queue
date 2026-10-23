import type { QueueState, QueueStatus } from "./types";

export type StatusCounts = Record<QueueStatus, number> & { total: number; active: number };

export function countByStatus(state: QueueState): StatusCounts {
  const counts: StatusCounts = {
    pending: 0,
    ready: 0,
    failed: 0,
    cancelled: 0,
    total: state.items.length,
    active: 0,
  };
  for (const item of state.items) {
    counts[item.status] += 1;
    if (item.status === "pending" || item.status === "ready") counts.active += 1;
  }
  return counts;
}

export function filterByStatus(
  state: QueueState,
  status: QueueStatus | "active" | "all"
): QueueState["items"] {
  if (status === "all") return state.items;
  if (status === "active")
    return state.items.filter(
      (i) => i.status === "pending" || i.status === "ready"
    );
  return state.items.filter((i) => i.status === status);
}

export function summaryLine(state: QueueState): string {
  const c = countByStatus(state);
  return `total ${c.total} · active ${c.active}/${state.maxPending} · pending ${c.pending} · ready ${c.ready} · failed ${c.failed} · cancelled ${c.cancelled}`;
}
