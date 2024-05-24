import type { Metadata } from "next";
import { Analytics } from "@vercel/analytics/react";
import { SpeedInsights } from "@vercel/speed-insights/next";
import "./globals.css";
import "@flaticon/flaticon-uicons/css/regular/rounded.css";
import "pure-react-carousel/dist/react-carousel.es.css";
import Head from "next/head";

export const metadata: Metadata = {
  title: "Sortify",
  description: "Sortify, a playlist organizer for spotify.",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <Head>
        <meta
          name="google-site-verification"
          content="qahsQX4WivRzCsj09PgkH6eyxiPYZeruTfqmHj2kSBM"
        />
        <meta name="google-adsense-account" content="ca-pub-9717273868571983" />
        <script
          async
          src="https://pagead2.googlesyndication.com/pagead/js/adsbygoogle.js?client=ca-pub-9717273868571983"
          crossOrigin="anonymous"
        />
        <link href="/image/icon-rounded.svg" rel="icon" />
        <link href="/image/icon-rounded.png" rel="icon" />
      </Head>
      <body>
        <Analytics />
        <SpeedInsights />
        {children}
      </body>
    </html>
  );
}
