import { cn } from "@/lib/cn";

export function Badge({
  className,
  children,
}: Readonly<{
  className?: string;
  children: React.ReactNode;
}>) {
  return (
    <span
      className={cn(
        "inline-flex border-4 border-ink px-3 py-1 text-sm font-black uppercase shadow-[3px_3px_0_#111]",
        className,
      )}
    >
      {children}
    </span>
  );
}
