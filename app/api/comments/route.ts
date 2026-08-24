import {
  createComment,
  getCommentById,
  getCommentsByPost,
  getPostById,
  WordPressAPIError,
} from "@/lib/wordpress";
import { rateLimit } from "@/lib/rate-limit";
import {
  getClientIp,
  isAllowedRequestOrigin,
} from "@/lib/request-guards";
import { revalidateTag } from "next/cache";
import { NextRequest, NextResponse } from "next/server";
import { z } from "zod";

const COMMENT_POST_LIMIT = 5;
const COMMENT_GET_LIMIT = 30;
const RATE_WINDOW_MS = 60_000;

const createCommentSchema = z.object({
  postId: z.number().int().positive(),
  content: z.string().trim().min(1).max(5000),
  authorName: z.string().trim().min(1).max(100),
  authorEmail: z.string().trim().email().max(100),
  parent: z.number().int().positive().optional(),
  privacyConsent: z.literal(true),
  website: z.string().optional(),
});

function rateLimitResponse() {
  return NextResponse.json(
    { message: "Слишком много запросов. Попробуйте позже." },
    { status: 429 },
  );
}

function mapCommentError(error: WordPressAPIError) {
  if (error.status === 409) {
    return "Похожий комментарий уже существует";
  }

  if (error.status === 403) {
    return "Комментарии к этой записи закрыты";
  }

  return "Не удалось отправить комментарий";
}

export async function GET(request: NextRequest) {
  const ip = getClientIp(request);
  if (!rateLimit(`comments:get:${ip}`, COMMENT_GET_LIMIT, RATE_WINDOW_MS)) {
    return rateLimitResponse();
  }

  const postId = Number.parseInt(
    request.nextUrl.searchParams.get("postId") ?? "",
    10,
  );
  const page = Number.parseInt(
    request.nextUrl.searchParams.get("page") ?? "1",
    10,
  );

  if (!Number.isFinite(postId) || postId <= 0) {
    return NextResponse.json(
      { message: "Некорректный идентификатор записи" },
      { status: 400 },
    );
  }

  if (!Number.isFinite(page) || page < 1 || page > 100) {
    return NextResponse.json(
      { message: "Некорректный номер страницы" },
      { status: 400 },
    );
  }

  const { data: comments, headers } = await getCommentsByPost(postId, page, 10);

  return NextResponse.json({
    comments,
    total: headers.total,
    totalPages: headers.totalPages,
  });
}

export async function POST(request: NextRequest) {
  const ip = getClientIp(request);
  if (!rateLimit(`comments:post:${ip}`, COMMENT_POST_LIMIT, RATE_WINDOW_MS)) {
    return rateLimitResponse();
  }

  if (!isAllowedRequestOrigin(request)) {
    return NextResponse.json({ message: "Недопустимый источник запроса" }, { status: 403 });
  }

  try {
    let body: Record<string, unknown>;
    try {
      body = await request.json();
    } catch {
      return NextResponse.json(
        { message: "Заполните все обязательные поля" },
        { status: 400 },
      );
    }

    const parsed = createCommentSchema.safeParse({
      ...body,
      postId: Number(body.postId),
      parent: body.parent ? Number(body.parent) : undefined,
      privacyConsent: body.privacyConsent === true,
    });

    if (!parsed.success) {
      return NextResponse.json(
        { message: "Заполните все обязательные поля" },
        { status: 400 },
      );
    }

    if (parsed.data.website?.trim()) {
      return new NextResponse(null, { status: 204 });
    }

    let post;
    try {
      post = await getPostById(parsed.data.postId);
    } catch (error) {
      if (error instanceof WordPressAPIError) {
        return NextResponse.json(
          { message: "Некорректный идентификатор записи" },
          { status: 400 },
        );
      }
      throw error;
    }

    if (post.comment_status !== "open") {
      return NextResponse.json(
        { message: "Комментарии к этой записи закрыты" },
        { status: 403 },
      );
    }

    if (parsed.data.parent) {
      try {
        const parentComment = await getCommentById(parsed.data.parent);
        if (parentComment.post !== parsed.data.postId) {
          return NextResponse.json(
            { message: "Некорректный родительский комментарий" },
            { status: 400 },
          );
        }
      } catch (error) {
        if (error instanceof WordPressAPIError) {
          return NextResponse.json(
            { message: "Некорректный родительский комментарий" },
            { status: 400 },
          );
        }
        throw error;
      }
    }

    const comment = await createComment({
      postId: parsed.data.postId,
      content: parsed.data.content,
      authorName: parsed.data.authorName,
      authorEmail: parsed.data.authorEmail,
      parent: parsed.data.parent,
    });

    revalidateTag(`comments-post-${parsed.data.postId}`, { expire: 0 });
    revalidateTag("comments", { expire: 0 });

    return NextResponse.json({ comment });
  } catch (error) {
    if (error instanceof WordPressAPIError) {
      return NextResponse.json(
        { message: mapCommentError(error) },
        { status: error.status === 409 || error.status === 403 ? error.status : 500 },
      );
    }

    return NextResponse.json(
      { message: "Не удалось отправить комментарий" },
      { status: 500 },
    );
  }
}
