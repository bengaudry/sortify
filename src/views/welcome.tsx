"use client";
import { signInWithSpotify } from "@/api/spotify";
import { CtaButton } from "@/components/cta";
import { Toast, ToastContainer } from "@/components/toast";
import { checkTokenValidity } from "@/lib/token";
import { useSearchParams } from "next/navigation";
import { useRouter } from "next/navigation";
import { useEffect } from "react";

export function WelcomePage() {
  const params = useSearchParams();
  const err = params.get("error");
  const { push } = useRouter();

  useEffect(() => {
    if (checkTokenValidity()) push("/playlists");
  }, []);

  return (
    <>
      <ToastContainer>
        {err && (
          <Toast
            title={
              err === "token_expired"
                ? "Token has expired"
                : "Linking was not successful"
            }
            message={
              err === "aborted"
                ? "Linking with spotify has been aborted. Please click on Accept button to continue."
                : err === "token_expired"
                ? "The linking to your Spotify account has ended. Please connect again"
                : "Error while linking to Spotify. Please try again or contact the dev"
            }
            type="error"
          />
        )}
      </ToastContainer>
      <main className="flex flex-col justify-between h-screen w-full bg-gradient-to-b from-spotify-800 to-spotify-900">
        <header className="flex flex-row p-4 gap-2">
          <img src="/images/icon-rounded.svg" width={28} height={28} />
          <h3 className="text-lg text-spotify-100/80">Sortify</h3>
        </header>

        <div className="flex flex-col items-center gap-4 sm:gap-8">
          <h1 className="text-3xl sm:text-5xl font-bold">
            Let's get started !
          </h1>
          <CtaButton onClick={signInWithSpotify}>
            <img
              src="/Spotify_Icon_RGB_Black.png"
              className="w-7 aspect-square"
              width={28}
              height={28}
            />
            <span>Sign in with spotify</span>
          </CtaButton>
        </div>

        <footer className="text-center pt-4 pb-8 border-t-2 border-white/10 text-spotify-200/50">
          <span>© {new Date().getFullYear()} Ben Gaudry</span>
          <br />
          <div className="flex items-center gap-4 justify-center">
            <a href="/legal">Legal notice</a>
            <a
              className="text-spotify-500 font-medium"
              href="https://github.com/bengaudry/sortify"
              target="_blank"
            >
              See on GitHub &gt;
            </a>
          </div>
        </footer>
      </main>
    </>
  );
}
