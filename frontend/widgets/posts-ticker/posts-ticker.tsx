import type { Post } from "@/lib/wordpress.d";
import { cn } from "@/lib/utils";
import Link from "next/link";

const SEGMENT_REPEATS = 8;
export const MAX_TICKER_POSTS = 5;

type PostsTickerProps = {
    posts: Post[];
    className?: string;
};

function getTickerPosts(posts: Post[]): Post[] {
    return posts
        .filter((post) => post.status === "publish")
        .slice(0, MAX_TICKER_POSTS);
}

function getTickerLabel(post: Post, index: number): string {
    if (index === 0) {
        return "ПОСЛЕДНЕЕ";
    }

    if (post.sticky) {
        return "ПОПУЛЯРНОЕ";
    }

    return "НОВОЕ";
}

type TickerSegmentProps = {
    posts: Post[];
    repeatCount: number;
    "aria-hidden"?: boolean;
};

function TickerSegment({
    posts,
    repeatCount,
    "aria-hidden": ariaHidden,
}: TickerSegmentProps) {
    const items = Array.from({ length: repeatCount }, (_, copyIndex) =>
        posts.map((post, index) => ({
            post,
            index,
            key: `${copyIndex}-${post.id}`,
        })),
    ).flat();

    return (
        <div
            className="flex shrink-0 items-center"
            aria-hidden={ariaHidden}
        >
            {items.map(({ post, index, key }) => (
                <span key={key} className="inline-flex items-center">
                    <Link
                        href={`/posts/${post.slug}`}
                        className="transition-opacity hover:opacity-60"
                        tabIndex={ariaHidden ? -1 : undefined}
                    >
                        <span className="font-semibold">
                            {getTickerLabel(post, index)}:
                        </span>{" "}
                        {post.title.rendered}
                    </Link>
                    <span className="mx-6" aria-hidden="true">
                        -
                    </span>
                </span>
            ))}
        </div>
    );
}

export function PostsTicker({ posts, className }: PostsTickerProps) {
    const tickerPosts = getTickerPosts(posts);

    if (tickerPosts.length === 0) {
        return null;
    }

    return (
        <div
            className={cn(
                "w-full overflow-hidden border-y border-neutral-950 bg-[#ece8e0] py-3 text-neutral-950",
                className,
            )}
            aria-label="Последние публикации"
        >
            <div className="flex w-max animate-posts-ticker whitespace-nowrap font-mono text-xs tracking-wide uppercase motion-reduce:animate-none">
                <TickerSegment posts={tickerPosts} repeatCount={SEGMENT_REPEATS} />
                <TickerSegment
                    posts={tickerPosts}
                    repeatCount={SEGMENT_REPEATS}
                    aria-hidden
                />
            </div>
        </div>
    );
}
