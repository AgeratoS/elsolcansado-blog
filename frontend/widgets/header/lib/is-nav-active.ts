import type { NavItem } from "@/frontend/shared/config/menu";

export function isNavItemActive(
  pathname: string,
  item: NavItem
): boolean {
  if (item.id === "home") {
    return pathname === "/";
  }

  if (item.id === "posts") {
    return pathname === "/posts" || pathname.startsWith("/posts/");
  }

  return pathname === item.href || pathname.startsWith(`${item.href}/`);
}
