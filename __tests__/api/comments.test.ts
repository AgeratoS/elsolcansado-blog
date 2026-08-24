import { describe, it, expect, vi, beforeEach } from "vitest";

import { resetRateLimitStore } from "@/lib/rate-limit";

const mockCreateComment = vi.fn();
const mockGetCommentsByPost = vi.fn();
const mockGetPostById = vi.fn();
const mockGetCommentById = vi.fn();

class MockWordPressAPIError extends Error {
  constructor(
    message: string,
    public status: number,
    public endpoint: string,
  ) {
    super(message);
    this.name = "WordPressAPIError";
  }
}

vi.mock("@/lib/wordpress", () => ({
  createComment: (...args: unknown[]) => mockCreateComment(...args),
  getCommentsByPost: (...args: unknown[]) => mockGetCommentsByPost(...args),
  getPostById: (...args: unknown[]) => mockGetPostById(...args),
  getCommentById: (...args: unknown[]) => mockGetCommentById(...args),
  WordPressAPIError: MockWordPressAPIError,
}));

vi.mock("next/cache", () => ({
  revalidateTag: vi.fn(),
}));

vi.mock("next/server", () => {
  class MockNextRequest {
    nextUrl: URL;
    private _body: unknown;
    private _headers: Map<string, string>;

    constructor(
      url: string,
      init?: {
        method?: string;
        body?: string;
        headers?: Record<string, string>;
      },
    ) {
      this.nextUrl = new URL(url);
      this._body = init?.body ? JSON.parse(init.body) : null;
      this._headers = new Map(Object.entries(init?.headers ?? {}));
    }

    async json() {
      return this._body;
    }

    get headers() {
      return {
        get: (name: string) => this._headers.get(name) ?? null,
      };
    }
  }

  class MockNextResponse {
    body: unknown;
    status: number;

    constructor(body: unknown = null, init?: { status?: number }) {
      this.body = body;
      this.status = init?.status ?? 200;
    }

    static json(body: unknown, init?: { status?: number }) {
      return new MockNextResponse(body, init);
    }

    json() {
      return Promise.resolve(this.body);
    }
  }

  return {
    NextRequest: MockNextRequest,
    NextResponse: MockNextResponse,
  };
});

import { NextRequest } from "next/server";

const validBody = {
  postId: 12,
  content: "Hello world",
  authorName: "Ivan",
  authorEmail: "ivan@example.com",
  privacyConsent: true,
};

function createPostRequest(
  body: Record<string, unknown>,
  origin = "http://localhost",
) {
  return new NextRequest("http://localhost/api/comments", {
    method: "POST",
    body: JSON.stringify(body),
    headers: { origin },
  });
}

describe("/api/comments", () => {
  beforeEach(() => {
    resetRateLimitStore();
    mockCreateComment.mockReset();
    mockGetCommentsByPost.mockReset();
    mockGetPostById.mockReset();
    mockGetCommentById.mockReset();
    mockGetPostById.mockResolvedValue({ id: 12, comment_status: "open" });
    mockCreateComment.mockResolvedValue({
      id: 1,
      status: "hold",
      content: { rendered: "<p>Hello world</p>" },
    });
  });

  it("rejects invalid email on POST", async () => {
    const { POST } = await import("@/app/api/comments/route");
    const res = await POST(
      createPostRequest({ ...validBody, authorEmail: "not-an-email" }),
    );

    expect(res.status).toBe(400);
    expect(mockCreateComment).not.toHaveBeenCalled();
  });

  it("returns 204 for honeypot submissions", async () => {
    const { POST } = await import("@/app/api/comments/route");
    const res = await POST(
      createPostRequest({ ...validBody, website: "https://spam.test" }),
    );

    expect(res.status).toBe(204);
    expect(mockCreateComment).not.toHaveBeenCalled();
  });

  it("rejects comments when the post is closed", async () => {
    mockGetPostById.mockResolvedValue({ id: 12, comment_status: "closed" });
    const { POST } = await import("@/app/api/comments/route");
    const res = await POST(createPostRequest(validBody));

    expect(res.status).toBe(403);
    expect(mockCreateComment).not.toHaveBeenCalled();
  });

  it("rejects parent comments from another post", async () => {
    mockGetCommentById.mockResolvedValue({ id: 9, post: 99 });
    const { POST } = await import("@/app/api/comments/route");
    const res = await POST(createPostRequest({ ...validBody, parent: 9 }));

    expect(res.status).toBe(400);
    expect(mockCreateComment).not.toHaveBeenCalled();
  });

  it("rejects requests from a foreign origin", async () => {
    const { POST } = await import("@/app/api/comments/route");
    const res = await POST(createPostRequest(validBody, "https://evil.test"));

    expect(res.status).toBe(403);
    expect(mockCreateComment).not.toHaveBeenCalled();
  });

  it("does not leak WordPress error messages", async () => {
    mockCreateComment.mockRejectedValue(
      new MockWordPressAPIError("SQL failure at comments table", 500, "/comments"),
    );
    const { POST } = await import("@/app/api/comments/route");
    const res = await POST(createPostRequest(validBody));
    const body = await res.json();

    expect(res.status).toBe(500);
    expect(body.message).toBe("Не удалось отправить комментарий");
    expect(body.message).not.toContain("SQL");
  });

  it("rejects out-of-range GET pages", async () => {
    const { GET } = await import("@/app/api/comments/route");
    const res = await GET(
      new NextRequest("http://localhost/api/comments?postId=12&page=101"),
    );

    expect(res.status).toBe(400);
    expect(mockGetCommentsByPost).not.toHaveBeenCalled();
  });

  it("creates a comment for a valid same-origin request", async () => {
    const { POST } = await import("@/app/api/comments/route");
    const res = await POST(createPostRequest(validBody));
    const body = await res.json();

    expect(res.status).toBe(200);
    expect(mockCreateComment).toHaveBeenCalled();
    expect(body.comment.status).toBe("hold");
  });
});
