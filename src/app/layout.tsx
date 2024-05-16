import type { Metadata } from "next";
import { Analytics } from "@vercel/analytics/react";
import { SpeedInsights } from "@vercel/speed-insights/next"
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
        <meta name="google-adsense-account" content="ca-pub-9717273868571983"></meta>
      </head>
      <body>
        <Analytics />
        <SpeedInsights />
        {children}
      </body>
    </html>
  );
}
