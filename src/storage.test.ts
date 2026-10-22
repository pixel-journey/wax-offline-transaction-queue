import { describe, expect, it, beforeEach } from "vitest";
import { emptyQueue, enqueueItem } from "./queue";
import {
  clearQueueLocalStorage,
  DEFAULT_STORAGE_KEY,
  loadQueueFromLocalStorage,
  saveQueueToLocalStorage,
} from "./storage";

class MemoryStorage implements Storage {
  private map = new Map<string, string>();
  get length() {
    return this.map.size;
  }
  clear() {
    this.map.clear();
  }
  getItem(key: string) {
    return this.map.has(key) ? this.map.get(key)! : null;
  }
  key(index: number) {
    return [...this.map.keys()][index] ?? null;
  }
  removeItem(key: string) {
    this.map.delete(key);
  }
  setItem(key: string, value: string) {
    this.map.set(key, String(value));
  }
}

describe("localStorage adapter", () => {
  beforeEach(() => {
    const mem = new MemoryStorage();
    // vitest node: attach a minimal window.localStorage
    (globalThis as unknown as { window: { localStorage: Storage } }).window = {
      localStorage: mem,
    };
  });

  it("saves and loads a queue", () => {
    let state = emptyQueue();
    const r = enqueueItem(state, {
      account: "eosio.token",
      name: "transfer",
      id: "fixed",
      createdAt: "2026-10-22T00:00:00.000Z",
    });
    expect(r.ok).toBe(true);
    if (!r.ok) return;
    state = r.state;

    expect(saveQueueToLocalStorage(state).ok).toBe(true);
    const loaded = loadQueueFromLocalStorage();
    expect(loaded.ok).toBe(true);
    if (!loaded.ok || !loaded.value) return;
    expect(loaded.value.items).toHaveLength(1);
    expect(loaded.value.items[0].name).toBe("transfer");
  });

  it("clear removes snapshot", () => {
    saveQueueToLocalStorage(emptyQueue());
    expect(clearQueueLocalStorage().ok).toBe(true);
    expect(loadQueueFromLocalStorage().ok).toBe(false);
  });

  it("uses default key constant", () => {
    expect(DEFAULT_STORAGE_KEY).toContain("offline-tx-queue");
  });
});
