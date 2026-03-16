"use client";
import { Post } from "@/entities/post";
import dynamic from "next/dynamic";
import Link from "next/link";
import { CalendarIcon } from "lucide-react";
import { motion, useScroll, useSpring } from "framer-motion";
import { useRef } from "react";
import type { Term } from "@/entities/term/model/types";
import { LabelTagCollection } from "./LabelTagCollection";

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

interface PostViewProps {
    post: Post;
    categories: Term[];
    tags: Term[];
}

export function PostView({ post, categories, tags }: PostViewProps) {
    const publishedDate = post.publishedAt ?? post.updatedAt ?? null;

    const wrapperRef = useRef<HTMLDivElement>(null);

    const { scrollYProgress } = useScroll({
        container: wrapperRef,
    });

    const progress = useSpring(scrollYProgress);

    return <div className="h-screen overflow-y-auto relative" ref={wrapperRef}>
        <motion.div className="sticky left-0 top-0 right-0 h-2 bg-indochine-400 z-8000" style={{
            scaleX: progress,
            originX: 0,
        }}/>
        <article className="max-w-4xl mx-auto py-10 px-10 md:py-16 md:px-10">
            <header className="mb-10 md:mb-12">
                <div className="mb-4">
                    <Link
                        href="/"
                        className="text-sm tracking-[0.2em] uppercase text-ui-gray-500 hover:text-ui-gray-300 transition-colors"
                    >
                        ← Назад к статьям
                    </Link>
                </div>

                <h1 className="heading-serif text-ui-white text-4xl md:text-5xl xl:text-6xl text-pretty mb-4">
                    {post.title}
                </h1>

                <LabelTagCollection categories={categories} tags={tags} />

                {publishedDate && (
                    <div className="flex gap-3 md:gap-5 items-center text-xs lg:text-lg uppercase tracking-[0.2em] text-ui-gray-500">
                        <CalendarIcon className="size-4 lg:size-6" />
                        {new Date(publishedDate).toLocaleDateString("ru-RU", {
                            year: "numeric",
                            month: "long",
                            day: "numeric",
                        })}
                    </div>
                )}
            </header>

            <LoadingPostContent contentHtml={post.contentHtml} />
        </article>
    </div>
}