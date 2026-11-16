import { vendorCategory } from "@/db/schema";

export const CATEGORIES = vendorCategory.enumValues;
export type Category = (typeof CATEGORIES)[number];

// Phase 1 launch cities (slugs). Display names live in messages under hub.cities.
export const CITIES = ["colombo", "gampaha", "kandy", "galle", "negombo"] as const;

// Typical share of a Sri Lankan wedding budget per category.
// shortcut: planning assumption, not market data; replace with real averages once quotes accumulate.
export const BUDGET_SPLIT: Record<Category | "other", number> = {
  venue: 0.52,
  photographer: 0.1,
  decor: 0.09,
  salon: 0.06,
  car: 0.03,
  dj: 0.03,
  astrologer: 0.01,
  ashtaka: 0.01,
  fragrance: 0.01,
  other: 0.14,
};

export const formatLkr = (n: number) => `Rs. ${Math.round(n).toLocaleString("en-LK")}`;
