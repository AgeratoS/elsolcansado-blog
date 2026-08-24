import { siteConfig } from "@/site.config";
import type { NextRequest } from "next/server";

export function getClientIp(request: NextRequest): string {
  const forwarded = request.headers.get("x-forwarded-for");
  if (forwarded) {
    const first = forwarded.split(",")[0]?.trim();
    if (first) {
      return first;
    }
  }

  return request.headers.get("x-real-ip") ?? "unknown";
}

export function isAllowedRequestOrigin(request: NextRequest): boolean {
  const allowed = new Set(
    [request.nextUrl.origin, siteConfig.site_domain].filter(Boolean),
  );

  const origin = request.headers.get("origin");
  if (origin && allowed.has(origin)) {
    return true;
  }

  const referer = request.headers.get("referer");
  if (!referer) {
    return false;
  }

  try {
    return allowed.has(new URL(referer).origin);
  } catch {
    return false;
  }
}
