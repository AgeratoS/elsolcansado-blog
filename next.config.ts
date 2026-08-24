import type { NextConfig } from "next";

function stripQuotes(value: string | undefined): string | undefined {
  return value?.replace(/^["']|["']$/g, "");
}

const wordpressUrl = stripQuotes(process.env.WORDPRESS_URL);
const wordpressHostname = stripQuotes(process.env.WORDPRESS_HOSTNAME);

function getWordPressOrigin(): URL | null {
  if (!wordpressUrl) {
    return null;
  }

  try {
    return new URL(wordpressUrl);
  } catch {
    return null;
  }
}

const wordpressOrigin = getWordPressOrigin();
const isLocalWordPress =
  wordpressOrigin?.hostname === "localhost" ||
  wordpressOrigin?.hostname === "127.0.0.1" ||
  wordpressHostname === "localhost" ||
  wordpressHostname === "127.0.0.1";

const imageRemotePatterns: NonNullable<NextConfig["images"]>["remotePatterns"] = [
  {
    protocol: "https",
    hostname: "images.unsplash.com",
    port: "",
    pathname: "/**",
  },
];

if (wordpressOrigin) {
  imageRemotePatterns.push({
    protocol: wordpressOrigin.protocol.replace(":", "") as "http" | "https",
    hostname: wordpressOrigin.hostname,
    port: wordpressOrigin.port,
    pathname: "/**",
  });
} else if (wordpressHostname) {
  imageRemotePatterns.push({
    protocol: "https",
    hostname: wordpressHostname,
    port: "",
    pathname: "/**",
  });
}

const securityHeaders = [
  { key: "X-Content-Type-Options", value: "nosniff" },
  { key: "Referrer-Policy", value: "strict-origin-when-cross-origin" },
  { key: "X-Frame-Options", value: "SAMEORIGIN" },
  {
    key: "Permissions-Policy",
    value: "camera=(), microphone=(), geolocation=()",
  },
  {
    key: "Content-Security-Policy",
    value: [
      "default-src 'self'",
      "script-src 'self' 'unsafe-inline' https://va.vercel-scripts.com",
      "style-src 'self' 'unsafe-inline'",
      "img-src 'self' data: blob: https: http://localhost:* http://127.0.0.1:*",
      "font-src 'self' data:",
      "connect-src 'self' https://vitals.vercel-insights.com https://va.vercel-scripts.com",
      "frame-src https://www.youtube.com https://www.youtube-nocookie.com https://player.vimeo.com https://videopress.com https://video.wordpress.com",
      "frame-ancestors 'self'",
      "base-uri 'self'",
      "form-action 'self'",
      "object-src 'none'",
    ].join("; "),
  },
];

const nextConfig: NextConfig = {
  output: "standalone",
  images: {
    remotePatterns: imageRemotePatterns,
    ...(isLocalWordPress ? { dangerouslyAllowLocalIP: true } : {}),
  },
  async headers() {
    return [
      {
        source: "/:path*",
        headers: securityHeaders,
      },
    ];
  },
  async redirects() {
    if (!wordpressUrl) {
      return [];
    }
    return [
      {
        source: "/admin",
        destination: `${wordpressUrl}/wp-admin`,
        permanent: true,
      },
    ];
  },
};

export default nextConfig;
