import { describe, expect, it } from "vitest";
import { emptyQueue, enqueueItem } from "./queue";
import { emptyUndo, popUndo, pushUndo, undoDepth } from "./undo";

describe("undo", () => {
  it("restores previous snapshot", () => {
    let stack = emptyUndo();
    let s = emptyQueue();
    stack = pushUndo(stack, s);
    const a = enqueueItem(s, { account: "eosio.token", name: "transfer" });
    if (!a.ok) throw new Error(a.reason);
    s = a.state;
    expect(undoDepth(stack)).toBe(1);
    const u = popUndo(stack);
    expect(u.ok).toBe(true);
    if (u.ok) expect(u.state.items).toHaveLength(0);
  });
});
