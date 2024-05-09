import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Linking Sortify to Spotify",
  description: "",
};

export default function Layout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return children;
}
