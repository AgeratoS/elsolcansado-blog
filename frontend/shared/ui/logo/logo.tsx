import Link from "next/link";
import { cn } from "@/lib/utils";

type LogoProps = {
    className?: string;
};

export function Logo({ className }: LogoProps) {
    return (
        <Link href="/" className={cn("font-bold", className)}>
            Журнал
        </Link>
    )
}