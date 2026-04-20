"use client";

import { ClientPhoneSection } from "@/features/client-phone-search/ui/client-phone-section";
import { ConnectPayboxSection } from "@/features/connect-paybox/ui/connect-paybox-section";
import { OrderLinesSection } from "@/features/order-lines/ui/order-lines-section";
import { SaleParamsSection } from "@/features/sale-params/ui/sale-params-section";
import { fetchContragentsByPhone } from "@/entities/contragent/api/contragent-api";
import type { Contragent } from "@/entities/contragent/model/types";
import type { Nomenclature } from "@/entities/nomenclature/model/types";
import { searchNomenclature } from "@/entities/nomenclature/api/nomenclature-api";
import { fetchOrganizations } from "@/entities/organization/api/organization-api";
import type { Organization } from "@/entities/organization/model/types";
import { fetchPayboxes } from "@/entities/paybox/api/paybox-api";
import type { Paybox } from "@/entities/paybox/model/types";
import { fetchPriceTypes } from "@/entities/price-type/api/price-type-api";
import type { PriceType } from "@/entities/price-type/model/types";
import { createSale } from "@/entities/sale/api/sale-api";
import type { CartLine } from "@/entities/sale/model/cart-line";
import type { CreateSalePayload } from "@/entities/sale/model/types";
import { fetchWarehouses } from "@/entities/warehouse/api/warehouse-api";
import type { Warehouse } from "@/entities/warehouse/model/types";
import { TableCrmHttpError } from "@/shared/api/tablecrm-client";
import { createLineId } from "@/shared/lib/id";
import { pickPriceForType } from "@/shared/lib/nomenclature-price";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Separator } from "@/components/ui/separator";
import { useCallback, useEffect, useMemo, useState } from "react";
import { toast } from "sonner";

const TOKEN_KEY = "tablecrm_token";

function errToast(e: unknown) {
  if (e instanceof TableCrmHttpError) {
    let msg = e.message;
    try {
      const j = JSON.parse(e.body) as { detail?: unknown };
      if (typeof j.detail === "string") msg = j.detail;
    } catch {
      /* ignore */
    }
    toast.error(msg);
    return;
  }
  toast.error(e instanceof Error ? e.message : "Ошибка запроса");
}

