import { describe, expect, it } from "vitest";

import {
  isAllowedAvatarUrl,
  prepareWpContentHtml,
  sanitizeCommentHtml,
  sanitizeWpContent,
} from "@/lib/sanitize-html";

describe("sanitizeWpContent", () => {
  it("strips scripts and event handlers", () => {
    const html =
      '<p>Hello<script>alert(1)</script><img src="https://example.com/a.png" onerror="alert(1)"></p>';
    const result = sanitizeWpContent(html);

    expect(result).toContain("<p>Hello");
    expect(result).not.toContain("script");
    expect(result).not.toContain("onerror");
    expect(result).toContain("https://example.com/a.png");
  });

  it("blocks javascript URLs", () => {
    const result = sanitizeWpContent(
      '<a href="javascript:alert(1)">Click</a>',
    );

    expect(result).not.toContain("javascript:");
  });

  it("keeps Gutenberg code blocks and youtube iframes", () => {
    const html = [
      '<pre class="wp-block-code"><code class="language-typescript">const x = 1;</code></pre>',
      '<iframe src="https://www.youtube.com/embed/abc123" width="560" height="315"></iframe>',
    ].join("");
    const result = sanitizeWpContent(html);

    expect(result).toContain("wp-block-code");
    expect(result).toContain("language-typescript");
    expect(result).toContain("www.youtube.com/embed/abc123");
  });

  it("drops iframes from unknown hosts", () => {
    const result = sanitizeWpContent(
      '<iframe src="https://evil.example/embed"></iframe>',
    );

    expect(result).not.toContain("evil.example");
  });
});

describe("sanitizeCommentHtml", () => {
  it("allows basic formatting and strips images", () => {
    const result = sanitizeCommentHtml(
      '<p>Hi <strong>there</strong></p><img src="https://evil.test/x.png"><script>alert(1)</script>',
    );

    expect(result).toContain("<strong>there</strong>");
    expect(result).not.toContain("img");
    expect(result).not.toContain("script");
  });
});

describe("prepareWpContentHtml", () => {
  it("highlights code then sanitizes remaining markup", () => {
    const html =
      '<p onclick="alert(1)">Intro</p><pre class="wp-block-code"><code class="language-javascript">const ok = true;</code></pre>';
    const result = prepareWpContentHtml(html);

    expect(result).not.toContain("onclick");
    expect(result).toContain("prism-code-block");
    expect(result).toContain("token");
  });
});

describe("isAllowedAvatarUrl", () => {
  it("allows gravatar https URLs", () => {
    expect(
      isAllowedAvatarUrl("https://secure.gravatar.com/avatar/abc"),
    ).toBe(true);
  });

  it("rejects javascript URLs", () => {
    expect(isAllowedAvatarUrl("javascript:alert(1)")).toBe(false);
  });

  it("rejects unknown https hosts", () => {
    expect(isAllowedAvatarUrl("https://tracker.example/pixel.gif")).toBe(
      false,
    );
  });
});
