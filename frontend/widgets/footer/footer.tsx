import { getFooterCategories } from "./lib/get-footer-categories";
import { FooterView } from "./footer-view";

export async function Footer() {
  const categories = await getFooterCategories();

  return <FooterView categories={categories} />;
}
