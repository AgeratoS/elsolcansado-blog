"use client";

import type { NavItem } from "@/frontend/shared/config/menu";
import { cn } from "@/lib/utils";
import Link from "next/link";

import { isNavItemActive } from "./lib/is-nav-active";

type HeaderNavProps = {
  navItems: NavItem[];
  activePath: string;
};

export function HeaderNav({ navItems, activePath }: HeaderNavProps) {
  return (
    <nav aria-label="Основная навигация">
      <ul className="hidden items-center gap-10 md:flex">
        {navItems.map((item) => {
          const isActive = isNavItemActive(activePath, item);

          return (
            <li key={item.id}>
              <Link
                href={item.href}
                aria-current={isActive ? "page" : undefined}
                className={cn(
                  "text-sm font-medium transition-colors",
                  isActive
                    ? "text-teal-800 dark:text-teal-400"
                    : "text-muted-foreground hover:text-foreground"
                )}
              >
                {item.label}
              </Link>
            </li>
          );
        })}
      </ul>
    </nav>
  );
}
