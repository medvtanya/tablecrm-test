export class TableCrmHttpError extends Error {
  constructor(
    message: string,
    public readonly status: number,
    public readonly body: string,
  ) {
    super(message);
    this.name = "TableCrmHttpError";
  }
}

type FetchJsonOpts = {
  token: string;
  path: string;
  searchParams?: Record<string, string | number | boolean | undefined | null>;
  method?: "GET" | "POST" | "PATCH" | "DELETE";
  body?: unknown;
};

function toSearchParams(
  sp: FetchJsonOpts["searchParams"],
): Record<string, string> {
  const out: Record<string, string> = {};
  if (!sp) return out;
  for (const [k, v] of Object.entries(sp)) {
    if (v === undefined || v === null) continue;
    out[k] = String(v);
  }
  return out;
}

export async function tablecrmFetchJson<T>(
  opts: FetchJsonOpts,
): Promise<T> {
  const { token, path, searchParams, method = "GET", body } = opts;
  const usp = new URLSearchParams(toSearchParams(searchParams));
  const qs = usp.toString();
  const url = `/api/tablecrm/${path.replace(/^\/+/, "")}${qs ? `?${qs}` : ""}`;

  const headers: Record<string, string> = {
    "x-tablecrm-token": token,
    Accept: "application/json",
  };
  if (body !== undefined) {
    headers["Content-Type"] = "application/json";
  }

  const res = await fetch(url, {
    method,
    headers,
    body: body !== undefined ? JSON.stringify(body) : undefined,
  });

  const text = await res.text();
  if (!res.ok) {
    throw new TableCrmHttpError(
      `HTTP ${res.status}`,
      res.status,
      text,
    );
  }

  if (!text) return undefined as T;
  try {
    return JSON.parse(text) as T;
  } catch {
    return text as unknown as T;
  }
}
