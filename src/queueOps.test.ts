import { describe, expect, it } from "vitest";
import { emptyQueue, enqueueItem } from "./queue";
import {
  exportDrainPlanMarkdown,
  markAllPendingReady,
  moveActive,
  purgeTerminal,
  simulateDrainStep,
} from "./queueOps";

function twoPending() {
  let s = emptyQueue();
  const a = enqueueItem(s, { account: "eosio.token", name: "transfer" });
  if (!a.ok) throw new Error(a.reason);
  s = a.state;
  const b = enqueueItem(s, { account: "eosio", name: "voteproducer" });
  if (!b.ok) throw new Error(b.reason);
  return b.state;
}

describe("queueOps", () => {
  it("moves active items", () => {
    const s = twoPending();
    const firstId = s.items[0].id;
    const r = moveActive(s, firstId, "down");
    expect(r.ok).toBe(true);
    if (r.ok) expect(r.state.items[1].id).toBe(firstId);
  });

  it("marks all pending ready", () => {
    const r = markAllPendingReady(twoPending());
    expect(r.count).toBe(2);
    expect(r.state.items.every((i) => i.status === "ready")).toBe(true);
  });

  it("purgeTerminal removes cancelled", () => {
    let s = twoPending();
    const step = simulateDrainStep(s);
    expect(step.ok).toBe(true);
    if (!step.ok) return;
    const p = purgeTerminal(step.state);
    expect(p.removed).toBe(1);
    expect(p.state.items).toHaveLength(1);
  });

  it("drain plan mentions WharfKit", () => {
    const md = exportDrainPlanMarkdown(twoPending(), "alice.wam");
    expect(md).toContain("WharfKit");
    expect(md).toContain("transfer");
  });
});
