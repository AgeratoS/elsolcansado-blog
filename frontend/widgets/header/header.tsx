"use client";

import { usePathname, useRouter } from "next/navigation";

import { HeaderView } from "./header-view";

function navigateToSearch(router: ReturnType<typeof useRouter>, query: string) {
  if (!query) {
    router.push("/posts");
    return;
  }

  router.push(`/posts?search=${encodeURIComponent(query)}`);
}

export function Header() {
  const pathname = usePathname();
  const router = useRouter();

  return (
    <HeaderView
      activePath={pathname}
      onSearch={(query) => navigateToSearch(router, query)}
    />
  );
}
