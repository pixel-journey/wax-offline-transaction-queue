import { describe, expect, it } from "vitest";
import { queueExportBasename } from "./download";

describe("download", () => {
  it("builds basename", () => {
    expect(queueExportBasename("q")).toMatch(/^q-\d{4}-/);
  });
});
