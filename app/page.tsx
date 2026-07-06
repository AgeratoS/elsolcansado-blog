import { FeaturedPostsSection } from "@/frontend/widgets";
import { getPostsPaginated } from "@/lib/wordpress";
import { siteConfig } from "@/site.config";

import type { Metadata } from "next";

export const metadata: Metadata = {
    title: siteConfig.site_name,
    description: siteConfig.site_description,
};

export const revalidate = 3600;

export default async function Page() {
    const { data: posts } = await getPostsPaginated(1, 5);

    return (
        <main className="flex-1">
            <FeaturedPostsSection posts={posts} />
        </main>
    );
}
