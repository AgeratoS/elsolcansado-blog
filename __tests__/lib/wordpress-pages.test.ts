import { describe, it, expect, vi, beforeEach, afterEach } from "vitest";
import {
  buildPagePath,
  getPageByPath,
  getAllPagePaths,
  isReservedNextJsPath,
} from "@/lib/wordpress-pages";
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

describe("wordpress-pages", () => {
  describe("buildPagePath", () => {
    it("returns slug for top-level page", () => {
      const page = createPage({ id: 1, slug: "about-me" });
      const pagesById = new Map([[page.id, page]]);

      expect(buildPagePath(page, pagesById)).toBe("about-me");
    });

    it("builds nested path from parent chain", () => {
      const parent = createPage({ id: 1, slug: "company" });
      const child = createPage({ id: 2, slug: "team", parent: 1 });
      const pagesById = new Map([
        [parent.id, parent],
        [child.id, child],
      ]);

      expect(buildPagePath(child, pagesById)).toBe("company/team");
    });
  });

  describe("isReservedNextJsPath", () => {
    it("marks Next.js routes as reserved", () => {
      expect(isReservedNextJsPath("posts")).toBe(true);
      expect(isReservedNextJsPath("posts/hello")).toBe(true);
      expect(isReservedNextJsPath("pages/about")).toBe(true);
      expect(isReservedNextJsPath("api/comments")).toBe(true);
    });

    it("allows CMS paths at root", () => {
      expect(isReservedNextJsPath("about-me")).toBe(false);
      expect(isReservedNextJsPath("company/team")).toBe(false);
    });
  });

  describe("getPageByPath", () => {
    beforeEach(() => {
      vi.spyOn(wordpress, "getAllPages").mockReset();
    });

    afterEach(() => {
      vi.restoreAllMocks();
    });

    it("resolves page by full path", async () => {
      const about = createPage({ id: 1, slug: "about-me" });
      const parent = createPage({ id: 2, slug: "company" });
      const child = createPage({ id: 3, slug: "team", parent: 2 });

      vi.spyOn(wordpress, "getAllPages").mockResolvedValue([about, parent, child]);

      await expect(getPageByPath("about-me")).resolves.toEqual(about);
      await expect(getPageByPath("company/team")).resolves.toEqual(child);
      await expect(getPageByPath("posts")).resolves.toBeUndefined();
      await expect(getPageByPath("missing")).resolves.toBeUndefined();
    });
  });

  describe("getAllPagePaths", () => {
    beforeEach(() => {
      vi.spyOn(wordpress, "getAllPages").mockReset();
    });

    afterEach(() => {
      vi.restoreAllMocks();
    });

    it("returns slug arrays excluding reserved paths", async () => {
      const about = createPage({ id: 1, slug: "about-me" });
      const reserved = createPage({ id: 2, slug: "posts" });

      vi.spyOn(wordpress, "getAllPages").mockResolvedValue([about, reserved]);

      const paths = await getAllPagePaths();

      expect(paths).toEqual([{ slug: ["about-me"] }]);
    });
  });
});
