"use client";

import Link from "next/link";
import type { Term } from "@/entities/term/model/types";

interface LabelTagProps {
  term: Term;
  kind: "category" | "tag";
}

export function LabelTag({ term, kind }: LabelTagProps) {
  const href = term.url;
  const isCategory = kind === "category";

  const baseClasses =
    "inline-flex items-center rounded-full px-3 py-1 text-xs lg:text-sm transition-colors";

  const classes = isCategory
    ? `${baseClasses} border border-ui-gray-700 text-ui-gray-200 hover:border-ui-gray-300 hover:text-ui-white`
    : `${baseClasses} bg-ui-gray-900 text-ui-gray-200 hover:bg-ui-gray-700`;

  const label = isCategory ? term.name : `#${term.name}`;

  return (
    <Link href={href} className={classes}>
      {label}
    </Link>
  );
}

