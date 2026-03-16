export interface WpMediaDetailsSize {
  file: string;
  width: number;
  height: number;
  mime_type: string;
  source_url: string;
}

export interface WpMediaDetails {
  width: number;
  height: number;
  file: string;
  sizes?: Record<string, WpMediaDetailsSize>;
  image_meta?: Record<string, unknown>;
}

export interface WpMedia {
  id: number;
  date: string;
  date_gmt: string;
  slug: string;
  type: "attachment";
  link: string;
  title: { rendered: string };
  author: number;
  caption?: { rendered: string };
  alt_text: string;
  media_type: "image" | "file" | string;
  mime_type: string;
  media_details?: WpMediaDetails;
  source_url: string;
  post?: number;
}

export interface Media {
  id: number;
  slug: string;
  url: string;
  title: string;
  captionHtml?: string;
  alt: string;
  mimeType: string;
  width?: number;
  height?: number;
  sizes: Record<string, WpMediaDetailsSize>;
  attachedToPostId?: number;
}

export const mapWpMediaToMedia = (raw: WpMedia): Media => ({
  id: raw.id,
  slug: raw.slug,
  url: raw.source_url,
  title: raw.title?.rendered ?? "",
  captionHtml: raw.caption?.rendered,
  alt: raw.alt_text,
  mimeType: raw.mime_type,
  width: raw.media_details?.width,
  height: raw.media_details?.height,
  sizes: raw.media_details?.sizes ?? {},
  attachedToPostId: raw.post,
});

