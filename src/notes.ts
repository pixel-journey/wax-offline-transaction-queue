import type { QueueItem, QueueState } from "./types";

export function setItemNote(
  state: QueueState,
  id: string,
  note: string
): { ok: false; reason: string } | { ok: true; state: QueueState } {
  const idx = state.items.findIndex((i) => i.id === id);
  if (idx < 0) return { ok: false, reason: "item not found" };
  const items = state.items.slice();
  const trimmed = note.trim();
  items[idx] = {
    ...items[idx],
    note: trimmed.length ? trimmed.slice(0, 200) : undefined,
  };
  return { ok: true, state: { ...state, items } };
}

/** Case-insensitive match on id, account, name, note. */
export function searchItems(
  items: readonly QueueItem[],
  query: string
): QueueItem[] {
  const q = query.trim().toLowerCase();
  if (!q) return [...items];
  return items.filter((i) => {
    const hay = [i.id, i.account, i.name, i.note ?? "", i.status]
      .join(" ")
      .toLowerCase();
    return hay.includes(q);
  });
}
