import { getLabelPaletteColor } from "@/frontend/shared/lib/get-label-palette-color";
import { cn } from "@/lib/utils";
import Link from "next/link";
import type { KeyboardEvent, MouseEvent } from "react";

type CategoryLabelProps = {
  id: number;
  name: string;
  href?: string;
  className?: string;
  onClick?: (event: MouseEvent<HTMLElement>) => void;
  onKeyDown?: (event: KeyboardEvent<HTMLElement>) => void;
};

export function CategoryLabel({
  id,
  name,
  href,
  className,
  onClick,
  onKeyDown,
}: CategoryLabelProps) {
  const { bg, text } = getLabelPaletteColor(name);
  const sharedClassName = cn(
    "inline-block w-fit rounded px-3 py-1 text-sm font-medium",
    className,
  );
  const style = {
    backgroundColor: bg,
    color: text,
  };

  if (href && !onClick) {
    return (
      <Link href={href} className={sharedClassName} style={style}>
        {name}
      </Link>
    );
  }

  return (
    <span
      role={onClick ? "button" : undefined}
      tabIndex={onClick ? 0 : undefined}
      className={sharedClassName}
      style={style}
      onClick={onClick}
      onKeyDown={onKeyDown}
    >
      {name}
    </span>
  );
}
