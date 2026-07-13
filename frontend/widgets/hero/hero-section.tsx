import { Button } from "@/frontend/shared/ui/button";
import { siteConfig } from "@/site.config";
import { cn } from "@/lib/utils";
import { FileText } from "lucide-react";
import Image from "next/image";
import Link from "next/link";

const HERO_IMAGE = "/images/hero-desk.jpg";

type HeroStat = {
    value: string;
    label: string;
};

type HeroSectionProps = {
    postCount: number;
    stats?: HeroStat[];
    className?: string;
};

function formatPostCount(count: number): string {
    return new Intl.NumberFormat("ru-RU").format(count);
}

export function HeroSection({
    postCount,
    stats,
    className,
}: HeroSectionProps) {
    const year = new Date().getFullYear();
    const yearsActive = year - siteConfig.founded_year;
    const defaultStats: HeroStat[] = [
        { value: formatPostCount(postCount), label: "Статей" },
        {
            value: yearsActive > 0 ? `${yearsActive}+` : "1",
            label: "Года",
        },
    ];

    const displayStats = stats ?? defaultStats;

    return (
        <section
            className={cn(
                "relative min-h-[calc(100dvh-4.5rem)] overflow-hidden bg-neutral-950 text-white",
                className,
            )}
        >
            <div className="absolute inset-0 lg:left-[42%]">
                <Image
                    src={HERO_IMAGE}
                    alt=""
                    fill
                    priority
                    className="object-cover object-center"
                    sizes="(max-width: 1024px) 100vw, 58vw"
                />
                <div
                    className="absolute inset-0 bg-neutral-950/80 lg:bg-gradient-to-r lg:from-neutral-950 lg:via-neutral-950/90 lg:to-neutral-950/20"
                    aria-hidden="true"
                />
            </div>

            <div className="container relative flex min-h-[calc(100dvh-4.5rem)] flex-col justify-center py-16 lg:py-20">
                <div className="grid items-center gap-12 lg:grid-cols-2 lg:gap-16">
                    <div className="max-w-xl">
                        <p className="mb-6 inline-block border border-white/25 px-3 py-1.5 text-[11px] font-medium tracking-[0.22em] text-white/70 uppercase">
                            Персональный блог · {year}
                        </p>

                        <h1 className="text-5xl font-bold tracking-tight sm:text-6xl lg:text-7xl xl:text-8xl">
                            Мысли
                        </h1>

                        <p className="mt-6 max-w-md text-base leading-relaxed text-neutral-400 sm:text-lg">
                            {siteConfig.site_description}. Пишу о программировании,
                            дизайне и философии технологий — без воды, только то,
                            что реально работает.
                        </p>

                        <div className="mt-10 flex flex-wrap items-center gap-6">
                            <Button
                                asChild
                                size="lg"
                                className="h-12 rounded-none bg-white px-8 text-sm font-semibold tracking-[0.12em] text-neutral-950 uppercase hover:bg-white/90"
                            >
                                <Link href="/posts">Читать блог</Link>
                            </Button>

                            <div className="flex items-center gap-2 text-sm text-neutral-400">
                                <FileText
                                    className="size-4 shrink-0"
                                    aria-hidden="true"
                                />
                                <span>
                                    {formatPostCount(postCount)}{" "}
                                    {postCount === 1
                                        ? "статья"
                                        : postCount >= 2 && postCount <= 4
                                          ? "статьи"
                                          : "статей"}
                                </span>
                            </div>
                        </div>

                        <div className="mt-12 flex gap-10 border-t border-white/10 pt-8 lg:hidden">
                            {displayStats.map((stat) => (
                                <div key={stat.label}>
                                    <p className="text-2xl font-bold tracking-tight">
                                        {stat.value}
                                    </p>
                                    <p className="mt-1 text-[11px] tracking-[0.18em] text-neutral-500 uppercase">
                                        {stat.label}
                                    </p>
                                </div>
                            ))}
                        </div>
                    </div>

                    <div className="hidden justify-end lg:flex">
                        <div className="border border-white/10 bg-neutral-950/60 px-8 py-6 backdrop-blur-sm">
                            <div className="flex gap-10">
                                {displayStats.map((stat) => (
                                    <div key={stat.label} className="text-center">
                                        <p className="text-3xl font-bold tracking-tight">
                                            {stat.value}
                                        </p>
                                        <p className="mt-1 text-[11px] tracking-[0.18em] text-neutral-500 uppercase">
                                            {stat.label}
                                        </p>
                                    </div>
                                ))}
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </section>
    );
}
