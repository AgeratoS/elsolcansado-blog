import { Post } from "@/widgets/post/Post";

export default async function Page({ params }: { params: { slug: string } }) {

    const data = await params;

    return <Post slug={data.slug} />;
}