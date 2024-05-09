"use client";
import { getAccessToken } from "@/api/spotify";
import { useRouter, useSearchParams } from "next/navigation";
import { useEffect } from "react";

export function CallbackPage() {
  const params = useSearchParams();
  const code = params.get("code");
  const error = params.get("error");
  const { push } = useRouter();
  //const { push } = { push: (v: string) => {}}

  useEffect(() => {
    if (error) push("/?error=" + error);
  }, [error]);

  const fetchUserData = () => {
    if (!code) return push("/");
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
        console.error("Error while fetching token :", err);
        push("/?error=Failed%20to%20authenticate%20with%20Spotify.%20" + err);
      });
  };
  useEffect(fetchUserData, []);

  return (
    <div className="grid place-content-center w-full h-screen">
      Connecting to Spotify...
    </div>
  );
}
