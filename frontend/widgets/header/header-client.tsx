"use client";

import { usePathname, useRouter } from "next/navigation";

import type { NavItem } from "@/frontend/shared/config/menu";

import { HeaderView } from "./header-view";

type HeaderClientProps = {
  navItems: NavItem[];
};

function navigateToSearch(router: ReturnType<typeof useRouter>, query: string) {
  if (!query) {
    router.push("/posts");
    return;
  }

  router.push(`/posts?search=${encodeURIComponent(query)}`);
}

export function HeaderClient({ navItems }: HeaderClientProps) {
  const pathname = usePathname();
  const router = useRouter();

  return (
    <HeaderView
      navItems={navItems}
      activePath={pathname}
      onSearch={(query) => navigateToSearch(router, query)}
    />
  );
}
