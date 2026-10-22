import { describe, expect, it } from "vitest";
import {
  conflictHints,
  dequeue,
  emptyQueue,
  enqueue,
  enqueueItem,
  markNext,
  parseQueue,
  peekNext,
  serializeQueue,
} from "./queue";

describe("legacy string FIFO", () => {
  it("transfer then stake; sixth refused", () => {
    let q: string[] = [];
    for (const name of [
      "transfer",
      "stake",
      "voteproducer",
      "delegatebw",
      "undelegate",
    ]) {
      const r = enqueue(q, name);
      expect(r.ok).toBe(true);
      if (r.ok) q = r.queue;
    }
    expect(enqueue(q, "buyram").ok).toBe(false);
    const d = dequeue(q);
    expect(d.ok && d.name).toBe("transfer");
  });
});

describe("structured queue", () => {
  it("enqueues and peeks FIFO", () => {
    let state = emptyQueue();
    const a = enqueueItem(state, { account: "eosio.token", name: "transfer" });
    expect(a.ok).toBe(true);
    if (!a.ok) return;
    state = a.state;
    const b = enqueueItem(state, { account: "eosio", name: "voteproducer" });
    expect(b.ok).toBe(true);
    if (!b.ok) return;
    state = b.state;
    expect(peekNext(state)?.name).toBe("transfer");
  });

  it("marks next failed", () => {
    let state = emptyQueue();
    const a = enqueueItem(state, { account: "eosio.token", name: "transfer" });
    if (!a.ok) throw new Error("enqueue");
    state = a.state;
    const m = markNext(state, "failed");
    expect(m.ok).toBe(true);
    if (!m.ok) return;
    expect(peekNext(m.state)).toBeNull();
  });

  it("flags duplicate active pairs", () => {
    let state = emptyQueue();
    for (let i = 0; i < 2; i++) {
      const r = enqueueItem(state, {
        account: "eosio.token",
        name: "transfer",
        id: `id${i}`,
      });
      if (!r.ok) throw new Error("enqueue");
      state = r.state;
    }
    const hints = conflictHints(state);
    expect(hints.some((h) => h.level === "warn")).toBe(true);
  });

  it("round-trips snapshot JSON", () => {
    let state = emptyQueue(3);
    const r = enqueueItem(state, { account: "eosio", name: "buyram" });
    if (!r.ok) throw new Error("enqueue");
    const raw = serializeQueue(r.state);
    const parsed = parseQueue(raw);
    expect(parsed.ok).toBe(true);
    if (parsed.ok) expect(parsed.state.items).toHaveLength(1);
  });
});
