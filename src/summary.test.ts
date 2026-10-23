import { describe, expect, it } from "vitest";
import { emptyQueue, enqueueItem, setItemStatus } from "./queue";
import { countByStatus, filterByStatus, summaryLine } from "./summary";

describe("summary", () => {
  it("counts and filters", () => {
    let s = emptyQueue();
    const a = enqueueItem(s, { account: "eosio.token", name: "transfer" });
    if (!a.ok) throw new Error(a.reason);
    s = a.state;
    const b = setItemStatus(s, s.items[0].id, "ready");
    if (!b.ok) throw new Error(b.reason);
    s = b.state;
    const c = countByStatus(s);
    expect(c.ready).toBe(1);
    expect(c.active).toBe(1);
    expect(filterByStatus(s, "ready")).toHaveLength(1);
    expect(summaryLine(s)).toContain("ready 1");
  });
});
