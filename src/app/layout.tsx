import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "Sortify",
  description: "Sortify, a playlist organizer for spotify.",
  icons: "/icon-rounded.svg"
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body>{children}</body>
    </html>
  );
}
