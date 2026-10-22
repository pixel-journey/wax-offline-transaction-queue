/**
 * Browser localStorage adapter for queue snapshots.
 * Soft-fail: never throws to callers; SSR-safe when window is missing.
 */

import { parseQueue, serializeQueue } from "./queue";
import type { QueueState } from "./types";

export const DEFAULT_STORAGE_KEY = "pxj.offline-tx-queue.v1";

export interface StorageResult<T> {
  ok: boolean;
  value?: T;
  reason?: string;
}

function getStore(): Storage | null {
  if (typeof window === "undefined") return null;
  try {
    return window.localStorage;
  } catch {
    return null;
  }
}

export function saveQueueToLocalStorage(
  state: QueueState,
  key: string = DEFAULT_STORAGE_KEY
): StorageResult<void> {
  const store = getStore();
  if (!store) {
    return { ok: false, reason: "localStorage unavailable (SSR or blocked)" };
  }
  try {
    store.setItem(key, serializeQueue(state));
    return { ok: true };
  } catch (e) {
    return {
      ok: false,
      reason: e instanceof Error ? e.message : "setItem failed",
    };
  }
}

export function loadQueueFromLocalStorage(
  key: string = DEFAULT_STORAGE_KEY
): StorageResult<QueueState> {
  const store = getStore();
  if (!store) {
    return { ok: false, reason: "localStorage unavailable (SSR or blocked)" };
  }
  try {
    const raw = store.getItem(key);
    if (raw == null) {
      return { ok: false, reason: "no snapshot stored" };
    }
    const parsed = parseQueue(raw);
    if (!parsed.ok) return { ok: false, reason: parsed.reason };
    return { ok: true, value: parsed.state };
  } catch (e) {
    return {
      ok: false,
      reason: e instanceof Error ? e.message : "getItem failed",
    };
  }
}

export function clearQueueLocalStorage(
  key: string = DEFAULT_STORAGE_KEY
): StorageResult<void> {
  const store = getStore();
  if (!store) {
    return { ok: false, reason: "localStorage unavailable (SSR or blocked)" };
  }
  try {
    store.removeItem(key);
    return { ok: true };
  } catch (e) {
    return {
      ok: false,
      reason: e instanceof Error ? e.message : "removeItem failed",
    };
  }
}
