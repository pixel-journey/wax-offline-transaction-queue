import { describe, expect, it } from "vitest";
import { emptyQueue, enqueueItem } from "./queue";
import { duplicateDraft, setMaxPending } from "./capacity";

describe("capacity", () => {
  it("sets maxPending when allowed", () => {
    const r = setMaxPending(emptyQueue(), 10);
    expect(r.ok).toBe(true);
    if (r.ok) expect(r.state.maxPending).toBe(10);
  });

  it("duplicates a draft", () => {
    let s = emptyQueue();
    const a = enqueueItem(s, { account: "eosio.token", name: "transfer" });
    if (!a.ok) throw new Error(a.reason);
    s = a.state;
    const d = duplicateDraft(s, s.items[0].id);
    expect(d.ok).toBe(true);
    if (d.ok) expect(d.state.items).toHaveLength(2);
  });
});
