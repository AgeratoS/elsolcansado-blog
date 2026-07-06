import { getHeaderNavigation } from "@/lib/navigation";

import { HeaderClient } from "./header-client";

export async function Header() {
  const navItems = await getHeaderNavigation();

  return <HeaderClient navItems={navItems} />;
}
