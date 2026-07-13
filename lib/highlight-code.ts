import Prism from "prismjs";

import "prismjs/components/prism-clike";
import "prismjs/components/prism-bash";
import "prismjs/components/prism-css";
import "prismjs/components/prism-javascript";
import "prismjs/components/prism-json";
import "prismjs/components/prism-jsx";
import "prismjs/components/prism-markup";
import "prismjs/components/prism-python";
import "prismjs/components/prism-tsx";
import "prismjs/components/prism-typescript";

const CODE_BLOCK_REGEX =
  /<pre\b([^>]*)>\s*<code\b([^>]*)>([\s\S]*?)<\/code>\s*<\/pre>/gi;

const SUPPORTED_LANGUAGES = new Set([
  "bash",
  "css",
  "javascript",
  "json",
  "jsx",
  "markup",
  "python",
  "tsx",
  "typescript",
]);

const LANGUAGE_ALIASES: Record<string, string> = {
  bash: "bash",
  sh: "bash",
  shell: "bash",
  zsh: "bash",
  css: "css",
  html: "markup",
  js: "javascript",
  javascript: "javascript",
  json: "json",
  jsx: "jsx",
  markup: "markup",
  md: "markup",
  py: "python",
  python: "python",
  svg: "markup",
  ts: "typescript",
  tsx: "tsx",
  typescript: "typescript",
  xml: "markup",
};

function decodeHtmlEntities(text: string): string {
  return text
    .replace(/&lt;/g, "<")
    .replace(/&gt;/g, ">")
    .replace(/&amp;/g, "&")
    .replace(/&quot;/g, '"')
    .replace(/&#0*39;/g, "'")
    .replace(/&#x0*27;/gi, "'")
    .replace(/&#(\d+);/g, (_, code) => String.fromCharCode(Number(code)))
    .replace(/&#x([0-9a-fA-F]+);/g, (_, hex) =>
      String.fromCharCode(parseInt(hex, 16)),
    );
}

function extractLanguage(codeAttributes: string): string | null {
  const classMatch = codeAttributes.match(
    /\bclass=(["'])([^"']*)\1/i,
  );
  if (classMatch) {
    const languageClass = classMatch[2]
      .split(/\s+/)
      .find((token) => token.startsWith("language-"));

    if (languageClass) {
      return languageClass.slice("language-".length).toLowerCase();
    }
  }

  const langMatch = codeAttributes.match(/\blang=(["'])([^"']+)\1/i);
  if (langMatch) {
    return langMatch[2].toLowerCase();
  }

  return null;
}

function resolveLanguage(rawLanguage: string | null): string | null {
  if (!rawLanguage) {
    return null;
  }

  const normalized = rawLanguage.trim().toLowerCase();
  const resolved = LANGUAGE_ALIASES[normalized] ?? normalized;

  return SUPPORTED_LANGUAGES.has(resolved) ? resolved : null;
}

function ensureClassAttribute(
  attributes: string,
  className: string,
): string {
  if (/\bclass=(["'])/i.test(attributes)) {
    return attributes.replace(
      /\bclass=(["'])([^"']*)\1/i,
      (_, quote, existingClasses) => {
        const classes = existingClasses.split(/\s+/).filter(Boolean);
        if (classes.includes(className)) {
          return `class=${quote}${existingClasses}${quote}`;
        }

        return `class=${quote}${existingClasses} ${className}${quote}`;
      },
    );
  }

  const trimmedAttributes = attributes.trim();
  return trimmedAttributes
    ? `${trimmedAttributes} class="${className}"`
    : ` class="${className}"`;
}

function highlightCodeBlock(
  preAttributes: string,
  codeAttributes: string,
  codeContent: string,
): string {
  const rawLanguage = extractLanguage(codeAttributes);
  const language = resolveLanguage(rawLanguage);
  const decodedCode = decodeHtmlEntities(codeContent);

  if (!language) {
    const styledPreAttributes = ensureClassAttribute(
      preAttributes,
      "not-prose prism-code-block",
    );
    const styledCodeAttributes = ensureClassAttribute(
      codeAttributes,
      rawLanguage ? `language-${rawLanguage}` : "language-plain",
    );

    return `<pre${styledPreAttributes}><code${styledCodeAttributes}>${codeContent}</code></pre>`;
  }

  const grammar = Prism.languages[language];
  const highlighted = Prism.highlight(decodedCode, grammar, language);
  const highlightedPreAttributes = ensureClassAttribute(
    preAttributes,
    `not-prose language-${language} prism-code-block`,
  );
  const highlightedCodeAttributes = ensureClassAttribute(
    codeAttributes,
    `language-${language}`,
  );

  return `<pre${highlightedPreAttributes}><code${highlightedCodeAttributes}>${highlighted}</code></pre>`;
}

export function hasCodeBlocks(html: string): boolean {
  return /<pre\b[^>]*>\s*<code\b/i.test(html);
}

export function highlightCodeInHtml(html: string): string {
  return html.replace(
    CODE_BLOCK_REGEX,
    (match, preAttributes, codeAttributes, codeContent) => {
      try {
        return highlightCodeBlock(
          preAttributes ?? "",
          codeAttributes ?? "",
          codeContent ?? "",
        );
      } catch (error) {
        if (process.env.NODE_ENV !== "production") {
          console.error("Failed to highlight code block:", error);
        }
        return match;
      }
    },
  );
}
