import { describe, expect, it } from "vitest";
import { emptyQueue, enqueueItem } from "./queue";
import { dataPreview, parseDataJson, setItemData } from "./payload";

describe("payload", () => {
  it("parses object JSON", () => {
    const r = parseDataJson('{"quantity":"1.00000000 WAX"}');
    expect(r.ok).toBe(true);
    if (r.ok) expect(r.data?.quantity).toBe("1.00000000 WAX");
  });

  it("rejects arrays", () => {
    expect(parseDataJson("[1]").ok).toBe(false);
  });

  it("sets data on item", () => {
    let s = emptyQueue();
    const a = enqueueItem(s, { account: "eosio.token", name: "transfer" });
    if (!a.ok) throw new Error(a.reason);
    s = a.state;
    const d = setItemData(s, s.items[0].id, { to: "bob.wam" });
    expect(d.ok).toBe(true);
    if (d.ok) expect(dataPreview(d.state.items[0])).toContain("bob.wam");
  });
});
