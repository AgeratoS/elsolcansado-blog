import { Logo } from "@/frontend/shared/ui/logo";
import { ThemeToggle } from "@/frontend/shared/ui/theme-toggle";

import { HeaderNav } from "./header-nav";
import { HeaderSearchView } from "./header-search-view";

type HeaderViewProps = {
  activePath: string;
  onSearch?: (query: string) => void;
};

export function HeaderView({ activePath, onSearch }: HeaderViewProps) {
  return (
    <header className="border-b border-border bg-card">
      <div className="container flex items-center justify-between gap-8 py-4">
        <Logo className="text-lg text-foreground" />

        <div className="flex items-center gap-4 md:gap-8">
          <HeaderNav activePath={activePath} />
          <div className="flex items-center gap-2">
            <HeaderSearchView onSearch={onSearch} />
            <ThemeToggle />
          </div>
        </div>
      </div>
    </header>
  );
}
