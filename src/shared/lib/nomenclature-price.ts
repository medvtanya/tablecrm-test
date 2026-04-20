import type { Nomenclature } from "@/entities/nomenclature/model/types";
import type { PriceType } from "@/entities/price-type/model/types";

/** Сопоставление строки цены из API с выбранным типом цены. */
export function pickPriceForType(
  item: Nomenclature,
  priceType: PriceType | null,
): number | null {
  if (!priceType || !item.prices?.length) return null;
  const match = item.prices.find(
    (p) =>
      p.price_type === priceType.name ||
      p.price_type === String(priceType.id),
  );
  if (match) return match.price;
  return item.prices[0]?.price ?? null;
}
