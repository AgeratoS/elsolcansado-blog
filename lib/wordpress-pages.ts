import type { Page } from "./wordpress.d";
import { getAllPages } from "./wordpress";

const NEXTJS_ROUTE_SEGMENTS = new Set(["posts", "pages", "api"]);

export function isReservedNextJsPath(path: string): boolean {
  const firstSegment = path.split("/").filter(Boolean)[0];
  return firstSegment ? NEXTJS_ROUTE_SEGMENTS.has(firstSegment) : false;
}

export function buildPagePath(
  page: Page,
  pagesById: Map<number, Page>,
): string {
  const segments: string[] = [];
  let current: Page | undefined = page;

  while (current) {
    segments.unshift(current.slug);
    current =
      current.parent !== 0 ? pagesById.get(current.parent) : undefined;
  }

  return segments.join("/");
}

export async function getAllPagePaths(): Promise<{ slug: string[] }[]> {
  const pages = await getAllPages();
  const pagesById = new Map(pages.map((page) => [page.id, page]));

  return pages
    .map((page) => buildPagePath(page, pagesById))
    .filter((path) => !isReservedNextJsPath(path))
    .map((path) => ({ slug: path.split("/") }));
}

export async function getPageByPath(path: string): Promise<Page | undefined> {
  const segments = path.split("/").filter(Boolean);
  if (segments.length === 0 || isReservedNextJsPath(path)) {
    return undefined;
  }

  const pages = await getAllPages();
  const pagesById = new Map(pages.map((page) => [page.id, page]));
  const leafSlug = segments[segments.length - 1];
  const candidates = pages.filter((page) => page.slug === leafSlug);

  for (const candidate of candidates) {
    if (buildPagePath(candidate, pagesById) === path) {
      return candidate;
    }
  }

  return undefined;
}

export async function getAllPagesForSitemap(): Promise<
  { path: string; modified: string }[]
> {
  const pages = await getAllPages();
  const pagesById = new Map(pages.map((page) => [page.id, page]));

  return pages
    .map((page) => ({
      path: buildPagePath(page, pagesById),
      modified: page.modified,
    }))
    .filter(({ path }) => !isReservedNextJsPath(path));
}
