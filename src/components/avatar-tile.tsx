import Image from "next/image";
import { avatars, type AvatarId } from "@/data/avatars";
import { cn } from "@/lib/cn";

export function AvatarTile({
  avatarId,
  selected = false,
  size = "md",
  className,
}: {
  avatarId: AvatarId;
  selected?: boolean;
  size?: "sm" | "md" | "lg";
  className?: string;
}) {
  const avatar = avatars.find((item) => item.id === avatarId) ?? avatars[0];
  const imageSize = size === "lg" ? 96 : size === "sm" ? 56 : 72;

  return (
    <div
      className={cn(
        "border-4 border-ink bg-white p-2 text-center font-black shadow-[4px_4px_0_#111]",
        selected && "bg-party-yellow",
        className,
      )}
    >
      <div
        className="relative mx-auto mb-2 overflow-hidden border-4 border-ink bg-party-yellow"
        style={{ width: imageSize, height: imageSize }}
      >
        <Image
          alt={avatar.name}
          className="object-cover"
          fill
          sizes={`${imageSize}px`}
          src={avatar.file}
        />
      </div>
      <p className="truncate text-sm">{avatar.name}</p>
    </div>
  );
}
