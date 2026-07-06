"use client";

import { Button } from "@/frontend/shared/ui/button";
import { siteConfig } from "@/site.config";
import { Check, Link2 } from "lucide-react";
import { useState } from "react";

type PostShareButtonsProps = {
  slug: string;
  title: string;
};

export function PostShareButtons({ slug, title }: PostShareButtonsProps) {
  const [copied, setCopied] = useState(false);
  const postUrl = `${siteConfig.site_domain}/posts/${slug}`;
  const encodedUrl = encodeURIComponent(postUrl);
  const encodedTitle = encodeURIComponent(title);

  async function handleCopyLink() {
    try {
      await navigator.clipboard.writeText(postUrl);
      setCopied(true);
      window.setTimeout(() => setCopied(false), 2000);
    } catch {
      setCopied(false);
    }
  }

  return (
    <div className="flex flex-wrap items-center gap-3">
      <span className="text-sm font-medium text-muted-foreground">
        Поделиться:
      </span>
      <Button
        asChild
        variant="outline"
        size="sm"
        className="border-[#0077FF] bg-[#0077FF] text-white hover:bg-[#0066DD] hover:text-white"
      >
        <a
          href={`https://vk.com/share.php?url=${encodedUrl}&title=${encodedTitle}`}
          target="_blank"
          rel="noopener noreferrer"
        >
          ВКонтакте
        </a>
      </Button>
      <Button
        asChild
        variant="outline"
        size="sm"
        className="border-[#2AABEE] bg-[#2AABEE] text-white hover:bg-[#229AD8] hover:text-white"
      >
        <a
          href={`https://t.me/share/url?url=${encodedUrl}&text=${encodedTitle}`}
          target="_blank"
          rel="noopener noreferrer"
        >
          Telegram
        </a>
      </Button>
      <Button
        type="button"
        variant="outline"
        size="sm"
        onClick={handleCopyLink}
        className="gap-2"
      >
        {copied ? <Check className="h-4 w-4" /> : <Link2 className="h-4 w-4" />}
        {copied ? "Скопировано" : "Скопировать ссылку"}
      </Button>
    </div>
  );
}
