/** Элемент строки продажи (POST /docs_sales/) */
export type SaleGoodItem = {
  nomenclature: number;
  nomenclature_name?: string;
  quantity: number;
  price: number;
  price_type: number;
  discount?: number;
};

/** Одна продажа в массиве CreateMass */
export type CreateSalePayload = {
  organization: number;
  contragent?: number;
  paybox?: number;
  warehouse?: number;
  comment?: string;
  /** «Заказ» — заявка; «Реализация» — продажа (для отражения оплаты при проведении). */
  operation?: "Заказ" | "Реализация";
  goods: SaleGoodItem[];
  /** По схеме API — булев статус документа */
  status?: boolean;
  /** Сумма оплаты в рублях (для «Реализация» + проведение — иначе в CRM часто «Не оплачен»). */
  paid_rubles?: number;
  paid_lt?: number;
};

export type CreateSaleResponse = unknown;
