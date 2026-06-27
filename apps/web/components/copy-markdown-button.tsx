"use client";

import * as React from "react";
import { Check, Copy } from "lucide-react";

import { cn } from "@/lib/utils";

interface CopyMarkdownButtonProps {
  markdown: string;
  className?: string;
}

export function CopyMarkdownButton({
  markdown,
  className,
}: CopyMarkdownButtonProps) {
  const [copied, setCopied] = React.useState(false);

  const copy = React.useCallback(() => {
    navigator.clipboard.writeText(markdown).then(() => {
      setCopied(true);
      setTimeout(() => setCopied(false), 1500);
    });
  }, [markdown]);

  return (
    <button
      type="button"
      onClick={copy}
      aria-label="Copy page as Markdown"
      className={cn(
        "inline-flex shrink-0 items-center gap-1.5 rounded-md border border-border px-2.5 py-1.5 text-xs font-medium text-muted-foreground transition-colors hover:bg-secondary hover:text-foreground",
        className
      )}
    >
      {copied ? (
        <Check className="h-3.5 w-3.5" />
      ) : (
        <Copy className="h-3.5 w-3.5" />
      )}
      {copied ? "Copied" : "Copy as Markdown"}
    </button>
  );
}
