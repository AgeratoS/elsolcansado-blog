import { getMainNavigation } from "@/lib/navigation";

import { getFooterCategories } from "./lib/get-footer-categories";
import { FooterView } from "./footer-view";

export async function Footer() {
  const [navItems, categories] = await Promise.all([
    getMainNavigation(),
    getFooterCategories(),
  ]);

  return <FooterView navItems={navItems} categories={categories} />;
}
