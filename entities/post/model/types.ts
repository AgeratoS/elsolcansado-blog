export type WpRenderedString = {
  rendered: string;
  /** Whether the value should be treated as protected content. */
  protected?: boolean;
};

export type WpGuid = {
  rendered: string;
};

/**
 * Raw WordPress post object as returned by `/wp-json/wp/v2/posts`.
 * This is deliberately close to the WP schema, so avoid using it directly in UI.
 */
export interface WpPost {
  id: number;
  date: string | null;
  date_gmt: string | null;
  guid: WpGuid;
  modified: string;
  modified_gmt: string;
  slug: string;
  status:
    | "publish"
    | "future"
    | "draft"
    | "pending"
    | "private"
    | "trash"
    | "auto-draft"
    | "inherit";
  type: string;
  link: string;
  title: WpRenderedString;
  content: WpRenderedString & { block_version?: number | null };
  excerpt: WpRenderedString;
  author: number;
  featured_media: number;
  comment_status: "open" | "closed";
  ping_status: "open" | "closed";
  sticky: boolean;
  template: string;
  format:
    | "standard"
    | "aside"
    | "chat"
    | "gallery"
    | "link"
    | "image"
    | "quote"
    | "status"
    | "video"
    | "audio";
  categories: number[];
  tags: number[];
  meta?: Record<string, unknown>;
  yoast_head_json?: Record<string, unknown>;
  _links?: Record<string, unknown>;
}

/**
 * Normalized domain model for a blog post inside the app.
 * Use this type across widgets/features instead of the raw WP structure.
 */
export interface Post {
  id: number;
  slug: string;
  url: string;
  title: string;
  excerptHtml: string;
  contentHtml: string;
  publishedAt: string | null;
  updatedAt: string;
  authorId: number;
  featuredMediaId: number | null;
  categoryIds: number[];
  tagIds: number[];
  isSticky: boolean;
  status:
    | "publish"
    | "future"
    | "draft"
    | "pending"
    | "private"
    | "trash"
    | "auto-draft"
    | "inherit";
}

export interface PostListItem extends Pick<Post, "id" | "slug" | "url" | "title" | "publishedAt" | "updatedAt"> {
  excerptHtml: string;
  featuredMediaId: number | null;
  categoryIds: number[];
  tagIds: number[];
  isSticky: boolean;
}

export type PostStatus = Post["status"];

export interface GetPostsParams {
  page?: number;
  perPage?: number;
  search?: string;
  slug?: string;
  status?: PostStatus | PostStatus[];
  author?: number | number[];
  categories?: number | number[];
  tags?: number | number[];
  before?: string;
  after?: string;
}

export interface PaginatedResponse<T> {
  items: T[];
  total: number;
  totalPages: number;
}

export const mapWpPostToPost = (raw: WpPost): Post => ({
  id: raw.id,
  slug: raw.slug,
  url: raw.link,
  title: raw.title.rendered,
  excerptHtml: raw.excerpt.rendered,
  contentHtml: raw.content.rendered,
  publishedAt: raw.date,
  updatedAt: raw.modified,
  authorId: raw.author,
  featuredMediaId: raw.featured_media || null,
  categoryIds: raw.categories ?? [],
  tagIds: raw.tags ?? [],
  isSticky: raw.sticky,
  status: raw.status,
});

