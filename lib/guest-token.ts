import { randomBytes } from "node:crypto";

/** 128-bit random token, URL-safe. Use as the guest's only credential. Never log it. */
export function generateGuestToken(): string {
  return randomBytes(16).toString("base64url");
}
