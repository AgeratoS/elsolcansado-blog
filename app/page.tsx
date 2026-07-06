import {
    FeaturedPostsSection,
    HeroSection,
    MAX_TICKER_POSTS,
    PostsTicker,
} from "@/frontend/widgets";
import { getPostsPaginated } from "@/lib/wordpress";
import { siteConfig } from "@/site.config";

import type { Metadata } from "next";

export const metadata: Metadata = {
    title: siteConfig.site_name,
    description: siteConfig.site_description,
};

export const revalidate = 3600;

export default async function Page() {
    const { data: posts, headers } = await getPostsPaginated(1, MAX_TICKER_POSTS);

    return (
        <main className="flex-1">
            <HeroSection postCount={headers.total} />
            <PostsTicker posts={posts} />
            <FeaturedPostsSection posts={posts} />
        </main>
    );
}
