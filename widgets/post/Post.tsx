import { getPostBySlug } from "@/entities/post";
import { NoPostExists } from "./NoPostExists";
import dynamic from "next/dynamic";
import { PostView } from "./PostView";
import { getCategories, getTags } from "@/entities/term/api/wpTermApi";
import type { Term } from "@/entities/term/model/types";

const LoadingPostContent = dynamic<{ contentHtml: string }>(
    () => import("./PostContent").then((mod) => mod.PostContent),
    {
        loading: () => (
            <div className="flex flex-col gap-4">
                {Array.from({ length: 10 }).map((_, index) => (
                    <div
                        key={index}
                        className="animate-pulse bg-ui-gray-900 rounded-lg h-4 w-full"
                    ></div>
                ))}
            </div>
        ),
    },
);

export async function Post({ slug }: { slug: string }) {
    const post = await getPostBySlug(slug);

    if (!post) {
        return <NoPostExists />;
    }

    const [categories, tags]: [Term[], Term[]] = await Promise.all([
        post.categoryIds.length
            ? getCategories({ include: post.categoryIds })
            : Promise.resolve([]),
        post.tagIds.length ? getTags({ include: post.tagIds }) : Promise.resolve([]),
    ]);

    return <PostView post={post} categories={categories} tags={tags} />;
}