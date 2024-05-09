"use client";
import { signInWithSpotify } from "@/api/spotify";
import { CtaButton } from "@/components/cta";
import { Toast, ToastContainer } from "@/components/toast";
import { useSearchParams } from "next/navigation";
import { useRouter } from "next/navigation";
import { useEffect } from "react";

export function WelcomePage() {
  const params = useSearchParams();
  const err = params.get("error");
  const { push } = useRouter();

  useEffect(() => {
    const token = localStorage.getItem("spotify-token");
    const expires_at = localStorage.getItem("spotify-token-expiration");
    const now = Date.now();

    if (token && expires_at && now < parseInt(expires_at)) push("/playlists");
    else {
      // Remove old tokens
      localStorage.removeItem("spotify-token");
      localStorage.removeItem("spotify-token-expiration");
    }
  }, []);

  return (
    <>
      <ToastContainer>
        {err && (
          <Toast
            title="Linking was not successfull"
            message={
              err === "aborted"
                ? "Linking with spotify has been aborted. Please click on Accept button to continue."
                : "Error while linking to Spotify. Please try again or contact the dev"
            }
            type="error"
          />
        )}
      </ToastContainer>
      <main className="flex flex-col justify-between h-screen w-full bg-gradient-to-b from-spotify-900 to-black">
        <header className="flex flex-row p-4 gap-2">
          <img src="/icon-rounded.svg" width={28} height={28} />
          <h3 className="text-lg text-spotify-100/80">Sortify</h3>
        </header>

        <div className="flex flex-col items-center gap-4 sm:gap-8">
          <h1 className="text-3xl sm:text-5xl font-bold">
            Let's get started !
          </h1>
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

        <footer className="text-center pt-4 pb-8 border-t-2 border-white/10 text-spotify-200/50">
          <span>© {new Date().getFullYear()} Ben Gaudry</span>
          <br />
          <a className="text-spotify-500 font-medium" href="https://github.com/bengaudry/sortify" target="_blank">See on GitHub &gt;</a>
        </footer>
      </main>
    </>
  );
}
