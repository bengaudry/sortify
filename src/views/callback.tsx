"use client";
import { getAccessToken } from "@/api/spotify";
import { useRouter, useSearchParams } from "next/navigation";
import { useEffect } from "react";

export function CallbackPage() {
  const params = useSearchParams();
  const code = params.get("code");
  const error = params.get("error");
  const { push } = useRouter();

  useEffect(() => {
    if (error) push("/?error=aborted");
  }, [error]);

  const fetchUserData = () => {
    if (!code) return push("/?error=aborted");
    getAccessToken(code)
      .then(({ access_token, expires_in }) => {
        if (!access_token) throw new Error("Token is undefined");
        localStorage.setItem("spotify-token", access_token);
        localStorage.setItem(
          "spotify-token-expiration",
          (expires_in * 1000 + Date.now()).toString()
        );
        push("/playlists");
      })
      .catch((err) => {
        push("/?error=token_error");
      });
  };
  useEffect(fetchUserData, []);

  return (
    <div className="grid place-content-center w-full h-screen">
      Linking to Spotify...
    </div>
  );
}
