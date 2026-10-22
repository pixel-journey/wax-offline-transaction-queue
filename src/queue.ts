/**
 * Pure offline FIFO for educational action drafts.
 * Nothing is signed or broadcast. Cap defaults to 5 active (pending|ready).
 */

import type { QueueItem, QueueState, QueueStatus } from "./types";

const NAME = /^(?!.*\.\.)(?!\.)(?!.*\.$)[a-z1-5.]{1,12}$/;
const ACTION = /^[a-z1-5]{1,13}$/;

export const DEFAULT_MAX_PENDING = 5;

export function emptyQueue(maxPending = DEFAULT_MAX_PENDING): QueueState {
  return { items: [], maxPending };
}

function activeCount(state: QueueState): number {
  return state.items.filter(
    (i) => i.status === "pending" || i.status === "ready"
  ).length;
}

function newId(): string {
  return `q_${Math.random().toString(36).slice(2, 10)}`;
}

/** Legacy helper — action-name-only FIFO (kept for existing tests). */
export function enqueue(
  queue: readonly string[],
  name: string
): { ok: false; reason: string } | { ok: true; queue: string[] } {
  if (queue.length >= 5)
    return { ok: false, reason: "the queue already has 5 actions" };
  if (!ACTION.test(name))
    return { ok: false, reason: `${name} is not an action name` };
  return { ok: true, queue: [...queue, name] };
}

/** Legacy helper. */
export function dequeue(
  queue: readonly string[]
): { ok: false; reason: string } | { ok: true; name: string; queue: string[] } {
  if (queue.length === 0) return { ok: false, reason: "the queue is empty" };
  const [name, ...rest] = queue;
  return { ok: true, name, queue: rest };
}

export function enqueueItem(
  state: QueueState,
  input: {
    account: string;
    name: string;
    data?: Record<string, unknown>;
    note?: string;
    id?: string;
    createdAt?: string;
  }
): { ok: false; reason: string } | { ok: true; state: QueueState; item: QueueItem } {
  if (!NAME.test(input.account))
    return { ok: false, reason: "account must be an Antelope name" };
  if (!ACTION.test(input.name))
    return { ok: false, reason: `${input.name} is not an action name` };
  if (activeCount(state) >= state.maxPending)
    return {
      ok: false,
      reason: `active queue already has ${state.maxPending} items`,
    };

  const item: QueueItem = {
    id: input.id ?? newId(),
    account: input.account,
    name: input.name,
    data: input.data,
    status: "pending",
    createdAt: input.createdAt ?? new Date().toISOString(),
    note: input.note,
  };

  return {
    ok: true,
    state: { ...state, items: [...state.items, item] },
    item,
  };
}

export function setItemStatus(
  state: QueueState,
  id: string,
  status: QueueStatus
): { ok: false; reason: string } | { ok: true; state: QueueState } {
  const idx = state.items.findIndex((i) => i.id === id);
  if (idx < 0) return { ok: false, reason: "item not found" };
  const items = state.items.slice();
  items[idx] = { ...items[idx], status };
  return { ok: true, state: { ...state, items } };
}

/** Peek next pending/ready in FIFO order (oldest first). */
export function peekNext(state: QueueState): QueueItem | null {
  return (
    state.items.find((i) => i.status === "pending" || i.status === "ready") ??
    null
  );
}

/** Mark next active item without removing history. */
export function markNext(
  state: QueueState,
  status: "failed" | "cancelled" | "ready"
): { ok: false; reason: string } | { ok: true; state: QueueState; item: QueueItem } {
  const next = peekNext(state);
  if (!next) return { ok: false, reason: "no active item" };
  const result = setItemStatus(state, next.id, status);
  if (!result.ok) return result;
  return {
    ok: true,
    state: result.state,
    item: { ...next, status },
  };
}

export interface ConflictHint {
  level: "info" | "warn";
  message: string;
}

/** Same account+name still active → possible double-submit educational hint. */
export function conflictHints(state: QueueState): ConflictHint[] {
  const hints: ConflictHint[] = [];
  const active = state.items.filter(
    (i) => i.status === "pending" || i.status === "ready"
  );
  const seen = new Map<string, number>();
  for (const i of active) {
    const key = `${i.account}::${i.name}`;
    seen.set(key, (seen.get(key) ?? 0) + 1);
  }
  for (const [key, n] of seen) {
    if (n > 1) {
      hints.push({
        level: "warn",
        message: `Duplicate active drafts for ${key.replace("::", " / ")} (${n}). Re-check before any real broadcast path.`,
      });
    }
  }
  if (hints.length === 0 && active.length > 0) {
    hints.push({
      level: "info",
      message: "No duplicate account/action pairs among active items.",
    });
  }
  return hints;
}

export function serializeQueue(state: QueueState): string {
  return JSON.stringify(state, null, 2);
}

export function parseQueue(
  raw: string
): { ok: false; reason: string } | { ok: true; state: QueueState } {
  try {
    const data = JSON.parse(raw) as QueueState;
    if (!data || !Array.isArray(data.items))
      return { ok: false, reason: "invalid queue snapshot" };
    if (typeof data.maxPending !== "number")
      return { ok: false, reason: "maxPending missing" };
    return { ok: true, state: data };
  } catch {
    return { ok: false, reason: "JSON parse failed" };
  }
}

export function exportQueueMarkdown(state: QueueState): string {
  const rows = state.items
    .map(
      (i) =>
        `| ${i.id} | ${i.account} | ${i.name} | ${i.status} | ${i.createdAt} |`
    )
    .join("\n");
  return `# Offline transaction queue snapshot

**Active cap:** ${state.maxPending}  
**Nature:** Educational drafts only — not signed, not broadcast.

| Id | Account | Action | Status | Created |
|----|---------|--------|--------|---------|
${rows || "| — | — | — | — | — |"}

${conflictHints(state)
  .map((h) => `- **${h.level}:** ${h.message}`)
  .join("\n")}
`;
}
