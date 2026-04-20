/** Публичный origin API (прокси на сервере Next). Переопределяется через `TABLECRM_PUBLIC_ORIGIN` на Vercel. */
const DEFAULT_TABLECRM_ORIGIN = "https://app.tablecrm.com/api/v1";

function normalizeOrigin(raw: string | undefined): string {
  const t = raw?.trim();
  if (!t) return DEFAULT_TABLECRM_ORIGIN;
  return t.replace(/\/+$/, "");
}

export const TABLECRM_PUBLIC_ORIGIN = normalizeOrigin(
  process.env.TABLECRM_PUBLIC_ORIGIN,
);

const ALLOWED_SEGMENTS = new Set([
  "contragents",
  "payboxes",
  "organizations",
  "warehouses",
  "price_types",
  "nomenclature",
  "docs_sales",
]);

/** Как на эталонном vercel: `docs-sales` → upstream `docs_sales`. */
export function normalizeTableCrmPath(segments: string[]): string[] {
  return segments.map((s) => {
    const t = s.replace(/\/$/, "");
    return t === "docs-sales" ? "docs_sales" : t;
  });
}

export function isAllowedTableCrmPath(segments: string[]): boolean {
  const norm = normalizeTableCrmPath(segments);
  if (norm.length === 0) return false;
  const head = norm[0] ?? "";
  return ALLOWED_SEGMENTS.has(head);
}
