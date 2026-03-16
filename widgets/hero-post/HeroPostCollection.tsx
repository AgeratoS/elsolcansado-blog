"use client";
import { PostListItem } from "@/entities/post";
import { ScrollCard } from "./ScrollCard";
import { HeroPost } from "./HeroPost";
import { useScroll } from "framer-motion";
import { useRef } from "react";


interface HeroPostCollectionProps {
    posts: PostListItem[];
}

export function HeroPostCollection({ posts }: HeroPostCollectionProps) {

    const wrapperRef = useRef<HTMLDivElement>(null);
    const { scrollYProgress } = useScroll({
        container: wrapperRef,
        offset: ["start start", "end end"],
    });

    return <div
        className="overflow-y-scroll perspective-[1000] max-h-screen bg-ui-black"
        ref={wrapperRef}
    >
        <div style={{
            height: `${posts.length * 100}vh`
        }}>
            <div className="sticky top-0 h-screen">
                {posts.map((post, index) => (
                    <ScrollCard key={post.id} scrollYProgress={scrollYProgress} index={index} total={posts.length}>
                        <HeroPost post={post} />
                    </ScrollCard>
                ))}
            </div>
        </div>
    </div>
}