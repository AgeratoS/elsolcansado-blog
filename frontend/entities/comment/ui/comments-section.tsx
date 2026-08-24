"use client";

import { CommentItem } from "@/frontend/entities/comment/ui/comment-item";
import { Button } from "@/frontend/shared/ui/button";
import { Input } from "@/frontend/shared/ui/input";
import { Textarea } from "@/frontend/shared/ui/textarea";
import type { Comment } from "@/lib/wordpress.d";
import { cn } from "@/lib/utils";
import { ChevronDown, Loader2 } from "lucide-react";
import { useRouter } from "next/navigation";
import { useMemo, useState } from "react";

type CommentsSectionProps = {
  postId: number;
  initialComments: Comment[];
  totalComments: number;
  commentsOpen: boolean;
};

type CommentFormState = {
  authorName: string;
  authorEmail: string;
  content: string;
};

function isValidEmail(email: string) {
  return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email.trim());
}

function isCommentFormValid(form: CommentFormState, privacyConsent: boolean) {
  return (
    form.content.trim().length > 0 &&
    form.authorName.trim().length > 0 &&
    isValidEmail(form.authorEmail) &&
    privacyConsent
  );
}

function buildCommentTree(comments: Comment[]) {
  const roots = comments.filter((comment) => comment.parent === 0);
  const repliesByParent = new Map<number, Comment[]>();

  for (const comment of comments) {
    if (comment.parent === 0) {
      continue;
    }

    const replies = repliesByParent.get(comment.parent) ?? [];
    replies.push(comment);
    repliesByParent.set(comment.parent, replies);
  }

  return roots.map((comment) => ({
    comment,
    replies: repliesByParent.get(comment.id) ?? [],
  }));
}

