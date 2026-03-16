import type { Media, WpMedia } from "../model/types";
import { mapWpMediaToMedia } from "../model/types";

const WP_API_BASE_URL = process.env.WP_API_BASE_URL;

if (!WP_API_BASE_URL) {
  throw new Error("WP_API_BASE_URL environment variable is not defined");
}

type WpQueryParams = Record<string, string | number | boolean | undefined>;

const buildQueryString = (params: WpQueryParams): string => {
  const searchParams = new URLSearchParams();

  Object.entries(params).forEach(([key, value]) => {
    if (value === undefined) return;

    if (Array.isArray(value)) {
      value.forEach((v) => searchParams.append(key, String(v)));
    } else {
      searchParams.set(key, String(value));
    }
  });

  const qs = searchParams.toString();
  return qs ? `?${qs}` : "";
};

const wpFetch = async <T>(path: string, params: WpQueryParams = {}): Promise<T> => {
  const qs = buildQueryString(params);
  const url = `${WP_API_BASE_URL.replace(/\/$/, "")}/wp-json/wp/v2${path}${qs}`;

  const res = await fetch(url, {
    method: "GET",
    headers: {
      Accept: "application/json",
    },
  });

  if (!res.ok) {
    throw new Error(`Failed to fetch media from WordPress: ${res.status} ${res.statusText}`);
  }

  return (await res.json()) as T;
};

export const getMediaById = async (id: number): Promise<Media> => {
  const data = await wpFetch<WpMedia>(`/media/${id}`);
  return mapWpMediaToMedia(data);
};

export const getMediaManyByIds = async (ids: number[]): Promise<Media[]> => {
  if (!ids.length) return [];

  const data = await wpFetch<WpMedia[]>("/media", {
    include: ids.join(","),
    per_page: ids.length,
  });

  return data.map(mapWpMediaToMedia);
};

