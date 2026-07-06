"use client";

import { ThemeProvider, useTheme } from "next-themes";
import { useEffect, type ReactNode } from "react";

type StorybookTheme = "light" | "dark" | "system";

function ThemeSync({ theme }: { theme: StorybookTheme }) {
  const { setTheme } = useTheme();

  useEffect(() => {
    setTheme(theme);
  }, [theme, setTheme]);

  return null;
}

type StorybookThemeDecoratorProps = {
  theme: StorybookTheme;
  children: ReactNode;
};

export function StorybookThemeDecorator({
  theme,
  children,
}: StorybookThemeDecoratorProps) {
  return (
    <ThemeProvider attribute="class" defaultTheme="system" enableSystem>
      <ThemeSync theme={theme} />
      <div className="min-h-screen bg-background font-sans text-foreground antialiased">
        {children}
      </div>
    </ThemeProvider>
  );
}
