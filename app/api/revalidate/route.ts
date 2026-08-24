import { timingSafeEqual } from "crypto";
import { revalidatePath, revalidateTag } from "next/cache";
import { NextRequest, NextResponse } from "next/server";

export const maxDuration = 30;

const PLACEHOLDER_SECRETS = new Set([
  "your-secret-key-here",
  "secret-key",
  "changeme",
]);
const MIN_SECRET_LENGTH = 16;

function isWebhookConfigured(secret: string | undefined): secret is string {
  if (!secret || secret.length < MIN_SECRET_LENGTH) {
    return false;
  }

  return !PLACEHOLDER_SECRETS.has(secret);
}

function secretsEqual(provided: string, expected: string): boolean {
  const providedBuffer = Buffer.from(provided);
  const expectedBuffer = Buffer.from(expected);

  if (providedBuffer.length !== expectedBuffer.length) {
    timingSafeEqual(expectedBuffer, expectedBuffer);
    return false;
  }

  return timingSafeEqual(providedBuffer, expectedBuffer);
}

/**
 * WordPress webhook handler for content revalidation
 * Receives notifications from WordPress when content changes
 * and revalidates the entire site
 */

export async function POST(request: NextRequest) {
  try {
    const expected = process.env.WORDPRESS_WEBHOOK_SECRET;
    if (!isWebhookConfigured(expected)) {
      return NextResponse.json(
        { message: "Revalidate is not configured" },
        { status: 503 },
      );
    }

    const secret = request.headers.get("x-webhook-secret") ?? "";
    if (!secretsEqual(secret, expected)) {
      return NextResponse.json({ message: "Unauthorized" }, { status: 401 });
    }

    const requestBody = await request.json();
    const { contentType, contentId } = requestBody;

    if (!contentType) {
      return NextResponse.json(
        { message: "Missing content type" },
        { status: 400 },
      );
    }

    try {
      console.log(
        `Revalidating content: ${contentType}${
          contentId ? ` (ID: ${contentId})` : ""
        }`,
      );

      // Revalidate specific content type tags
      revalidateTag("wordpress", { expire: 0 });

      if (contentType === "post") {
        revalidateTag("posts", { expire: 0 });
        if (contentId) {
          revalidateTag(`post-${contentId}`, { expire: 0 });
        }
        // Clear all post pages when any post changes
        revalidateTag("posts-page-1", { expire: 0 });
      } else if (contentType === "category") {
        revalidateTag("categories", { expire: 0 });
        if (contentId) {
          revalidateTag(`posts-category-${contentId}`, { expire: 0 });
          revalidateTag(`category-${contentId}`, { expire: 0 });
        }
      } else if (contentType === "tag") {
        revalidateTag("tags", { expire: 0 });
        if (contentId) {
          revalidateTag(`posts-tag-${contentId}`, { expire: 0 });
          revalidateTag(`tag-${contentId}`, { expire: 0 });
        }
      } else if (contentType === "author" || contentType === "user") {
        revalidateTag("authors", { expire: 0 });
        if (contentId) {
          revalidateTag(`posts-author-${contentId}`, { expire: 0 });
          revalidateTag(`author-${contentId}`, { expire: 0 });
        }
      }

      // Also revalidate the entire layout for safety
      revalidatePath("/", "layout");

      return NextResponse.json({
        revalidated: true,
        message: `Revalidated ${contentType}${
          contentId ? ` (ID: ${contentId})` : ""
        } and related content`,
        timestamp: new Date().toISOString(),
      });
    } catch {
      console.error("Error revalidating path");
      return NextResponse.json(
        {
          revalidated: false,
          message: "Failed to revalidate site",
          timestamp: new Date().toISOString(),
        },
        { status: 500 },
      );
    }
  } catch {
    console.error("Revalidation error");
    return NextResponse.json(
      {
        message: "Error revalidating content",
        timestamp: new Date().toISOString(),
      },
      { status: 500 },
    );
  }
}
