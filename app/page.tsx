"use client";
import { HeroPost, ScrollCard } from "@/widgets/hero-post";
import { useScroll } from "framer-motion";
import { useRef } from "react";

export default function Home() {
  const wrapperRef = useRef(null);
  const { scrollYProgress } = useScroll({
    container: wrapperRef,
    offset: ["start start", "end end"],
  });

  return (
    <div className="max-h-screen">
      <div
        className="overflow-y-scroll perspective-[1000] max-h-screen"
        ref={wrapperRef}
      >
        <HeroPost />
        <HeroPost />
        <HeroPost />
      </div>
    </div>
  );
}
