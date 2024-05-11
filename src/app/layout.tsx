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
      <head>
        <meta
          name="google-site-verification"
          content="qahsQX4WivRzCsj09PgkH6eyxiPYZeruTfqmHj2kSBM"
        />
      </head>
      <body>
        <Analytics />
        {children}
      </body>
    </html>
  );
}
