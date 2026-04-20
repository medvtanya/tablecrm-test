"use client";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import type { Contragent } from "@/entities/contragent/model/types";

type Props = {
  phone: string;
  onPhoneChange: (v: string) => void;
  onSearch: () => void;
  searching: boolean;
  results: Contragent[];
  selected: Contragent | null;
  onSelect: (c: Contragent) => void;
  disabled: boolean;
};

export function ClientPhoneSection({
  phone,
  onPhoneChange,
  onSearch,
  searching,
  results,
  selected,
  onSelect,
  disabled,
}: Props) {
  return (
    <section className="space-y-3">
      <h2 className="text-sm font-medium tracking-tight">Клиент</h2>
      <div className="space-y-1.5">
        <Label htmlFor="phone" className="text-xs text-muted-foreground">
          Телефон
        </Label>
        <div className="flex gap-2">
          <Input
            id="phone"
            inputMode="tel"
            className="h-10 text-sm"
            placeholder="+7…"
            value={phone}
            disabled={disabled}
            onChange={(e) => onPhoneChange(e.target.value)}
          />
          <Button
            type="button"
            variant="secondary"
            className="h-10 shrink-0 px-4"
            disabled={disabled || !phone.trim() || searching}
            onClick={onSearch}
          >
            {searching ? "…" : "Найти"}
          </Button>
        </div>
      </div>
      {results.length > 0 && (
        <ul className="max-h-36 space-y-1 overflow-auto rounded-md border border-border/60 bg-muted/30 p-2 text-sm">
          {results.map((c) => (
            <li key={c.id}>
              <button
                type="button"
                className={
                  selected?.id === c.id
                    ? "w-full rounded bg-foreground/5 px-2 py-1.5 text-left"
                    : "w-full rounded px-2 py-1.5 text-left hover:bg-muted"
                }
                onClick={() => onSelect(c)}
              >
                <span className="font-medium">{c.name ?? "—"}</span>
                {c.phone ? (
                  <span className="ml-2 text-muted-foreground">{c.phone}</span>
                ) : null}
              </button>
            </li>
          ))}
        </ul>
      )}
      <p className="text-xs text-muted-foreground">
        {selected
          ? `Выбран: ${selected.name ?? "—"}. Контрагент уйдёт в документ продажи и в связанные отчёты (в т.ч. оплаты).`
          : "Клиент не выбран — в CRM в документе и в списках оплат поле контрагента будет пустым. Найдите по телефону и нажмите на строку клиента."}
      </p>
    </section>
  );
}
