import { describe, expect, it } from "vitest";
import { dequeue, enqueue } from "./queue";

describe("offline queue", () => {
  it("returns the first name and refuses a sixth", () => {
    const waiting = enqueue(["transfer"], "stake");
    expect(waiting).toEqual({ ok: true, queue: ["transfer", "stake"] });
    const next = dequeue(["transfer", "stake"]);
    expect(next).toEqual({ ok: true, name: "transfer", queue: ["stake"] });
    expect(enqueue(["a", "b", "c", "d", "e"], "transfer").ok).toBe(false);
  });
});
