import type { FeaturedMedia, Post } from "@/lib/wordpress.d";

type MockPostInput = {
  id: number;
  slug: string;
  title: string;
  excerpt: string;
  content?: string;
  date?: string;
  imageUrl: string;
  imageAlt: string;
  categoryName?: string;
  categorySlug?: string;
  categories?: number[];
  tags?: number[];
};

const DEFAULT_POST_FIELDS = {
  date_gmt: "2025-06-01T12:00:00",
  modified: "2025-06-01T12:00:00",
  modified_gmt: "2025-06-01T12:00:00",
  status: "publish" as const,
  comment_status: "open" as const,
  ping_status: "open" as const,
  sticky: false,
  template: "",
  format: "standard" as const,
  author: 1,
  meta: {},
};

function createFeaturedMedia(
  id: number,
  imageUrl: string,
  altText: string,
): FeaturedMedia {
  return {
    id,
    date: "2025-06-01T12:00:00",
    date_gmt: "2025-06-01T12:00:00",
    modified: "2025-06-01T12:00:00",
    modified_gmt: "2025-06-01T12:00:00",
    slug: `featured-${id}`,
    status: "publish",
    link: imageUrl,
    guid: { rendered: imageUrl },
    title: { rendered: altText },
    author: 1,
    caption: { rendered: "" },
    alt_text: altText,
    media_type: "image",
    mime_type: "image/jpeg",
    source_url: imageUrl,
    media_details: {
      width: 1200,
      height: 800,
      file: `featured-${id}.jpg`,
      sizes: {},
    },
  };
}

function createMockPost({
  id,
  slug,
  title,
  excerpt,
  content,
  date = "2025-06-01T12:00:00",
  imageUrl,
  imageAlt,
  categoryName = "Журнал",
  categorySlug = "journal",
  categories = [1],
  tags = [1],
}: MockPostInput): Post {
  const link = `https://example.com/posts/${slug}`;
  const body = content ?? excerpt;

  return {
    ...DEFAULT_POST_FIELDS,
    id,
    date,
    slug,
    link,
    guid: { rendered: link },
    title: { rendered: title },
    content: { rendered: `<p>${body}</p>`, protected: false },
    excerpt: { rendered: `<p>${excerpt}</p>`, protected: false },
    featured_media: id * 100,
    categories,
    tags,
    _embedded: {
      author: [
        {
          id: 1,
          name: "Elsol Cansado",
          slug: "elsol-cansado",
          avatar_urls: {
            "96": "https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?w=96&h=96&fit=crop",
          },
        },
      ],
      "wp:featuredmedia": [createFeaturedMedia(id * 100, imageUrl, imageAlt)],
      "wp:term": [
        [
          {
            id: categories[0],
            name: categoryName,
            slug: categorySlug,
          },
        ],
      ],
    },
  };
}

export const mockPosts: Post[] = [
  createMockPost({
    id: 1,
    slug: "morning-coffee-and-code",
    title: "Morning Coffee and Code",
    excerpt:
      "A quiet start to the day: espresso, an open editor, and a list of small refactors that suddenly feel possible.",
    imageUrl:
      "https://images.unsplash.com/photo-1499750310102-5fef28fd666a?w=1200&h=800&fit=crop",
    imageAlt: "Laptop and coffee on a wooden desk",
    categories: [1],
    tags: [1, 2],
  }),
  createMockPost({
    id: 2,
    slug: "alpine-light-above-the-clouds",
    title: "Alpine Light Above the Clouds",
    excerpt:
      "High peaks, cold air, and that brief moment when the sun breaks through and turns everything gold.",
    date: "2024-11-08T10:00:00",
    categoryName: "Путешествия",
    categorySlug: "travel",
    imageUrl:
      "https://images.unsplash.com/photo-1506905925346-21bda4d32df4?w=1200&h=800&fit=crop",
    imageAlt: "Snowy mountain range at sunrise",
    categories: [2],
    tags: [3],
  }),
  createMockPost({
    id: 3,
    slug: "building-in-public",
    title: "Building in Public",
    excerpt:
      "Shipping small slices, sharing progress, and learning that momentum matters more than a perfect launch.",
    imageUrl:
      "https://images.unsplash.com/photo-1517694712202-14dd9538aa97?w=1200&h=800&fit=crop",
    imageAlt: "Developer working on a laptop in a bright room",
    categories: [3],
    tags: [4, 5],
  }),
  createMockPost({
    id: 4,
    slug: "city-walks-after-rain",
    title: "City Walks After Rain",
    excerpt:
      "Wet pavement, reflected lights, and the kind of evening stroll that resets your head after a long week.",
    imageUrl:
      "https://images.unsplash.com/photo-1477959858367-b4e565193e46?w=1200&h=800&fit=crop",
    imageAlt: "City skyline with wet streets at dusk",
    categories: [4],
    tags: [6],
  }),
  createMockPost({
    id: 5,
    slug: "notes-from-the-reading-chair",
    title: "10 вещей о которых я молчал 5 лет",
    excerpt:
      "Dog-eared pages, margin scribbles, and the slow pleasure of finishing a book you did not want to end.",
    content:
      "За пять лет тишины накопилось больше, чем кажется с первого взгляда. ".repeat(120),
    date: "2024-11-08T10:00:00",
    categoryName: "Философия",
    categorySlug: "philosophy",
    imageUrl:
      "https://images.unsplash.com/photo-1481627834876-b7833e8f5570?w=1200&h=800&fit=crop",
    imageAlt: "Books stacked on a shelf in warm light",
    categories: [5],
    tags: [7, 8],
  }),
];

