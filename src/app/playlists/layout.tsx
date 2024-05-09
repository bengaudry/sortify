import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Sortify - User's playlists",
  description: "",
};

export default function Layout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return children;
}
