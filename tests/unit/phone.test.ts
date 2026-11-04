import { describe, expect, it } from "vitest";
import { normalizeLkPhone, buildWhatsAppLink } from "../../lib/phone";
import { generateGuestToken } from "../../lib/guest-token";
import { fillTemplate } from "../../lib/message";
import { rsvpInput } from "../../features/rsvp/schema";

describe("normalizeLkPhone", () => {
  it.each([
    ["0771234567", "94771234567"],
    ["771234567", "94771234567"],
    ["+94 77 123 4567", "94771234567"],
    ["0094771234567", "94771234567"],
    ["94771234567", "94771234567"],
  ])("normalises %s", (input, expected) => {
    expect(normalizeLkPhone(input)).toBe(expected);
  });
  it.each(["", "12345", "0112345678", "+44 7911 123456"])("rejects %s", (input) => {
    expect(normalizeLkPhone(input)).toBeNull();
  });
});

describe("buildWhatsAppLink", () => {
  it("encodes the message", () => {
    expect(buildWhatsAppLink("94771234567", "Hi & welcome")).toBe("https://wa.me/94771234567?text=Hi%20%26%20welcome");
  });
});

describe("generateGuestToken", () => {
  it("is url-safe and unique", () => {
    const a = generateGuestToken(), b = generateGuestToken();
    expect(a).toMatch(/^[A-Za-z0-9_-]{22}$/);
    expect(a).not.toBe(b);
  });
});

describe("fillTemplate", () => {
  it("fills known placeholders and keeps unknown ones", () => {
    expect(fillTemplate("Hi {name}, {x}", { name: "Kasun" })).toBe("Hi Kasun, {x}");
  });
});

describe("rsvpInput", () => {
  const base = { token: "a".repeat(22), eventId: "8b1f3c1e-5b7d-4e8a-9c21-7d4e5f6a8b90" };
  it("requires heads when accepting", () => {
    expect(rsvpInput.safeParse({ ...base, status: "accepted" }).success).toBe(false);
    expect(rsvpInput.safeParse({ ...base, status: "accepted", headsAttending: 2 }).success).toBe(true);
  });
  it("allows declining without heads", () => {
    expect(rsvpInput.safeParse({ ...base, status: "declined" }).success).toBe(true);
  });
});
