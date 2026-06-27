"use client";

import * as React from "react";

import { cn } from "@/lib/utils";

export interface DocsNavItem {
  id: string;
  label: string;
}

export interface DocsNavGroup {
  title: string;
  items: DocsNavItem[];
}

export function DocsSidebar({ groups }: { groups: DocsNavGroup[] }) {
  const [active, setActive] = React.useState<string>(groups[0]?.items[0]?.id);

  React.useEffect(() => {
    const ids = groups.flatMap((g) => g.items.map((i) => i.id));
    const observer = new IntersectionObserver(
      (entries) => {
        for (const entry of entries) {
          if (entry.isIntersecting) {
            setActive(entry.target.id);
          }
        }
      },
      { rootMargin: "0px 0px -75% 0px", threshold: 0 }
    );
    ids.forEach((id) => {
      const el = document.getElementById(id);
      if (el) observer.observe(el);
    });
    return () => observer.disconnect();
  }, [groups]);

  return (
    <nav className="space-y-6">
      {groups.map((group) => (
        <div key={group.title}>
          <p className="mb-2 text-xs font-medium uppercase tracking-wide text-muted-foreground">
            {group.title}
          </p>
          <ul className="space-y-0.5 border-l border-border">
            {group.items.map((item) => (
              <li key={item.id}>
                <a
                  href={`#${item.id}`}
                  className={cn(
                    "-ml-px block border-l py-1 pl-3 text-sm transition-colors",
                    active === item.id
                      ? "border-foreground text-foreground"
                      : "border-transparent text-muted-foreground hover:border-muted-foreground hover:text-foreground"
                  )}
                >
                  {item.label}
                </a>
              </li>
            ))}
          </ul>
        </div>
      ))}
    </nav>
  );
}
