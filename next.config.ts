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

const nextConfig: NextConfig = {
  output: "standalone",
  images: {
    remotePatterns: imageRemotePatterns,
    ...(isLocalWordPress ? { dangerouslyAllowLocalIP: true } : {}),
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
