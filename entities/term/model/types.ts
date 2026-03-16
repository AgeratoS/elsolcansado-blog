export interface WpTerm {
  id: number;
  count: number;
  description: string;
  link: string;
  name: string;
  slug: string;
  taxonomy: string;
  parent?: number;
  meta?: Record<string, unknown>;
}

export interface Term {
  id: number;
  name: string;
  slug: string;
  url: string;
  descriptionHtml: string;
  postCount: number;
  taxonomy: string;
  parentId: number | null;
}

export type Category = Term & { taxonomy: "category" };
export type Tag = Term & { taxonomy: "post_tag" };

export interface GetTermsParams {
  page?: number;
  perPage?: number;
  search?: string;
  slug?: string | string[];
  hideEmpty?: boolean;
  parent?: number;
  include?: number | number[];
}

export const mapWpTermToTerm = (raw: WpTerm): Term => ({
  id: raw.id,
  name: raw.name,
  slug: raw.slug,
  url: raw.link,
  descriptionHtml: raw.description,
  postCount: raw.count,
  taxonomy: raw.taxonomy,
  parentId: typeof raw.parent === "number" && raw.parent > 0 ? raw.parent : null,
});

