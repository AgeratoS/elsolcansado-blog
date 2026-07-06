export type NavItem = {
  id: string;
  label: string;
  href: string;
};

/** Static app routes always shown before CMS pages in navigation. */
export const coreNavItems: NavItem[] = [
  {
    id: "home",
    label: "Главная",
    href: "/",
  },
  {
    id: "posts",
    label: "Статьи",
    href: "/posts",
  },
];

export const mockNavItems: NavItem[] = [
  ...coreNavItems,
  {
    id: "42",
    label: "Обо мне",
    href: "/about-me",
  },
];
