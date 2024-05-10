"use client";
import { fetchProfile, fetchUsersPlaylists } from "@/api/spotify";
import { CtaLink } from "@/components/cta";
import { checkTokenValidity, getToken } from "@/lib/token";
import { useRouter } from "next/navigation";
import { useEffect, useRef, useState } from "react";

export function PlaylistsPage() {
  const { push } = useRouter();
  const [profile, setProfile] = useState<UserProfile | null>(null);
  const [playlists, setPlaylists] = useState<Array<Playlist>>([]);
  const [onlyThisUsersPlaylists, setOnlyThisUsersPlaylists] = useState(true);
  const headerRef = useRef<HTMLDivElement>(null);
  const [headerSticked, setHeaderSticked] = useState(false);

  useEffect(() => {
    console.log("ref", headerRef.current);
    if (!headerRef.current) return;

    const obs = new IntersectionObserver(
      ([entry]) => {
        console.log(entry.intersectionRatio);
        setHeaderSticked(entry.intersectionRatio < 1);
      },
      { threshold: 1 }
    );
    obs.observe(headerRef.current);

    return () => obs.disconnect();
  }, []);

  const fetchUserData = () => {
    checkTokenValidity({ withRedirect: true });
    const token = getToken() as string;
    fetchProfile(token)
      .then((p) => {
        setProfile(p);
        setPlaylists([]);
        fetchUsersPlaylists(token)
          .then((lists) => lists.json())
          .then(({ items }: { items: Array<Playlist> }) => setPlaylists(items))
          .catch((err) =>
            console.error("Error while fetching users playlists :", err)
          );
      })
      .catch((err) => console.error("Error while fetching profile :", err));
  };

  useEffect(() => {
    fetchUserData();
  }, []);

  return profile ? (
    <>
      <div className="absolute blur-3xl -z-10 bg-spotify-500 w-96 aspect-square rounded-full -top-48 -left-36" />
      <main className="px-6 py-12 bg-spotify-900/70">
        <div className="flex flex-col sm:flex-row items-start justify-between">
          <div className="flex flex-row gap-6 items-center overflow-y-scroll">
            <div
              style={{
                backgroundImage: `url("${
                  profile?.images[profile?.images.length - 1].url
                }")`,
              }}
              className="block w-28 sm:w-32 aspect-square bg-center bg-cover bg-no-repeat rounded-full"
            />
            <div>
              <p className="text-3xl sm:text-5xl font-bold">
                {profile?.display_name}
              </p>
              <p className="text-sm sm:text-base text-spotify-200">
                {profile?.followers.total} followers
              </p>
              <button
                className="block w-fit bg-neutral-700 hover:bg-red-600 px-4 py-1 mt-2 rounded-full text-sm font-medium text-spotify-100"
                onClick={() => {
                  push("/signout");
                }}
              >
                Sign out
              </button>
            </div>
          </div>
        </div>

        <div>
          <div
            ref={headerRef}
            className={`block w-screen sticky -translate-x-6 -top-1 mt-7 bg-spotify-900`}
          >
            <div className="relative overflow-hidden">
              <div
                className={`absolute top-0 left-0 right-0 -z-10 w-full h-full ${
                  headerSticked && "backdrop-blur-3xl"
                } bg-transparent`}
              />
              <h2 className="font-semibold text-2xl z-20 py-3 pt-4 px-6">
                Your playlists
              </h2>
            </div>
          </div>

          <CtaLink
            href={profile?.external_urls.spotify}
            target="_blank"
            className="text-green-600 font-semibold mb-3"
          >
            <img
              src="/Spotify_Icon_RGB_Black.png"
              className="w-6 aspect-square"
              width={24}
              height={24}
            />
            <span>Open in Spotify</span>
          </CtaLink>
          <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-3 sm:gap-4">
            {playlists &&
              profile &&
              playlists.map(
                (list, idx) =>
                  onlyThisUsersPlaylists &&
                  list.owner.id === profile.id && (
                    <a
                      key={idx}
                      href={`playlistdetails/${list.id}`}
                      className="flex flex-col items-start gap-2 bg-white/5 hover:bg-white/10 p-2 pb-3 sm:p-3 rounded-xl transition-colors duration-300 overflow-hidden"
                    >
                      <img
                        src={list.images[0].url}
                        className="aspect-square object-cover"
                      />
                      <div className="flex flex-col overflow-hidden px-2 w-full">
                        <span className="capitalize font-medium whitespace-nowrap overflow-hidden	">
                          {list.name}
                        </span>
                        <span className="text-spotify-200 whitespace-nowrap	text-sm">
                          {list.tracks.total} tracks
                        </span>
                        <span className="text-spotify-200 whitespace-nowrap	text-xs">
                          by {list.owner.display_name}
                        </span>
                      </div>
                    </a>
                  )
              )}
          </div>
        </div>
      </main>
    </>
  ) : (
    <div className="w-full h-screen grid place-content-center">
      Loading your playlists
    </div>
  );
}
