import { describe, expect, it } from "vitest";
import { emptyQueue, enqueueItem, serializeQueue } from "./queue";
import { importQueueJson } from "./importQueue";

describe("importQueueJson", () => {
  it("replaces snapshot", () => {
    let foreign = emptyQueue();
    const a = enqueueItem(foreign, { account: "eosio", name: "buyram" });
    if (!a.ok) throw new Error(a.reason);
    foreign = a.state;
    const r = importQueueJson(serializeQueue(foreign), emptyQueue(), "replace");
    expect(r.ok).toBe(true);
    if (r.ok) expect(r.state.items[0].name).toBe("buyram");
  });

  it("appends without exceeding cap", () => {
    let local = emptyQueue(2);
    const a = enqueueItem(local, { account: "eosio.token", name: "transfer" });
    if (!a.ok) throw new Error(a.reason);
    local = a.state;
    let foreign = emptyQueue();
    const b = enqueueItem(foreign, { account: "eosio", name: "voteproducer" });
    if (!b.ok) throw new Error(b.reason);
    const r = importQueueJson(
      serializeQueue(b.state),
      local,
      "append-active"
    );
    expect(r.ok).toBe(true);
    if (r.ok) expect(r.state.items.length).toBe(2);
  });
});
