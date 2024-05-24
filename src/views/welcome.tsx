"use client";
import { signInWithSpotify } from "@/api/spotify";
import { CtaButton } from "@/components/cta";
import { Footer } from "@/components/Footer";
import { Toast, ToastContainer } from "@/components/toast";
import { TroubleshootingCarousel } from "@/components/TroubleshootingCarousel";
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
      <main className="bg-gradient-to-b from-spotify-800 to-spotify-900">
        <header className="fixed z-40 top-0 w-full flex flex-row p-4 gap-2 bg-spotify-800">
          <img src="/image/icon-rounded.svg" width={28} height={28} />
          <h3 className="text-lg text-spotify-100/80">Sortify</h3>
        </header>

        <div className=" min-h-screen grid place-content-center justify-center gap-4 sm:gap-8">
          <div className="flex flex-col gap-4 sm:gap-8 items-center">
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
        </div>

        <section className="h-fit py-12 flex flex-col items-center bg-spotify-700">
          <h2 className="text-3xl font-semibold my-3">Troubleshooting</h2>
          <p className="text-spotify-200 mb-9">
            If your changes do not appear on Spotify, please proceed as
            following :
          </p>
          <TroubleshootingCarousel />
        </section>

        <div />
      </main>
      <Footer />
    </>
  );
}
