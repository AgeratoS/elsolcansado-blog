export type NavItem = {
  id: string;
  label: string;
  href: string;
};

export const mainMenu: NavItem[] = [
  {
    label: "Главная",
    href: "/",
    id: "home",
  },
  {
    label: "Статьи",
    href: "/posts",
    id: "posts",
  },
  {
    label: "О нас",
    href: "/about",
    id: "about",
  },
  {
    label: "Контакты",
    href: "/contacts",
    id: "contacts",
  },
];
