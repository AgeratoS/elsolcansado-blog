"use client";

import { formatRelativeTime } from "@/frontend/shared/lib/format-relative-time";
import type { Comment } from "@/lib/wordpress.d";
import { cn } from "@/lib/utils";

type CommentItemProps = {
  comment: Comment;
  onReply?: (commentId: number) => void;
  isReply?: boolean;
};

function getAvatarUrl(comment: Comment): string | null {
  return comment.author_avatar_urls?.["96"] ?? null;
}

function getInitials(name: string): string {
  return name
    .split(/\s+/)
    .slice(0, 2)
    .map((part) => part[0]?.toUpperCase() ?? "")
    .join("");
}

export function CommentItem({ comment, onReply, isReply }: CommentItemProps) {
  const avatarUrl = getAvatarUrl(comment);

  return (
    <article
      className={cn(
        "flex gap-4 border-b border-border pb-6 last:border-b-0",
        isReply && "ml-8 border-l border-border pl-6",
      )}
    >
      <div className="relative flex h-10 w-10 shrink-0 items-center justify-center overflow-hidden rounded-full bg-teal-100 text-sm font-semibold text-teal-800">
        {avatarUrl ? (
          <img
            src={avatarUrl}
            alt=""
            className="absolute inset-0 h-full w-full object-cover"
          />
        ) : (
          getInitials(comment.author_name)
        )}
      </div>

      <div className="min-w-0 flex-1">
        <div className="mb-2 flex flex-wrap items-center gap-2">
          <span className="font-semibold text-foreground">
            {comment.author_name}
          </span>
          <time
            dateTime={comment.date}
            className="text-sm text-muted-foreground"
          >
            {formatRelativeTime(comment.date)}
          </time>
        </div>

        <div
          className="prose prose-sm max-w-none text-foreground prose-p:my-0"
          dangerouslySetInnerHTML={{ __html: comment.content.rendered }}
        />

        {onReply && (
          <button
            type="button"
            onClick={() => onReply(comment.id)}
            className="mt-3 text-sm font-medium text-teal-700 transition-colors hover:text-teal-900"
          >
            Ответить
          </button>
        )}
      </div>
    </article>
  );
}
