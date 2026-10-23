import { describe, expect, it } from "vitest";
import { emptyQueue, enqueueItem } from "./queue";
import { exportQueueCsv } from "./csv";

describe("csv", () => {
  it("exports header and row", () => {
    let s = emptyQueue();
    const a = enqueueItem(s, {
      account: "eosio.token",
      name: "transfer",
      note: "a,b",
      data: { to: "bob" },
    });
    if (!a.ok) throw new Error(a.reason);
    const csv = exportQueueCsv(a.state);
    expect(csv.startsWith("id,account,name")).toBe(true);
    expect(csv).toContain("eosio.token");
    expect(csv).toContain('"a,b"');
  });
});
