import { describe, expect, it } from "vitest";
import { rateLimit } from "../../lib/rate-limit";

describe("rateLimit", () => {
  it("blocks after the limit and resets after the window", () => {
    const k = "t1";
    expect(rateLimit(k, 2, 1000, 0)).toBe(true);
    expect(rateLimit(k, 2, 1000, 10)).toBe(true);
    expect(rateLimit(k, 2, 1000, 20)).toBe(false);
    expect(rateLimit(k, 2, 1000, 1001)).toBe(true);
  });
});
