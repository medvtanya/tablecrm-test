"use client";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Separator } from "@/components/ui/separator";
import { Textarea } from "@/components/ui/textarea";
import type { Nomenclature } from "@/entities/nomenclature/model/types";
import type { PriceType } from "@/entities/price-type/model/types";
import type { CartLine } from "@/entities/sale/model/cart-line";

type Props = {
  query: string;
  onQueryChange: (q: string) => void;
  onSearchProducts: () => void;
  productLoading: boolean;
  searchHits: Nomenclature[];
  selectedPriceType: PriceType | null;
  onAddProduct: (n: Nomenclature) => void;
  lines: CartLine[];
  onQty: (lineId: string, qty: number) => void;
  onPrice: (lineId: string, price: number) => void;
  onRemove: (lineId: string) => void;
  comment: string;
  onComment: (v: string) => void;
  disabled: boolean;
};

export function OrderLinesSection({
  query,
  onQueryChange,
  onSearchProducts,
  productLoading,
  searchHits,
  selectedPriceType,
  onAddProduct,
  lines,
  onQty,
  onPrice,
  onRemove,
  comment,
  onComment,
  disabled,
}: Props) {
  const total = lines.reduce((s, l) => s + l.quantity * l.unitPrice, 0);

  return (
    <section className="space-y-4">
      <h2 className="text-sm font-medium tracking-tight">Товары</h2>
      <div className="space-y-1.5">
        <Label className="text-xs text-muted-foreground">Поиск номенклатуры</Label>
        <div className="flex gap-2">
          <Input
            className="h-10 text-sm"
            placeholder="Название…"
            value={query}
            disabled={disabled}
            onChange={(e) => onQueryChange(e.target.value)}
          />
          <Button
            type="button"
            variant="secondary"
            className="h-10 shrink-0"
            disabled={disabled || !query.trim() || productLoading}
            onClick={onSearchProducts}
          >
            {productLoading ? "…" : "Поиск"}
          </Button>
        </div>
      </div>
      {searchHits.length > 0 && (
        <ScrollArea className="h-40 rounded-md border border-border/60">
          <ul className="divide-y divide-border/60 text-sm">
            {searchHits.map((n) => (
              <li
                key={n.id}
                className="flex items-center justify-between gap-2 px-3 py-2"
              >
                <span className="min-w-0 flex-1 truncate">{n.name}</span>
                <Button
                  type="button"
                  size="sm"
                  variant="outline"
                  className="h-8 shrink-0"
                  disabled={disabled || !selectedPriceType}
                  onClick={() => onAddProduct(n)}
                >
                  +
                </Button>
              </li>
            ))}
          </ul>
        </ScrollArea>
      )}
      {!selectedPriceType ? (
        <p className="text-xs text-muted-foreground">
          Выберите тип цены, чтобы добавлять позиции.
        </p>
      ) : null}

      <div>
        <h3 className="mb-2 text-xs font-medium uppercase tracking-wide text-muted-foreground">
          Корзина
        </h3>
        {lines.length === 0 ? (
          <p className="text-sm text-muted-foreground">Пока пусто</p>
        ) : (
          <ul className="space-y-3">
            {lines.map((line) => (
              <li
                key={line.id}
                className="grid grid-cols-[1fr_auto] gap-2 rounded-md border border-border/60 p-3 sm:grid-cols-[1fr_6rem_6rem_auto]"
              >
                <div className="min-w-0 sm:col-span-1">
                  <p className="truncate text-sm font-medium leading-tight">
                    {line.nomenclature.name}
                  </p>
                  {line.nomenclature.unit_name ? (
                    <p className="text-xs text-muted-foreground">
                      {line.nomenclature.unit_name}
                    </p>
                  ) : null}
                </div>
                <div className="flex flex-col gap-1">
                  <Label className="text-[10px] text-muted-foreground">
                    Кол-во
                  </Label>
                  <Input
                    type="number"
                    min={0.001}
                    step="any"
                    className="h-9"
                    value={line.quantity}
                    onChange={(e) =>
                      onQty(line.id, Number.parseFloat(e.target.value) || 0)
                    }
                  />
                </div>
                <div className="flex flex-col gap-1">
                  <Label className="text-[10px] text-muted-foreground">
                    Цена
                  </Label>
                  <Input
                    type="number"
                    min={0}
                    step="any"
                    className="h-9"
                    value={line.unitPrice}
                    onChange={(e) =>
                      onPrice(line.id, Number.parseFloat(e.target.value) || 0)
                    }
                  />
                </div>
                <div className="flex items-end justify-end">
                  <Button
                    type="button"
                    variant="ghost"
                    size="sm"
                    className="text-muted-foreground"
                    onClick={() => onRemove(line.id)}
                  >
                    ×
                  </Button>
                </div>
              </li>
            ))}
          </ul>
        )}
        {lines.length > 0 ? (
          <p className="mt-3 text-right text-sm font-medium tabular-nums">
            Итого: {total.toFixed(2)}
          </p>
        ) : null}
      </div>

      <Separator />

      <div className="space-y-1.5">
        <Label htmlFor="comment" className="text-xs text-muted-foreground">
          Комментарий
        </Label>
        <Textarea
          id="comment"
          rows={3}
          className="resize-none text-sm"
          placeholder="Необязательно"
          value={comment}
          disabled={disabled}
          onChange={(e) => onComment(e.target.value)}
        />
      </div>
    </section>
  );
}
