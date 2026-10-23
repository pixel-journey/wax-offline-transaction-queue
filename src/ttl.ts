/**
 * Educational draft TTL helpers. Does not schedule timers by itself.
 */

import { setItemStatus } from "./queue";
import type { QueueItem, QueueState } from "./types";

export const DEFAULT_TTL_MS = 24 * 60 * 60 * 1000; // 24h

export function itemAgeMs(item: QueueItem, now = Date.now()): number {
  const t = Date.parse(item.createdAt);
  if (Number.isNaN(t)) return 0;
  return Math.max(0, now - t);
}

export function isExpired(
  item: QueueItem,
  ttlMs = DEFAULT_TTL_MS,
  now = Date.now()
): boolean {
  if (item.status !== "pending" && item.status !== "ready") return false;
  return itemAgeMs(item, now) > ttlMs;
}

export function listExpired(
  state: QueueState,
  ttlMs = DEFAULT_TTL_MS,
  now = Date.now()
): QueueItem[] {
  return state.items.filter((i) => isExpired(i, ttlMs, now));
}

/** Mark expired active items failed with note in message via status only. */
export function expireStale(
  state: QueueState,
  ttlMs = DEFAULT_TTL_MS,
  now = Date.now()
): { ok: true; state: QueueState; expired: number } {
  let next = state;
  let expired = 0;
  for (const item of state.items) {
    if (isExpired(item, ttlMs, now)) {
      const r = setItemStatus(next, item.id, "failed");
      if (r.ok) {
        next = r.state;
        expired += 1;
      }
    }
  }
  return { ok: true, state: next, expired };
}
