"use client";

import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import type { Organization } from "@/entities/organization/model/types";
import type { Paybox } from "@/entities/paybox/model/types";
import type { PriceType } from "@/entities/price-type/model/types";
import type { Warehouse } from "@/entities/warehouse/model/types";

type Props = {
  organizations: Organization[];
  payboxes: Paybox[];
  warehouses: Warehouse[];
  priceTypes: PriceType[];
  organizationId: string;
  payboxId: string;
  warehouseId: string;
  priceTypeId: string;
  onOrganization: (id: string) => void;
  onPaybox: (id: string) => void;
  onWarehouse: (id: string) => void;
  onPriceType: (id: string) => void;
  disabled: boolean;
};

function orgLabel(o: Organization) {
  return o.short_name || o.work_name || o.full_name || `№${o.id}`;
}

export function SaleParamsSection({
  organizations,
  payboxes,
  warehouses,
  priceTypes,
  organizationId,
  payboxId,
  warehouseId,
  priceTypeId,
  onOrganization,
  onPaybox,
  onWarehouse,
  onPriceType,
  disabled,
}: Props) {
  return (
    <section className="space-y-4">
      <h2 className="text-sm font-medium tracking-tight">Параметры</h2>
      <div className="grid gap-4 sm:grid-cols-2">
        <div className="space-y-1.5">
          <Label className="text-xs text-muted-foreground">Организация</Label>
          <Select
            value={organizationId}
            onValueChange={(v) => v && onOrganization(v)}
            disabled={disabled}
          >
            <SelectTrigger className="h-10 w-full">
              <SelectValue placeholder="Выберите" />
            </SelectTrigger>
            <SelectContent>
              {organizations.map((o) => (
                <SelectItem key={o.id} value={String(o.id)}>
                  {orgLabel(o)}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>
        <div className="space-y-1.5">
          <Label className="text-xs text-muted-foreground">Счёт</Label>
          <Select
            value={payboxId}
            onValueChange={(v) => v && onPaybox(v)}
            disabled={disabled}
          >
            <SelectTrigger className="h-10 w-full">
              <SelectValue placeholder="Выберите" />
            </SelectTrigger>
            <SelectContent>
              {payboxes.map((p) => (
                <SelectItem key={p.id} value={String(p.id)}>
                  {p.name}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>
        <div className="space-y-1.5">
          <Label className="text-xs text-muted-foreground">Склад</Label>
          <Select
            value={warehouseId}
            onValueChange={(v) => v && onWarehouse(v)}
            disabled={disabled}
          >
            <SelectTrigger className="h-10 w-full">
              <SelectValue placeholder="Выберите" />
            </SelectTrigger>
            <SelectContent>
              {warehouses.map((w) => (
                <SelectItem key={w.id} value={String(w.id)}>
                  {w.name}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>
        <div className="space-y-1.5">
          <Label className="text-xs text-muted-foreground">Тип цены</Label>
          <Select
            value={priceTypeId}
            onValueChange={(v) => v && onPriceType(v)}
            disabled={disabled}
          >
            <SelectTrigger className="h-10 w-full">
              <SelectValue placeholder="Выберите" />
            </SelectTrigger>
            <SelectContent>
              {priceTypes.map((pt) => (
                <SelectItem key={pt.id} value={String(pt.id)}>
                  {pt.name}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>
      </div>
    </section>
  );
}
