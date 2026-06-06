import { cn } from "@/lib/cn";

export function Card({
  className,
  children,
}: Readonly<{
  className?: string;
  children: React.ReactNode;
}>) {
  return (
    <div className={cn("border-4 border-ink shadow-[8px_8px_0_#111]", className)}>
      {children}
    </div>
  );
}
