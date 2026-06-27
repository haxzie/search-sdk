"use client";

import * as React from "react";

import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { CodeBlock } from "./code-block";

export interface CodeTab {
  value: string;
  label: string;
  code: string;
  filename?: string;
}

export function CodeTabs({
  tabs,
  className,
}: {
  tabs: CodeTab[];
  className?: string;
}) {
  return (
    <Tabs defaultValue={tabs[0]?.value} className={className}>
      <TabsList className="mb-3 flex-wrap">
        {tabs.map((tab) => (
          <TabsTrigger key={tab.value} value={tab.value}>
            {tab.label}
          </TabsTrigger>
        ))}
      </TabsList>
      {tabs.map((tab) => (
        <TabsContent key={tab.value} value={tab.value}>
          <CodeBlock code={tab.code} filename={tab.filename} />
        </TabsContent>
      ))}
    </Tabs>
  );
}
