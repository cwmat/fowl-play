import { HostGame } from "@/components/host-game";

export default function HostPage() {
  const siteUrl = process.env.NEXT_PUBLIC_SITE_URL ?? "http://localhost:3000";

  return <HostGame siteUrl={siteUrl} />;
}
