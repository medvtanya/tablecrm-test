import {
  isAllowedTableCrmPath,
  normalizeTableCrmPath,
  TABLECRM_PUBLIC_ORIGIN,
} from "@/shared/config";
import { NextRequest, NextResponse } from "next/server";

const TOKEN_HEADER = "x-tablecrm-token";

function buildApiPath(pathSegments: string[]): string {
  if (pathSegments.length === 1) {
    return `${pathSegments[0].replace(/\/$/, "")}/`;
  }
  return pathSegments.map((s) => s.replace(/^\/|\/$/g, "")).join("/");
}

function buildUpstreamUrl(
  pathSegments: string[],
  searchParams: URLSearchParams,
): string {
  const path = buildApiPath(pathSegments);
  const qs = searchParams.toString();
  return `${TABLECRM_PUBLIC_ORIGIN}/${path}${qs ? `?${qs}` : ""}`;
}

/** Эталон: `?conduct=true` → у TableCRM в OpenAPI это `generate_out`. */
function applyConductToGenerateOut(sp: URLSearchParams) {
  if (!sp.has("conduct")) return;
  const c = sp.get("conduct");
  const gen =
    c === "true" || c === "1" || c === "True" ? "true" : "false";
  sp.set("generate_out", gen);
  sp.delete("conduct");
}

async function proxy(req: NextRequest, segments: string[]) {
  const normalizedSegments = normalizeTableCrmPath(segments);

  if (!isAllowedTableCrmPath(segments)) {
    return NextResponse.json({ error: "Path not allowed" }, { status: 403 });
  }

  const url = new URL(req.url);
  const sp = new URLSearchParams(url.searchParams);

  const token =
    req.headers.get(TOKEN_HEADER)?.trim() ?? sp.get("token")?.trim();
  if (!token) {
    return NextResponse.json({ error: "Missing token" }, { status: 401 });
  }

  applyConductToGenerateOut(sp);
  sp.set("token", token);

  const upstream = new URL(buildUpstreamUrl(normalizedSegments, sp));

  const headers: Record<string, string> = { Accept: "application/json" };
  if (req.method !== "GET" && req.method !== "HEAD") {
    const ct = req.headers.get("Content-Type");
    if (ct) headers["Content-Type"] = ct;
  }

  const init: RequestInit = {
    method: req.method,
    headers,
  };

  if (req.method !== "GET" && req.method !== "HEAD") {
    const body = await req.text();
    if (body) init.body = body;
  }

  const res = await fetch(upstream.toString(), init);
  const text = await res.text();
  const contentType = res.headers.get("Content-Type") ?? "application/json";

  return new NextResponse(text, {
    status: res.status,
    headers: { "Content-Type": contentType },
  });
}

export async function GET(
  req: NextRequest,
  ctx: { params: Promise<{ path: string[] }> },
) {
  const { path } = await ctx.params;
  return proxy(req, path);
}

export async function POST(
  req: NextRequest,
  ctx: { params: Promise<{ path: string[] }> },
) {
  const { path } = await ctx.params;
  return proxy(req, path);
}

export async function PATCH(
  req: NextRequest,
  ctx: { params: Promise<{ path: string[] }> },
) {
  const { path } = await ctx.params;
  return proxy(req, path);
}

export async function DELETE(
  req: NextRequest,
  ctx: { params: Promise<{ path: string[] }> },
) {
  const { path } = await ctx.params;
  return proxy(req, path);
}