export const mockPost = mockPosts[0];

const MOCK_POST_TEMPLATES: MockPostInput[] = [
  {
    id: 1,
    slug: "morning-coffee-and-code",
    title: "Morning Coffee and Code",
    excerpt:
      "A quiet start to the day: espresso, an open editor, and a list of small refactors that suddenly feel possible.",
    imageUrl:
      "https://images.unsplash.com/photo-1499750310102-5fef28fd666a?w=1200&h=800&fit=crop",
    imageAlt: "Laptop and coffee on a wooden desk",
    categories: [1],
    tags: [1, 2],
  },
  {
    id: 2,
    slug: "alpine-light-above-the-clouds",
    title: "Alpine Light Above the Clouds",
    excerpt:
      "High peaks, cold air, and that brief moment when the sun breaks through and turns everything gold.",
    date: "2024-11-08T10:00:00",
    categoryName: "Путешествия",
    categorySlug: "travel",
    imageUrl:
      "https://images.unsplash.com/photo-1506905925346-21bda4d32df4?w=1200&h=800&fit=crop",
    imageAlt: "Snowy mountain range at sunrise",
    categories: [2],
    tags: [3],
  },
  {
    id: 3,
    slug: "building-in-public",
    title: "Building in Public",
    excerpt:
      "Shipping small slices, sharing progress, and learning that momentum matters more than a perfect launch.",
    imageUrl:
      "https://images.unsplash.com/photo-1517694712202-14dd9538aa97?w=1200&h=800&fit=crop",
    imageAlt: "Developer working on a laptop in a bright room",
    categories: [3],
    tags: [4, 5],
  },
  {
    id: 4,
    slug: "city-walks-after-rain",
    title: "City Walks After Rain",
    excerpt:
      "Wet pavement, reflected lights, and the kind of evening stroll that resets your head after a long week.",
    imageUrl:
      "https://images.unsplash.com/photo-1477959858367-b4e565193e46?w=1200&h=800&fit=crop",
    imageAlt: "City skyline with wet streets at dusk",
    categories: [4],
    tags: [6],
  },
  {
    id: 5,
    slug: "notes-from-the-reading-chair",
    title: "10 вещей о которых я молчал 5 лет",
    excerpt:
      "Dog-eared pages, margin scribbles, and the slow pleasure of finishing a book you did not want to end.",
    content:
      "За пять лет тишины накопилось больше, чем кажется с первого взгляда. ".repeat(120),
    date: "2024-11-08T10:00:00",
    categoryName: "Философия",
    categorySlug: "philosophy",
    imageUrl:
      "https://images.unsplash.com/photo-1481627834876-b7833e8f5570?w=1200&h=800&fit=crop",
    imageAlt: "Books stacked on a shelf in warm light",
    categories: [5],
    tags: [7, 8],
  },
];

export function createMockPosts(count: number): Post[] {
  return Array.from({ length: count }, (_, index) => {
    const template = MOCK_POST_TEMPLATES[index % MOCK_POST_TEMPLATES.length];
    const id = index + 1;

    return createMockPost({
      ...template,
      id,
      slug: `${template.slug}-${id}`,
      title: `${template.title} #${id}`,
      date: new Date(2025, 5, 30 - index).toISOString(),
    });
  });
}
