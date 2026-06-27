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
        <circle
          cx="10.5"
          cy="10.5"
          r="6.5"
          stroke="currentColor"
          strokeWidth="2"
        />
        <path
          d="M15.5 15.5L21 21"
          stroke="currentColor"
          strokeWidth="2"
          strokeLinecap="round"
        />
      </svg>
      <span className="text-[15px] font-semibold tracking-tight">
        websearch<span className="text-muted-foreground">-sdk</span>
      </span>
    </span>
  );
}
