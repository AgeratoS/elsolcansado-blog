import { CardPost } from "@/frontend/entities/post";
import type { Post } from "@/lib/wordpress.d";
import { cn } from "@/lib/utils";
import Link from "next/link";

const GRID_SLOT_CLASSES = [
    "lg:col-span-2 lg:row-span-2",
    "lg:col-start-3 lg:row-start-1",
    "lg:col-start-3 lg:row-start-2",
    "lg:col-start-1 lg:row-start-3",
    "lg:col-span-2 lg:col-start-2 lg:row-start-3",
] as const;

const MAX_FEATURED_POSTS = 5;

type FeaturedPostsSectionProps = {
    posts: Post[];
};

export function FeaturedPostsSection({ posts }: FeaturedPostsSectionProps) {
    const featuredPosts = posts.slice(0, MAX_FEATURED_POSTS);

    if (featuredPosts.length === 0) {
        return null;
    }

    return (
        <section className="container py-12">
            <div className="mb-8 flex items-center justify-between gap-4">
                <h2 className="text-sm font-medium tracking-[0.2em] text-muted-foreground uppercase">
                    Избранное
                </h2>
                <Link
                    href="/posts"
                    className="text-sm text-foreground transition-colors hover:text-muted-foreground"
                >
                    Все статьи
                </Link>
            </div>

            <div className="grid grid-cols-1 gap-4 lg:grid-cols-3 lg:grid-rows-3 lg:auto-rows-[minmax(200px,1fr)]">
                {featuredPosts.map((post, index) => (
                    <CardPost
                        key={post.id}
                        post={post}
                        size={index === 0 ? "hero" : "default"}
                        className={cn(GRID_SLOT_CLASSES[index])}
                    />
                ))}
            </div>
        </section>
    );
}