export function MobileOrderForm() {
  const [token, setToken] = useState("");
  const [connected, setConnected] = useState(false);
  const [loadingRefs, setLoadingRefs] = useState(false);

  const [organizations, setOrganizations] = useState<Organization[]>([]);
  const [payboxes, setPayboxes] = useState<Paybox[]>([]);
  const [warehouses, setWarehouses] = useState<Warehouse[]>([]);
  const [priceTypes, setPriceTypes] = useState<PriceType[]>([]);

  const [organizationId, setOrganizationId] = useState("");
  const [payboxId, setPayboxId] = useState("");
  const [warehouseId, setWarehouseId] = useState("");
  const [priceTypeId, setPriceTypeId] = useState("");

  const [phone, setPhone] = useState("");
  const [searchingClient, setSearchingClient] = useState(false);
  const [contragentHits, setContragentHits] = useState<Contragent[]>([]);
  const [contragent, setContragent] = useState<Contragent | null>(null);

  const [productQuery, setProductQuery] = useState("");
  const [productLoading, setProductLoading] = useState(false);
  const [productHits, setProductHits] = useState<Nomenclature[]>([]);

  const [lines, setLines] = useState<CartLine[]>([]);
  const [comment, setComment] = useState("");
  const [submitting, setSubmitting] = useState(false);

  useEffect(() => {
    const t = sessionStorage.getItem(TOKEN_KEY);
    if (t) queueMicrotask(() => setToken(t));
  }, []);

  useEffect(() => {
    if (token) sessionStorage.setItem(TOKEN_KEY, token);
  }, [token]);

  const selectedPriceType = useMemo(
    () => priceTypes.find((p) => String(p.id) === priceTypeId) ?? null,
    [priceTypes, priceTypeId],
  );

  const loadReferences = useCallback(async () => {
    const t = token.trim();
    if (!t) {
      toast.error("Введите токен");
      return;
    }
    setLoadingRefs(true);
    try {
      const [org, pb, wh, pt] = await Promise.all([
        fetchOrganizations(t),
        fetchPayboxes(t),
        fetchWarehouses(t),
        fetchPriceTypes(t),
      ]);
      setOrganizations(org.result ?? []);
      setPayboxes(pb.result ?? []);
      setWarehouses(wh.result ?? []);
      setPriceTypes(pt.result ?? []);
      setConnected(true);
      setOrganizationId((prev) => prev || (org.result?.[0] ? String(org.result[0].id) : ""));
      setPayboxId((prev) => prev || (pb.result?.[0] ? String(pb.result[0].id) : ""));
      setWarehouseId((prev) => prev || (wh.result?.[0] ? String(wh.result[0].id) : ""));
      setPriceTypeId((prev) => prev || (pt.result?.[0] ? String(pt.result[0].id) : ""));
      toast.success("Справочники загружены");
    } catch (e) {
      setConnected(false);
      errToast(e);
    } finally {
      setLoadingRefs(false);
    }
  }, [token]);

  const searchClients = useCallback(async () => {
    const t = token.trim();
    if (!t || !connected) return;
    setSearchingClient(true);
    try {
      const res = await fetchContragentsByPhone(t, phone);
      setContragentHits(res.result ?? []);
      if (!res.result?.length) toast.message("Ничего не найдено");
    } catch (e) {
      errToast(e);
    } finally {
      setSearchingClient(false);
    }
  }, [token, connected, phone]);

  const searchProducts = useCallback(async () => {
    const t = token.trim();
    if (!t || !connected) return;
    setProductLoading(true);
    try {
      const res = await searchNomenclature(t, productQuery);
      setProductHits(res.result ?? []);
    } catch (e) {
      errToast(e);
    } finally {
      setProductLoading(false);
    }
  }, [token, connected, productQuery]);

  const handlePriceTypeChange = (id: string) => {
    setPriceTypeId(id);
    const pt = priceTypes.find((p) => String(p.id) === id) ?? null;
    if (!pt) return;
    setLines((prev) => {
      if (prev.length === 0) return prev;
      return prev.map((line) => {
        const next = pickPriceForType(line.nomenclature, pt);
        return {
          ...line,
          unitPrice: next ?? line.unitPrice,
        };
      });
    });
  };

  const addProduct = (n: Nomenclature) => {
    if (!selectedPriceType) {
      toast.error("Выберите тип цены");
      return;
    }
    const price = pickPriceForType(n, selectedPriceType) ?? 0;
    setLines((prev) => [
      ...prev,
      {
        id: createLineId(),
        nomenclature: n,
        quantity: 1,
        unitPrice: price,
      },
    ]);
  };

  const submit = async (generateOut: boolean) => {
    const t = token.trim();
    if (!t || !connected) {
      toast.error("Сначала подключите кассу");
      return;
    }
    if (!organizationId) {
      toast.error("Выберите организацию");
      return;
    }
    if (!selectedPriceType) {
      toast.error("Выберите тип цены");
      return;
    }
    if (lines.length === 0) {
      toast.error("Добавьте товары");
      return;
    }

    const totalPaid = lines.reduce(
      (s, l) => s + l.quantity * l.unitPrice,
      0,
    );
    const paidRounded = Math.round(totalPaid * 100) / 100;

    const payload: CreateSalePayload = {
      organization: Number(organizationId),
      contragent: contragent?.id,
      paybox: payboxId ? Number(payboxId) : undefined,
      warehouse: warehouseId ? Number(warehouseId) : undefined,
      comment: comment.trim() || undefined,
      operation: "Заказ",
      paid_rubles: paidRounded,
      goods: lines.map((l) => ({
        nomenclature: l.nomenclature.id,
        nomenclature_name: l.nomenclature.name,
        quantity: l.quantity,
        price: l.unitPrice,
        price_type: selectedPriceType.id,
      })),
    };

    setSubmitting(true);
    try {
      await createSale(t, [payload], generateOut);
      toast.success(
        generateOut ? "Продажа создана и проведена" : "Продажа создана",
      );
      setLines([]);
      setComment("");
    } catch (e) {
      errToast(e);
    } finally {
      setSubmitting(false);
    }
  };

  const formDisabled = !connected;

  return (
    <div className="mx-auto flex w-full max-w-lg flex-col gap-6 px-4 py-8 pb-24">
      <header className="space-y-1">
        <p className="text-xs font-medium uppercase tracking-widest text-muted-foreground">
          tablecrm.com
        </p>
        <h1 className="text-xl font-semibold tracking-tight">Мобильный заказ</h1>
        <p className="text-sm text-muted-foreground">
          Оформление продажи через API кассы.
        </p>
      </header>

      <Card className="border-border/60 shadow-none">
        <CardContent className="space-y-8 p-5 pt-6">
          <ConnectPayboxSection
            token={token}
            onTokenChange={setToken}
            onConnect={loadReferences}
            loading={loadingRefs}
            connected={connected}
          />
          <Separator className="bg-border/60" />
          <ClientPhoneSection
            phone={phone}
            onPhoneChange={setPhone}
            onSearch={searchClients}
            searching={searchingClient}
            results={contragentHits}
            selected={contragent}
            onSelect={setContragent}
            disabled={formDisabled}
          />
          <Separator className="bg-border/60" />
          <SaleParamsSection
            organizations={organizations}
            payboxes={payboxes}
            warehouses={warehouses}
            priceTypes={priceTypes}
            organizationId={organizationId}
            payboxId={payboxId}
            warehouseId={warehouseId}
            priceTypeId={priceTypeId}
            onOrganization={setOrganizationId}
            onPaybox={setPayboxId}
            onWarehouse={setWarehouseId}
            onPriceType={handlePriceTypeChange}
            disabled={formDisabled}
          />
          <Separator className="bg-border/60" />
          <OrderLinesSection
            query={productQuery}
            onQueryChange={setProductQuery}
            onSearchProducts={searchProducts}
            productLoading={productLoading}
            searchHits={productHits}
            selectedPriceType={selectedPriceType}
            onAddProduct={addProduct}
            lines={lines}
            onQty={(lineId, qty) =>
              setLines((prev) =>
                prev.map((l) =>
                  l.id === lineId ? { ...l, quantity: Math.max(0.001, qty) } : l,
                ),
              )
            }
            onPrice={(lineId, price) =>
              setLines((prev) =>
                prev.map((l) =>
                  l.id === lineId ? { ...l, unitPrice: Math.max(0, price) } : l,
                ),
              )
            }
            onRemove={(lineId) =>
              setLines((prev) => prev.filter((l) => l.id !== lineId))
            }
            comment={comment}
            onComment={setComment}
            disabled={formDisabled}
          />
        </CardContent>
      </Card>

      <div className="fixed inset-x-0 bottom-0 z-10 border-t border-border/60 bg-background/95 px-4 py-3 backdrop-blur supports-[backdrop-filter]:bg-background/80">
        <div className="mx-auto flex max-w-lg gap-2">
          <Button
            type="button"
            variant="secondary"
            className="h-11 flex-1"
            disabled={submitting || formDisabled}
            onClick={() => submit(false)}
          >
            Создать продажу
          </Button>
          <Button
            type="button"
            className="h-11 flex-1"
            disabled={submitting || formDisabled}
            onClick={() => submit(true)}
          >
            Создать и провести
          </Button>
        </div>
      </div>
    </div>
  );
}
