/**
 * Normalise a Sri Lankan mobile number to digits-only E.164 without "+" (e.g. "94771234567").
 * Accepts: 0771234567, 771234567, +94 77 123 4567, 0094771234567, 94771234567.
 * Returns null when the input cannot be a valid Sri Lankan mobile number.
 */
export function normalizeLkPhone(input: string): string | null {
  let d = input.replace(/[^\d+]/g, "");
  if (d.startsWith("+")) d = d.slice(1);
  if (d.startsWith("0094")) d = d.slice(2);
  if (d.startsWith("94")) d = d.slice(2);
  else if (d.startsWith("0")) d = d.slice(1);
  // Mobile numbers: 9 digits after the country code, starting with 7.
  if (!/^7\d{8}$/.test(d)) return null;
  return `94${d}`;
}

/** Click-to-send link: the couple taps Send inside WhatsApp. */
export function buildWhatsAppLink(phoneDigits: string, message: string): string {
  return `https://wa.me/${phoneDigits}?text=${encodeURIComponent(message)}`;
}
