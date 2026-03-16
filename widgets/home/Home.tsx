import { getPosts } from "@/entities/post";
import { HeroPostCollection } from "../hero-post";


export async function Home() {

    const posts = await getPosts();

    if (!posts.items) {
        return null;
    }

    return (
        <div className="max-h-screen">
            <HeroPostCollection posts={posts.items} />
        </div>
    );
}
