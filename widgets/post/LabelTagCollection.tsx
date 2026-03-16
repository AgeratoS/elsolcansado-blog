"use client";

import type { Term } from "@/entities/term/model/types";
import { LabelTag } from "./LabelTag";

interface LabelTagCollectionProps {
  categories: Term[];
  tags: Term[];
}

export function LabelTagCollection({ categories, tags }: LabelTagCollectionProps) {
  if (!categories.length && !tags.length) {
    return null;
  }

  return (
    <div className="flex flex-wrap items-center gap-3 mb-4 text-xs lg:text-sm">
      {categories.length > 0 && (
        <div className="flex flex-wrap items-center gap-2">
          <span className="uppercase tracking-[0.2em] text-ui-gray-500">Категории</span>
          {categories.map((cat) => (
            <LabelTag key={cat.id} term={cat} kind="category" />
          ))}
        </div>
      )}

      {tags.length > 0 && (
        <div className="flex flex-wrap items-center gap-2">
          <span className="uppercase tracking-[0.2em] text-ui-gray-500">Метки</span>
          {tags.map((tag) => (
            <LabelTag key={tag.id} term={tag} kind="tag" />
          ))}
        </div>
      )}
    </div>
  );
}

