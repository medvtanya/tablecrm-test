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
  /** Дата документа, Unix time в секундах (без этого в CRM часто `null` → отображается как 01.01.1970). */
  dated?: number;
  /** «Заказ» — заявка; «Реализация» — продажа (для отражения оплаты при проведении). */
  operation?: "Заказ" | "Реализация";
  goods: SaleGoodItem[];
  /** По схеме API — булев статус документа */
  status?: boolean;
  /** Сумма оплаты в рублях (наличные и т.п.). */
  paid_rubles?: number;
  /** В ответе CRM рядом с paid_rubles; часто нужно при создании, иначе сумма не пишется. */
  paid_doc?: number;
  paid_lt?: number;
};

export type CreateSaleResponse = unknown;
