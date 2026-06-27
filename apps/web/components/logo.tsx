import { cn } from "@/lib/utils";

export function Logo({ className }: { className?: string }) {
  return (
    <span className={cn("inline-flex items-center gap-2", className)}>
      <svg
        width="22"
        height="22"
        viewBox="0 0 24 24"
        fill="none"
        xmlns="http://www.w3.org/2000/svg"
        className="text-foreground"
        aria-hidden="true"
      >
        <path
          fill="none"
          stroke="currentColor"
          strokeLinecap="round"
          strokeLinejoin="round"
          strokeWidth="2"
          d="M3 12h5m-5 0a9 9 0 0 0 9 9m-9-9a9 9 0 0 1 9-9m-4 9h8m-8 0c0 4.97 1.79 9 4 9m-4-9c0-4.97 1.79-9 4-9m4 9h5m-5 0c0-4.97-1.79-9-4-9m4 9c0 4.97-1.79 9-4 9m9-9a9 9 0 0 0-9-9m9 9a9 9 0 0 1-9 9"
        />
      </svg>
      <span className="text-[15px] font-semibold leading-none tracking-tight">
        search<span className="text-muted-foreground">-sdk</span>
      </span>
    </span>
  );
}
