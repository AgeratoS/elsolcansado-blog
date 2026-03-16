import type {
  GetPostsParams,
  PaginatedResponse,
  Post,
  PostListItem,
  PostListItemWithFeaturedMedia,
  WpPost,
} from "../model/types";
import { mapWpPostToPost } from "../model/types";
import { getMediaManyByIds } from "@/entities/media";

const WP_API_BASE_URL = process.env.WP_API_BASE_URL;

if (!WP_API_BASE_URL) {
  // This error is thrown on the server side if the env is missing.
  throw new Error("WP_API_BASE_URL environment variable is not defined");
}

 type WpQueryParamPrimitive = string | number | boolean;
 type WpQueryParams = Record<string, WpQueryParamPrimitive | WpQueryParamPrimitive[] | undefined>;

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

const wpFetch = async <T>(path: string, params: WpQueryParams = {}): Promise<{ data: T; headers: Headers }> => {
  const qs = buildQueryString(params);
  const url = `${WP_API_BASE_URL.replace(/\/$/, "")}/wp-json/wp/v2${path}${qs}`;

  
  const res = await fetch(url, {
    method: "GET",
    // Credentials / auth headers можно добавить здесь при необходимости.
    headers: {
      Accept: "application/json",
    },
    // Важно: вызываем только с сервера (backend-backend), поэтому no-cache/next.js настройки можно задавать выше.
  });

  if (!res.ok) {
    throw new Error(`Failed to fetch from WordPress: ${res.status} ${res.statusText}`);
  }

  const data = (await res.json()) as T;
  return { data, headers: res.headers };
};

const normalizeStatus = (status?: GetPostsParams["status"]): string | undefined => {
  if (!status) return undefined;
  if (Array.isArray(status)) return status.join(",");
  return status;
};

export const getPosts = async (
  params: GetPostsParams = {},
): Promise<PaginatedResponse<PostListItemWithFeaturedMedia>> => {
  const { page = 1, perPage = 10, ...rest } = params;

  const { data, headers } = await wpFetch<WpPost[]>("/posts", {
    page,
    per_page: perPage,
    search: rest.search,
    slug: rest.slug,
    status: normalizeStatus(rest.status),
    author: rest.author,
    categories: rest.categories,
    tags: rest.tags,
    before: rest.before,
    after: rest.after,
  });

  const total = Number(headers.get("X-WP-Total") ?? 0);
  const totalPages = Number(headers.get("X-WP-TotalPages") ?? 0);

  const baseItems: PostListItem[] = data.map((raw) => {
    const post = mapWpPostToPost(raw);

    return {
      id: post.id,
      slug: post.slug,
      url: post.url,
      title: post.title,
      excerptHtml: post.excerptHtml,
      publishedAt: post.publishedAt,
      updatedAt: post.updatedAt,
      featuredMediaId: post.featuredMediaId,
      categoryIds: post.categoryIds,
      tagIds: post.tagIds,
      isSticky: post.isSticky,
    };
  });

  const featuredIds = Array.from(
    new Set(
      baseItems
        .map((p) => p.featuredMediaId)
        .filter((id): id is number => typeof id === "number"),
    ),
  );

  const medias = await getMediaManyByIds(featuredIds);
  const mediaById = new Map(medias.map((m) => [m.id, m]));

  const items: PostListItemWithFeaturedMedia[] = baseItems.map((item) => ({
    ...item,
    featuredMedia: item.featuredMediaId
      ? mediaById.get(item.featuredMediaId) ?? null
      : null,
  }));

  return {
    items,
    total,
    totalPages,
  };
};

export const getPostBySlug = async (slug: string): Promise<Post | null> => {
  try {
    // Если "slug" пришёл в виде числовой строки (например, "70"),
    // то сразу ходим по /posts/{id}, как в твоём рабочем запросе.
    const numericId = Number(slug);
    if (Number.isInteger(numericId) && String(numericId) === slug.trim()) {
      const { data } = await wpFetch<WpPost>(`/posts/${numericId}`);
      return mapWpPostToPost(data);
    }

    // Иначе ищем по настоящему slug через query-параметры.
    const { data } = await wpFetch<WpPost[]>("/posts", {
      slug,
      per_page: 1,
    });

    const raw = data[0];
    if (!raw) return null;

    return mapWpPostToPost(raw);
  } catch (error) {
    if (error instanceof Error && error.message.startsWith("Failed to fetch from WordPress: 404")) {
      return null;
    }

    throw error;
  }
};

export const getPostById = async (id: number): Promise<Post | null> => {
  try {
    const { data } = await wpFetch<WpPost>(`/posts/${id}`);
    return mapWpPostToPost(data);
  } catch (error) {
    if (error instanceof Error && error.message.startsWith("Failed to fetch from WordPress: 404")) {
      return null;
    }

    throw error;
  }
};