export function CommentsSection({
  postId,
  initialComments,
  totalComments,
  commentsOpen,
}: CommentsSectionProps) {
  const router = useRouter();
  const [comments, setComments] = useState(initialComments);
  const [total, setTotal] = useState(totalComments);
  const [page, setPage] = useState(1);
  const [isLoadingMore, setIsLoadingMore] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [replyToId, setReplyToId] = useState<number | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState<string | null>(null);
  const [honeypot, setHoneypot] = useState("");
  const [form, setForm] = useState<CommentFormState>({
    authorName: "",
    authorEmail: "",
    content: "",
  });
  const [privacyConsent, setPrivacyConsent] = useState(false);

  const commentTree = useMemo(() => buildCommentTree(comments), [comments]);
  const isFormValid = isCommentFormValid(form, privacyConsent);
  const hasMore = comments.length < total;

  async function handleLoadMore() {
    setIsLoadingMore(true);
    setError(null);

    try {
      const nextPage = page + 1;
      const response = await fetch(
        `/api/comments?postId=${postId}&page=${nextPage}`,
      );

      if (!response.ok) {
        throw new Error("Не удалось загрузить комментарии");
      }

      const data = (await response.json()) as {
        comments: Comment[];
        total: number;
      };

      setComments((current) => {
        const existingIds = new Set(current.map((comment) => comment.id));
        const newComments = data.comments.filter(
          (comment) => !existingIds.has(comment.id),
        );
        return [...current, ...newComments];
      });
      setTotal(data.total);
      setPage(nextPage);
    } catch {
      setError("Не удалось загрузить комментарии. Попробуйте ещё раз.");
    } finally {
      setIsLoadingMore(false);
    }
  }

  async function handleSubmit(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setIsSubmitting(true);
    setError(null);
    setSuccess(null);

    try {
      const response = await fetch("/api/comments", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          postId,
          content: form.content,
          authorName: form.authorName,
          authorEmail: form.authorEmail,
          parent: replyToId ?? undefined,
          privacyConsent,
          website: honeypot,
        }),
      });

      if (response.status === 204) {
        setForm({
          authorName: form.authorName,
          authorEmail: form.authorEmail,
          content: "",
        });
        setReplyToId(null);
        setHoneypot("");
        setSuccess("Комментарий отправлен на модерацию");
        return;
      }

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.message || "Не удалось отправить комментарий");
      }

      setForm({ authorName: form.authorName, authorEmail: form.authorEmail, content: "" });
      setReplyToId(null);
      setSuccess(
        data.comment.status === "approved"
          ? "Комментарий опубликован"
          : "Комментарий отправлен на модерацию",
      );
      router.refresh();
    } catch (submitError) {
      setError(
        submitError instanceof Error
          ? submitError.message
          : "Не удалось отправить комментарий",
      );
    } finally {
      setIsSubmitting(false);
    }
  }

  return (
    <section className="border-t border-border pt-10">
      <div className="mb-8 flex items-center gap-3">
        <h2 className="text-2xl font-bold text-foreground">Комментарии</h2>
        <span className="rounded-full bg-teal-700 px-2.5 py-0.5 text-sm font-medium text-white dark:bg-teal-600">
          {total}
        </span>
      </div>

      {commentsOpen ? (
        <form onSubmit={handleSubmit} className="relative mb-10 space-y-4">
          <div>
            <label
              htmlFor="comment-content"
              className="mb-2 block text-sm font-medium text-foreground"
            >
              {replyToId ? "Ответ на комментарий" : "Оставить комментарий"}
            </label>
            <Textarea
              id="comment-content"
              value={form.content}
              onChange={(event) =>
                setForm((current) => ({
                  ...current,
                  content: event.target.value,
                }))
              }
              placeholder="Напишите ваш комментарий..."
              className="min-h-32 resize-y"
              required
            />
          </div>

          <div className="grid gap-4 sm:grid-cols-2">
            <Input
              value={form.authorName}
              onChange={(event) =>
                setForm((current) => ({
                  ...current,
                  authorName: event.target.value,
                }))
              }
              placeholder="Имя"
              required
            />
            <Input
              type="email"
              value={form.authorEmail}
              onChange={(event) =>
                setForm((current) => ({
                  ...current,
                  authorEmail: event.target.value,
                }))
              }
              placeholder="Email"
              required
            />
          </div>

          <div
            className="absolute -left-[9999px] h-0 w-0 overflow-hidden"
            aria-hidden="true"
          >
            <label htmlFor="comment-website">Website</label>
            <input
              id="comment-website"
              name="website"
              type="text"
              tabIndex={-1}
              autoComplete="off"
              value={honeypot}
              onChange={(event) => setHoneypot(event.target.value)}
            />
          </div>

          {replyToId && (
            <button
              type="button"
              onClick={() => setReplyToId(null)}
              className="text-sm text-muted-foreground hover:text-foreground"
            >
              Отменить ответ
            </button>
          )}

          <label className="flex cursor-pointer items-start gap-3 text-sm text-foreground">
            <input
              type="checkbox"
              checked={privacyConsent}
              onChange={(event) => setPrivacyConsent(event.target.checked)}
              className="mt-0.5 size-4 shrink-0 rounded border-input accent-teal-700"
            />
            <span>Я согласен с политикой обработки персональных данных</span>
          </label>

          <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
            <div className="space-y-1">
              {error && <p className="text-sm text-destructive">{error}</p>}
              {success && (
                <p className="text-sm text-teal-700">{success}</p>
              )}
            </div>
            <Button
              type="submit"
              disabled={isSubmitting || !isFormValid}
              className="bg-teal-700 text-white hover:bg-teal-800 dark:bg-teal-600 dark:hover:bg-teal-700"
            >
              {isSubmitting ? (
                <>
                  <Loader2 className="animate-spin" />
                  Отправка...
                </>
              ) : (
                "Отправить"
              )}
            </Button>
          </div>
        </form>
      ) : (
        <p className="mb-10 text-sm text-muted-foreground">
          Комментарии к этой записи отключены.
        </p>
      )}

      <div className="space-y-6">
        {commentTree.map(({ comment, replies }) => (
          <div key={comment.id} className="space-y-6">
            <CommentItem
              comment={comment}
              onReply={commentsOpen ? setReplyToId : undefined}
            />
            {replies.map((reply) => (
              <CommentItem
                key={reply.id}
                comment={reply}
                isReply
                onReply={commentsOpen ? setReplyToId : undefined}
              />
            ))}
          </div>
        ))}
      </div>

      {hasMore && (
        <button
          type="button"
          onClick={handleLoadMore}
          disabled={isLoadingMore}
          className={cn(
            "mt-8 flex w-full items-center justify-center gap-2 rounded-lg border border-border py-3 text-sm font-medium text-foreground transition-colors hover:bg-accent",
            isLoadingMore && "opacity-70",
          )}
        >
          {isLoadingMore ? (
            <>
              <Loader2 className="h-4 w-4 animate-spin" />
              Загрузка...
            </>
          ) : (
            <>
              Показать ещё {Math.min(10, total - comments.length)} комментариев
              <ChevronDown className="h-4 w-4" />
            </>
          )}
        </button>
      )}
    </section>
  );
}
