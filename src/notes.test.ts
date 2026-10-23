import { describe, expect, it } from "vitest";
import { emptyQueue, enqueueItem } from "./queue";
import { searchItems, setItemNote } from "./notes";

describe("notes", () => {
  it("sets note and searches", () => {
    let s = emptyQueue();
    const a = enqueueItem(s, { account: "eosio.token", name: "transfer" });
    if (!a.ok) throw new Error(a.reason);
    s = a.state;
    const n = setItemNote(s, s.items[0].id, "farm claim batch");
    expect(n.ok).toBe(true);
    if (!n.ok) return;
    expect(n.state.items[0].note).toBe("farm claim batch");
    expect(searchItems(n.state.items, "farm")).toHaveLength(1);
    expect(searchItems(n.state.items, "zzz")).toHaveLength(0);
  });
});
