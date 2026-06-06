"use client";

import { QRCodeSVG } from "qrcode.react";

export function QRCodePanel({
  value,
  label,
}: {
  value: string;
  label: string;
}) {
  return (
    <div className="grid gap-4">
      <div className="grid aspect-square place-items-center border-4 border-ink bg-white p-4 shadow-[6px_6px_0_#111]">
        <QRCodeSVG value={value} size={260} level="M" marginSize={2} />
      </div>
      <div className="border-4 border-ink bg-party-blue p-4 text-center shadow-[5px_5px_0_#111]">
        <p className="text-sm font-black uppercase">Room code</p>
        <p className="text-6xl font-black tracking-[0.12em]">{label}</p>
      </div>
    </div>
  );
}
