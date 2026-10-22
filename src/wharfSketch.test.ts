import { describe, expect, it } from "vitest";
import { draftToActions, draftsToActions } from "./wharfSketch";
import type { QueueItem } from "./types";

const item: QueueItem = {
  id: "q1",
  account: "eosio.token",
  name: "transfer",
  data: { from: "alice", to: "bob", quantity: "1.00000000 WAX", memo: "" },
  status: "pending",
  createdAt: "2026-10-22T00:00:00.000Z",
};

describe("draftToActions", () => {
  it("maps account name data and active auth", () => {
    const actions = draftToActions(item, "alice.wam");
    expect(actions).toHaveLength(1);
    expect(actions[0].account).toBe("eosio.token");
    expect(actions[0].authorization[0]).toEqual({
      actor: "alice.wam",
      permission: "active",
    });
    expect(actions[0].data).toEqual(item.data);
  });

  it("batches multiple drafts", () => {
    const second = { ...item, id: "q2", name: "retire" };
    expect(draftsToActions([item, second], "alice.wam")).toHaveLength(2);
  });
});
