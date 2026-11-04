/** Fill {placeholders} in the couple's WhatsApp message template. Unknown placeholders are left as-is. */
export function fillTemplate(template: string, values: Record<string, string>): string {
  return template.replace(/\{(\w+)\}/g, (match, key: string) => values[key] ?? match);
}
