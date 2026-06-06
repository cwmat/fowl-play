import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import { ButtonSfx } from "@/components/button-sfx";
import "./globals.css";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "FOWL PLAY",
  description: "A bird-brained party quiz for phones and the living room TV.",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html
      lang="en"
      className={`${geistSans.variable} ${geistMono.variable} h-full antialiased`}
    >
      <body className="min-h-full flex flex-col">
        <ButtonSfx />
        {children}
      </body>
    </html>
  );
}
