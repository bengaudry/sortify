"use client";

import { useRouter } from "next/navigation";
import { useEffect } from "react";

export function SignOutPage() {
  const router = useRouter();

  useEffect(() => {
    localStorage.removeItem("spotify-token");
    localStorage.removeItem("spotify-token-expiration");
    setTimeout(() => router.push("/"), 1000);
  }, []);

  return (
    <div className="w-screen h-screen grid place-content-center">
      Signing out...
    </div>
  );
}
