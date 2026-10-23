import { describe, expect, it } from "vitest";
import { emptyQueue, enqueueItem } from "./queue";
import { drainNextWithSession, type WharfSessionLike } from "./liveDrain.sketch";

describe("drainNextWithSession", () => {
  it("marks success path", async () => {
    let s = emptyQueue();
    const a = enqueueItem(s, { account: "eosio.token", name: "transfer" });
    if (!a.ok) throw new Error(a.reason);
    s = a.state;
    const session: WharfSessionLike = {
      transact: async () => ({ transaction_id: "abc".repeat(21).slice(0, 64) }),
    };
    const r = await drainNextWithSession(s, session, "alice.wam");
    expect(r.ok).toBe(true);
    expect(r.transactionId).toBeTruthy();
  });

  it("marks failure path", async () => {
    let s = emptyQueue();
    const a = enqueueItem(s, { account: "eosio.token", name: "transfer" });
    if (!a.ok) throw new Error(a.reason);
    s = a.state;
    const session: WharfSessionLike = {
      transact: async () => {
        throw new Error("user rejected");
      },
    };
    const r = await drainNextWithSession(s, session, "alice.wam");
    expect(r.ok).toBe(false);
    expect(r.state.items[0].status).toBe("failed");
  });
});
