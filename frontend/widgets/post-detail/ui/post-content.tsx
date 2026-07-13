"use client";

import { useMemo } from "react";

import {
  hasCodeBlocks,
  highlightCodeInHtml,
} from "@/lib/highlight-code";

type PostContentProps = {
  html: string;
  className?: string;
};

export function PostContent({ html, className }: PostContentProps) {
  const contentHtml = useMemo(
    () => (hasCodeBlocks(html) ? highlightCodeInHtml(html) : html),
    [html],
  );

  return (
    <div
      className={className}
      dangerouslySetInnerHTML={{ __html: contentHtml }}
    />
  );
}
