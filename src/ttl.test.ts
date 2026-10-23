import { describe, expect, it } from "vitest";
import { emptyQueue, enqueueItem } from "./queue";
import { expireStale, isExpired, itemAgeMs } from "./ttl";

describe("ttl", () => {
  it("detects expired pending", () => {
    let s = emptyQueue();
    const r = enqueueItem(s, {
      account: "eosio.token",
      name: "transfer",
      createdAt: new Date(Date.now() - 48 * 3600 * 1000).toISOString(),
    });
    if (!r.ok) throw new Error(r.reason);
    expect(isExpired(r.item, 24 * 3600 * 1000)).toBe(true);
    expect(itemAgeMs(r.item)).toBeGreaterThan(40 * 3600 * 1000);
    const e = expireStale(r.state, 24 * 3600 * 1000);
    expect(e.expired).toBe(1);
    expect(e.state.items[0].status).toBe("failed");
  });
});
