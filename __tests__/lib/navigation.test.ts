import { describe, it, expect, vi, beforeEach, afterEach } from "vitest";
import { coreNavItems } from "@/frontend/shared/config/menu";
import { getHeaderNavigation, getMainNavigation } from "@/lib/navigation";
import type { Page } from "@/lib/wordpress.d";
import * as wordpress from "@/lib/wordpress";

function createPage(overrides: Partial<Page> & Pick<Page, "id" | "slug">): Page {
  return {
    date: "2025-01-01T00:00:00",
    date_gmt: "2025-01-01T00:00:00",
    modified: "2025-01-02T00:00:00",
    modified_gmt: "2025-01-02T00:00:00",
    status: "publish",
    link: "",
    guid: { rendered: "" },
    title: { rendered: "Title" },
    content: { rendered: "<p>Content</p>", protected: false },
    excerpt: { rendered: "", protected: false },
    author: 1,
    featured_media: 0,
    parent: 0,
    menu_order: 0,
    comment_status: "closed",
    ping_status: "closed",
    template: "",
    meta: {},
    ...overrides,
  };
}

describe("getMainNavigation", () => {
  beforeEach(() => {
    vi.spyOn(wordpress, "getAllPages").mockReset();
  });

  afterEach(() => {
    vi.restoreAllMocks();
  });

  it("returns core items followed by top-level CMS pages sorted by menu_order", async () => {
    const about = createPage({
      id: 10,
      slug: "about-me",
      title: { rendered: "Обо мне" },
      menu_order: 2,
    });
    const contacts = createPage({
      id: 11,
      slug: "contacts",
      title: { rendered: "Контакты" },
      menu_order: 1,
    });
    const child = createPage({
      id: 12,
      slug: "team",
      parent: 10,
      title: { rendered: "Команда" },
    });
    const reserved = createPage({
      id: 13,
      slug: "posts",
      title: { rendered: "Posts page" },
    });

    vi.spyOn(wordpress, "getAllPages").mockResolvedValue([
      about,
      contacts,
      child,
      reserved,
    ]);

    await expect(getMainNavigation()).resolves.toEqual([
      ...coreNavItems,
      {
        id: "11",
        label: "Контакты",
        href: "/contacts",
      },
      {
        id: "10",
        label: "Обо мне",
        href: "/about-me",
      },
    ]);
  });

  it("returns only core items when CMS is empty", async () => {
    vi.spyOn(wordpress, "getAllPages").mockResolvedValue([]);

    await expect(getMainNavigation()).resolves.toEqual(coreNavItems);
  });
});

describe("getHeaderNavigation", () => {
  beforeEach(() => {
    vi.spyOn(wordpress, "getAllPages").mockReset();
  });

  afterEach(() => {
    vi.restoreAllMocks();
  });

  it("excludes footer-only pages such as privacy-policy", async () => {
    const about = createPage({
      id: 10,
      slug: "about-me",
      title: { rendered: "Обо мне" },
    });
    const privacy = createPage({
      id: 11,
      slug: "privacy-policy",
      title: { rendered: "Политика конфиденциальности" },
    });

    vi.spyOn(wordpress, "getAllPages").mockResolvedValue([about, privacy]);

    await expect(getHeaderNavigation()).resolves.toEqual([
      ...coreNavItems,
      {
        id: "10",
        label: "Обо мне",
        href: "/about-me",
      },
    ]);

    await expect(getMainNavigation()).resolves.toEqual([
      ...coreNavItems,
      {
        id: "10",
        label: "Обо мне",
        href: "/about-me",
      },
      {
        id: "11",
        label: "Политика конфиденциальности",
        href: "/privacy-policy",
      },
    ]);
  });
});
