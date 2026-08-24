import { describe, expect, it } from "vitest";

import { mockPostDetail } from "@/frontend/widgets/post-detail/model/mock";
import {
  hasCodeBlocks,
  highlightCodeInHtml,
} from "@/lib/highlight-code";

describe("hasCodeBlocks", () => {
  it("returns true when HTML contains a pre/code block", () => {
    const html =
      '<p>Intro</p><pre class="wp-block-code"><code class="language-typescript">const x = 1;</code></pre>';

    expect(hasCodeBlocks(html)).toBe(true);
  });

  it("returns false when HTML has no code blocks", () => {
    expect(hasCodeBlocks("<p>Just a paragraph</p>")).toBe(false);
  });
});

describe("highlightCodeInHtml", () => {
  it("highlights TypeScript code blocks from language class", () => {
    const html =
      '<pre class="wp-block-code"><code class="language-typescript">const value: string = &quot;hello&quot;;</code></pre>';
    const result = highlightCodeInHtml(html);

    expect(result).toContain('class="language-typescript');
    expect(result).toContain("prism-code-block");
    expect(result).toContain('<span class="token keyword">const</span>');
    expect(result).toContain('<span class="token string">"hello"</span>');
  });

  it("extracts language from lang attribute and maps aliases", () => {
    const html =
      '<pre><code lang="ts">const total = 42;</code></pre>';
    const result = highlightCodeInHtml(html);

    expect(result).toContain('language-typescript');
    expect(result).toContain('<span class="token keyword">const</span>');
    expect(result).toContain('<span class="token number">42</span>');
  });

  it("decodes HTML entities before highlighting", () => {
    const html =
      '<pre><code class="language-javascript">const less = 1 &lt; 2;</code></pre>';
    const result = highlightCodeInHtml(html);

    expect(result).toContain('<span class="token operator">&lt;</span>');
    expect(result).not.toContain("&lt; 2");
  });

  it("keeps unknown languages but adds styling classes", () => {
    const html =
      '<pre><code class="language-rust">fn main() {}</code></pre>';
    const result = highlightCodeInHtml(html);

    expect(result).toContain("prism-code-block");
    expect(result).toContain("language-rust");
    expect(result).toContain("fn main() {}");
    expect(result).not.toContain('<span class="token');
  });

  it("leaves non-code HTML unchanged", () => {
    const html = "<p>Paragraph with <code>inline</code> code</p>";
    const result = highlightCodeInHtml(html);

    expect(result).toBe(html);
  });

  it("highlights multiple code blocks in one document", () => {
    const html = [
      '<pre><code class="language-json">{&quot;ok&quot;: true}</code></pre>',
      '<pre><code class="language-bash">echo &quot;hi&quot;</code></pre>',
    ].join("");
    const result = highlightCodeInHtml(html);

    expect(result.match(/prism-code-block/g)?.length).toBe(2);
    expect(result).toContain('language-json');
    expect(result).toContain('language-bash');
  });

  it("highlights mock post detail content used in Storybook", () => {
    const html = mockPostDetail.content.rendered;

    expect(hasCodeBlocks(html)).toBe(true);

    const result = highlightCodeInHtml(html);

    expect(result).toContain("not-prose");
    expect(result).toContain("prism-code-block");
    expect(result).toContain('<span class="token keyword">type</span>');
    expect(result).toContain('<span class="token keyword">export</span>');
  });

  it("does not copy event handler attributes onto pre/code", () => {
    const html =
      '<pre onfocus="alert(1)" tabindex="0"><code class="language-javascript" onclick="alert(1)">const x = 1;</code></pre>';
    const result = highlightCodeInHtml(html);

    expect(result).not.toContain("onfocus");
    expect(result).not.toContain("onclick");
    expect(result).not.toContain("tabindex");
    expect(result).toContain("prism-code-block");
    expect(result).toContain("language-javascript");
  });
});
