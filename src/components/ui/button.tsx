import Link from "next/link";
import { cn } from "@/lib/cn";

const sizes = {
  default: "min-h-12 px-4 py-2 text-lg",
  lg: "min-h-14 px-5 py-3 text-xl",
};

type ButtonProps = React.ButtonHTMLAttributes<HTMLButtonElement> & {
  size?: keyof typeof sizes;
};

export function Button({
  className,
  size = "default",
  ...props
}: ButtonProps) {
  return (
    <button
      className={cn(
        "inline-flex items-center justify-center gap-2 border-4 border-ink font-black shadow-[5px_5px_0_#111] transition active:translate-x-1 active:translate-y-1 active:shadow-none",
        sizes[size],
        className,
      )}
      {...props}
    />
  );
}

type ButtonLinkProps = React.ComponentProps<typeof Link> & {
  className?: string;
  size?: keyof typeof sizes;
  children: React.ReactNode;
};

export function ButtonLink({
  className,
  size = "default",
  children,
  ...props
}: ButtonLinkProps) {
  return (
    <Link
      className={cn(
        "inline-flex items-center justify-center gap-2 border-4 border-ink font-black shadow-[5px_5px_0_#111] transition active:translate-x-1 active:translate-y-1 active:shadow-none",
        sizes[size],
        className,
      )}
      {...props}
    >
      {children}
    </Link>
  );
}
