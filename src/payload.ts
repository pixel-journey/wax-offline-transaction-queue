import type { QueueItem, QueueState } from "./types";

export function parseDataJson(
  raw: string
): { ok: false; reason: string } | { ok: true; data: Record<string, unknown> | undefined } {
  const t = raw.trim();
  if (!t) return { ok: true, data: undefined };
  try {
    const v = JSON.parse(t) as unknown;
    if (v === null || typeof v !== "object" || Array.isArray(v))
      return { ok: false, reason: "data must be a JSON object" };
    return { ok: true, data: v as Record<string, unknown> };
  } catch {
    return { ok: false, reason: "invalid JSON" };
  }
}

export function setItemData(
  state: QueueState,
  id: string,
  data: Record<string, unknown> | undefined
): { ok: false; reason: string } | { ok: true; state: QueueState } {
  const idx = state.items.findIndex((i) => i.id === id);
  if (idx < 0) return { ok: false, reason: "item not found" };
  const items = state.items.slice();
  items[idx] = { ...items[idx], data };
  return { ok: true, state: { ...state, items } };
}

export function dataPreview(item: QueueItem, max = 80): string {
  if (!item.data) return "";
  try {
    const s = JSON.stringify(item.data);
    return s.length <= max ? s : `${s.slice(0, max)}…`;
  } catch {
    return "[data]";
  }
}
