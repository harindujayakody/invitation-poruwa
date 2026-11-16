import { Building2, Camera, Car, Flower2, Moon, Music, Scissors, ScrollText, SprayCan } from "lucide-react";
import type { Category } from "@/lib/vendors";

const ICONS = {
  venue: Building2, photographer: Camera, decor: Flower2, salon: Scissors, car: Car,
  dj: Music, astrologer: Moon, ashtaka: ScrollText, fragrance: SprayCan,
} as const;

export function CategoryIcon({ category, size = 20 }: { category: Category; size?: 16 | 20 | 24 }) {
  const Icon = ICONS[category];
  return <Icon size={size} strokeWidth={1.5} aria-hidden />;
}
