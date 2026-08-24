import sanitizeHtml from "sanitize-html";

import { hasCodeBlocks, highlightCodeInHtml } from "@/lib/highlight-code";

const WP_CONTENT_TAGS = [
  "p",
  "br",
  "h1",
  "h2",
  "h3",
  "h4",
  "h5",
  "h6",
  "ul",
  "ol",
  "li",
  "a",
  "img",
  "figure",
  "figcaption",
  "blockquote",
  "pre",
  "code",
  "span",
  "div",
  "table",
  "thead",
  "tbody",
  "tfoot",
  "tr",
  "th",
  "td",
  "strong",
  "em",
  "b",
  "i",
  "u",
  "s",
  "sup",
  "sub",
  "hr",
  "iframe",
  "video",
  "audio",
  "source",
  "dl",
  "dt",
  "dd",
  "cite",
  "abbr",
  "mark",
  "small",
  "section",
  "article",
];

const COMMENT_TAGS = [
  "a",
  "p",
  "br",
  "code",
  "blockquote",
  "em",
  "strong",
  "i",
  "b",
  "pre",
  "ul",
  "ol",
  "li",
];

const IFRAME_HOSTNAMES = [
  "www.youtube.com",
  "youtube.com",
  "www.youtube-nocookie.com",
  "youtube-nocookie.com",
  "player.vimeo.com",
  "videopress.com",
  "video.wordpress.com",
];

const IFRAME_DOMAINS = ["youtube.com", "vimeo.com", "wordpress.com", "wordpress.tv"];

const GRAVATAR_HOSTS = new Set([
  "secure.gravatar.com",
  "www.gravatar.com",
  "gravatar.com",
  "0.gravatar.com",
  "1.gravatar.com",
  "2.gravatar.com",
  "i0.wp.com",
  "i1.wp.com",
  "i2.wp.com",
]);

function stripQuotes(value: string | undefined): string | undefined {
  return value?.replace(/^["']|["']$/g, "");
}

function transformLinks(tagName: string, attribs: Record<string, string>) {
  if (attribs.target === "_blank") {
    attribs.rel = "noopener noreferrer";
  }

  return { tagName, attribs };
}

export function sanitizeWpContent(html: string): string {
  return sanitizeHtml(html, {
    allowedTags: WP_CONTENT_TAGS,
    allowedAttributes: {
      a: ["href", "name", "target", "rel", "class", "id"],
      img: ["src", "srcset", "sizes", "alt", "title", "width", "height", "class", "loading"],
      iframe: [
        "src",
        "width",
        "height",
        "allow",
        "allowfullscreen",
        "frameborder",
        "title",
        "class",
        "loading",
      ],
      video: ["src", "controls", "width", "height", "poster", "class"],
      audio: ["src", "controls", "class"],
      source: ["src", "type"],
      td: ["colspan", "rowspan", "class"],
      th: ["colspan", "rowspan", "class"],
      "*": ["class", "id"],
    },
    allowedSchemes: ["http", "https", "mailto"],
    allowedSchemesByTag: {
      img: ["http", "https"],
      iframe: ["https"],
      source: ["http", "https"],
    },
    allowedIframeHostnames: IFRAME_HOSTNAMES,
    allowedIframeDomains: IFRAME_DOMAINS,
    allowIframeRelativeUrls: false,
    transformTags: {
      a: transformLinks,
    },
  });
}

export function sanitizeCommentHtml(html: string): string {
  return sanitizeHtml(html, {
    allowedTags: COMMENT_TAGS,
    allowedAttributes: {
      a: ["href", "rel"],
      "*": ["class"],
    },
    allowedSchemes: ["http", "https", "mailto"],
    transformTags: {
      a: transformLinks,
    },
  });
}

export function prepareWpContentHtml(html: string): string {
  const highlighted = hasCodeBlocks(html) ? highlightCodeInHtml(html) : html;
  return sanitizeWpContent(highlighted);
}

export function isAllowedAvatarUrl(url: string | null | undefined): boolean {
  if (!url) {
    return false;
  }

  try {
    const parsed = new URL(url);
    const host = parsed.hostname.toLowerCase();
    const wordpressHostname = stripQuotes(process.env.WORDPRESS_HOSTNAME)?.toLowerCase();
    const isLocalHost = host === "localhost" || host === "127.0.0.1";

    if (parsed.protocol !== "https:") {
      if (parsed.protocol === "http:" && isLocalHost) {
        return wordpressHostname ? host === wordpressHostname : true;
      }
      return false;
    }

    if (GRAVATAR_HOSTS.has(host)) {
      return true;
    }

    if (host === "wordpress.com" || host.endsWith(".wordpress.com")) {
      return true;
    }

    if (wordpressHostname && host === wordpressHostname) {
      return true;
    }

    return false;
  } catch {
    return false;
  }
}

export function sanitizeAvatarUrl(url: string | null | undefined): string | null {
  return isAllowedAvatarUrl(url) ? url! : null;
}
