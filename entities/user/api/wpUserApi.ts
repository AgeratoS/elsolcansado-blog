import type { GetUsersParams, User, WpUser } from "../model/types";
import { mapWpUserToUser } from "../model/types";

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
    throw new Error(`Failed to fetch users from WordPress: ${res.status} ${res.statusText}`);
  }

  return (await res.json()) as T;
};

const normalizeIds = (ids?: number[]): string | undefined => {
  if (!ids || ids.length === 0) return undefined;
  return ids.join(",");
};

const normalizeSlug = (slug?: string | string[]): string | undefined => {
  if (!slug) return undefined;
  if (Array.isArray(slug)) return slug.join(",");
  return slug;
};

export const getUsers = async (params: GetUsersParams = {}): Promise<User[]> => {
  const { page = 1, perPage = 20, ...rest } = params;

  const data = await wpFetch<WpUser[]>("/users", {
    page,
    per_page: perPage,
    search: rest.search,
    include: normalizeIds(rest.include),
    exclude: normalizeIds(rest.exclude),
    slug: normalizeSlug(rest.slug),
  });

  return data.map(mapWpUserToUser);
};

export const getUserById = async (id: number): Promise<User> => {
  const data = await wpFetch<WpUser>(`/users/${id}`);
  return mapWpUserToUser(data);
};

