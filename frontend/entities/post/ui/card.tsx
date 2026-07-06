"use client";

import {
    formatPostDate,
    getReadingTimeMinutes,
} from "@/frontend/entities/post/lib/format-post-meta";
import { CategoryLabel } from "@/frontend/shared/ui/category-label";
import type { Post } from "@/lib/wordpress.d";
import { cn } from "@/lib/utils";
import Image from "next/image";
import Link from "next/link";
import * as m from "motion/react-client";

type CardPostProps = {
    post: Post;
    size?: "hero" | "default";
    className?: string;
    onCategoryClick?: (categoryId: number) => void;
};

export function CardPost({
    post,
    size = "default",
    className,
    onCategoryClick,
}: CardPostProps) {
    const featuredMedia = post._embedded?.["wp:featuredmedia"]?.[0];
    const category = post._embedded?.["wp:term"]?.[0]?.[0];
    const formattedDate = formatPostDate(post.date);
    const readingTime = getReadingTimeMinutes(post.content.rendered);
    const isHero = size === "hero";

    return (
        <Link
            href={`/posts/${post.slug}`}
            className={cn(
                "group block h-full overflow-hidden rounded-lg bg-muted",
                className,
            )}
        >
            <m.div
                className={cn(
                    "relative h-full min-h-56",
                    isHero ? "min-h-72 lg:min-h-full" : "min-h-52",
                )}
            >
                {featuredMedia?.source_url ? (
                    <m.div className="absolute inset-0 transition-transform duration-300 group-hover:scale-[1.02]">
                        <Image
                            src={featuredMedia.source_url}
                            alt={featuredMedia.alt_text || post.title.rendered}
                            fill
                            className="object-cover"
                            sizes={
                                isHero
                                    ? "(max-width: 1024px) 100vw, 66vw"
                                    : "(max-width: 1024px) 100vw, 33vw"
                            }
                        />
                    </m.div>
                ) : (
                    <div className="absolute inset-0 bg-[#e6e2d8] dark:bg-secondary" />
                )}
                {featuredMedia?.source_url && (
                    <m.div
                        className={cn(
                            "pointer-events-none absolute inset-0",
                            "bg-white/55 dark:bg-black/55",
                        )}
                    />
                )}
                <m.div
                    className={cn(
                        "absolute bottom-6 left-6 right-6 flex flex-col gap-3",
                        "text-foreground dark:text-white",
                        isHero && "bottom-8 left-8 right-8 gap-4",
                    )}
                >
                    {category && (
                        <CategoryLabel
                            id={category.id}
                            name={category.name}
                            onClick={
                                onCategoryClick
                                    ? (event) => {
                                          event.preventDefault();
                                          event.stopPropagation();
                                          onCategoryClick(category.id);
                                      }
                                    : undefined
                            }
                            onKeyDown={
                                onCategoryClick
                                    ? (event) => {
                                          if (event.key === "Enter" || event.key === " ") {
                                              event.preventDefault();
                                              event.stopPropagation();
                                              onCategoryClick(category.id);
                                          }
                                      }
                                    : undefined
                            }
                        />
                    )}
                    <m.h3
                        className={cn(
                            "font-bold leading-tight line-clamp-2",
                            isHero ? "text-2xl lg:text-3xl" : "text-lg lg:text-xl",
                        )}
                    >
                        {post.title.rendered}
                    </m.h3>
                    <m.div className="flex items-center gap-2 text-sm text-muted-foreground dark:text-white/75">
                        <time dateTime={post.date}>{formattedDate}</time>
                        <span aria-hidden="true">·</span>
                        <span>{readingTime} мин</span>
                    </m.div>
                </m.div>
            </m.div>
        </Link>
    );
}
