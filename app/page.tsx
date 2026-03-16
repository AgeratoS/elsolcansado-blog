"use client";
import {HeroPost, ScrollCard} from "@/widgets/hero-post";
import {useScroll} from "framer-motion";
import {useRef} from "react";

export default function Home() {
    const wrapperRef = useRef(null);
    const {scrollYProgress} = useScroll({
        container: wrapperRef,
        offset: ["start start", "end end"],
    });

    return (
        <div className="max-h-screen">
            <div
                className="overflow-y-scroll perspective-[1000] max-h-screen bg-ui-black"
                ref={wrapperRef}
            >
                <div style={{
                    height: "300vh"
                }}>
                    <div className="sticky top-0 h-screen">
                        <ScrollCard scrollYProgress={scrollYProgress} index={0} total={3}>
                            <HeroPost title="Монады без академии: как функциональные абстракции помогли мне
              писать меньше багов"/>
                        </ScrollCard>

                        <ScrollCard scrollYProgress={scrollYProgress} index={1} total={3}>
                            <HeroPost title="Карточка 2"/>
                        </ScrollCard>

                        <ScrollCard scrollYProgress={scrollYProgress} index={2} total={3}>
                            <HeroPost title="Карточка 3"/>
                        </ScrollCard>
                    </div>
                </div>
            </div>
        </div>
    );
}
