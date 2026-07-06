import {
  createComment,
  getCommentsByPost,
  WordPressAPIError,
} from "@/lib/wordpress";
import { revalidateTag } from "next/cache";
import { NextRequest, NextResponse } from "next/server";

export async function GET(request: NextRequest) {
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

  const { data: comments, headers } = await getCommentsByPost(postId, page, 10);

  return NextResponse.json({
    comments,
    total: headers.total,
    totalPages: headers.totalPages,
  });
}

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const postId = Number(body.postId);
    const content = String(body.content ?? "").trim();
    const authorName = String(body.authorName ?? "").trim();
    const authorEmail = String(body.authorEmail ?? "").trim();
    const parent = body.parent ? Number(body.parent) : undefined;
    const privacyConsent = body.privacyConsent === true;

    if (!Number.isFinite(postId) || postId <= 0) {
      return NextResponse.json(
        { message: "Некорректный идентификатор записи" },
        { status: 400 },
      );
    }

    if (!content || !authorName || !authorEmail) {
      return NextResponse.json(
        { message: "Заполните все обязательные поля" },
        { status: 400 },
      );
    }

    if (!privacyConsent) {
      return NextResponse.json(
        { message: "Необходимо согласие с политикой обработки персональных данных" },
        { status: 400 },
      );
    }

    const comment = await createComment({
      postId,
      content,
      authorName,
      authorEmail,
      parent,
    });

    revalidateTag(`comments-post-${postId}`, { expire: 0 });
    revalidateTag("comments", { expire: 0 });

    return NextResponse.json({ comment });
  } catch (error) {
    if (error instanceof WordPressAPIError) {
      return NextResponse.json(
        { message: error.message },
        { status: error.status },
      );
    }

    return NextResponse.json(
      { message: "Не удалось отправить комментарий" },
      { status: 500 },
    );
  }
}
