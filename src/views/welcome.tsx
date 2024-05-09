"use client";
import { signInWithSpotify } from "@/api/spotify";
import { CtaButton } from "@/components/cta";
import { Toast, ToastContainer } from "@/components/toast";
import { useSearchParams } from "next/navigation";
import { useRouter } from "next/navigation";
import { useEffect } from "react";

export function WelcomePage () {
  const params = useSearchParams();
  const spotifyError = params.get("error");
  const { push } = useRouter();

  useEffect(() => {
    const token = localStorage.getItem("spotify-token");
    const expires_at = localStorage.getItem("spotify-token-expiration");
    const now = Date.now();

    console.log(expires_at, now, now - parseInt(expires_at ?? "0"));

    if (token && expires_at && now < parseInt(expires_at)) push("/playlists")
    else {
      // Remove old tokens
      localStorage.removeItem("spotify-token");
      localStorage.removeItem("spotify-token-expiration");
    }
  }, []);

  return (
    <main className="grid h-screen place-content-center bg-gradient-to-b from-spotify-900 to-black">
      <ToastContainer>
        {spotifyError && (
          <Toast
            title="Connexion aborted"
            message={spotifyError}
            type="error"
          />
        )}
      </ToastContainer>
      <div className="flex flex-col items-center gap-8">
        <h2 className="text-5xl font-bold">Let's get started !</h2>
        <CtaButton onClick={signInWithSpotify}>
          <img
            src="/Spotify_Icon_RGB_Black.png"
            className="w-6 aspect-square"
            width={24}
            height={24}
          />
          <span>Sign in with spotify</span>
        </CtaButton>
      </div>
    </main>
  );
}
