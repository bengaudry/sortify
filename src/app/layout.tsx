import type { Metadata } from "next";
import { Analytics } from "@vercel/analytics/react";
import "./globals.css";
import "@flaticon/flaticon-uicons/css/regular/rounded.css";

export const metadata: Metadata = {
  title: "Sortify",
  description: "Sortify, a playlist organizer for spotify.",
  icons: "/icon-rounded.svg",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body>
        <Analytics />
        {children}
      </body>
    </html>
  );
}
