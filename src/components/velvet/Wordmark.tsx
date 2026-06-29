import { cn } from "@/lib/utils";

export function Wordmark({
  className,
  small = false,
}: {
  className?: string;
  small?: boolean;
}) {
  return (
    <span
      className={cn(
        "wordmark text-bone whitespace-nowrap",
        small ? "text-[0.72rem] tracking-[0.42em]" : "tracking-[0.5em]",
        className
      )}
    >
      Velvet&nbsp;Rouge
    </span>
  );
}
