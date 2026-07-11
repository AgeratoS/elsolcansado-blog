import type { NavItem } from "@/frontend/shared/config/menu";
import { Logo } from "@/frontend/shared/ui/logo";
import Link from "next/link";

import { FooterLinkList } from "./footer-link-list";
import type { FooterCategory } from "./model/types";

type FooterViewProps = {
  navItems: NavItem[];
  categories: FooterCategory[];
};

export function FooterView({ navItems, categories }: FooterViewProps) {
  const year = new Date().getFullYear();

  return (
    <footer className="mt-auto border-t border-border bg-neutral-950 text-neutral-100 dark:bg-black">
      <div className="container py-12 md:py-16">
        <div className="flex flex-col gap-12 md:flex-row md:gap-24">
          <div className="max-w-xs shrink-0">
            <Logo className="text-xl text-white" />
            <p className="mt-4 text-sm leading-relaxed text-neutral-400">
              Персональный блог одного разработчика
            </p>
          </div>

          <nav className="flex flex-col gap-12 sm:flex-row sm:gap-24">
            <FooterLinkList title="Навигация" items={navItems} />
            <FooterLinkList
              title="Категории"
              items={categories.map((category) => ({
                id: category.id,
                label: category.name,
                href: category.href,
              }))}
            />
          </nav>
        </div>
      </div>

      <div className="border-t border-neutral-800">
        <div className="container py-6">
          <p className="text-center text-sm text-neutral-500">
            © {year}{" "}
            <Link href="/" className="hover:text-neutral-300">
              Журнал
            </Link>
            . Все права защищены.
          </p>
        </div>
      </div>
    </footer>
  );
}
