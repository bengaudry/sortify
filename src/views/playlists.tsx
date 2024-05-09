"use client";
import { fetchProfile, fetchUsersPlaylists } from "@/api/spotify";
import { CtaLink } from "@/components/cta";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";

export function PlaylistsPage () {
  const [profile, setProfile] = useState<UserProfile | null>(null);
  const [playlists, setPlaylists] = useState<Array<Playlist>>([]);

  const { replace } = useRouter();

  const fetchUserData = () => {
    const token = localStorage.getItem("spotify-token");
    if (!token) return replace("/");
    fetchProfile(token)
      .then((p) => {
        setProfile(p);
        setPlaylists([]);
        fetchUsersPlaylists(p.id as string, token)
          .then((lists) => lists.json())
          .then(({ items }) => setPlaylists(items))
          .catch((err) =>
            console.error("Error while fetching users playlists :", err)
          );
      })
      .catch((err) => console.error("Error while fetching profile :", err));
  };

  useEffect(() => {
    fetchUserData();
  }, []);

  return (
    <main className="px-6 py-12">
      {profile ? (
        <>
          <div className="flex flex-col sm:flex-row items-start justify-between">
            <div className="flex flex-row gap-6 items-center overflow-y-scroll">
              <div
                style={{ backgroundImage: `url("${profile?.images[profile?.images.length-1].url}")` }}
                className="block w-28 sm:w-32 aspect-square bg-center bg-cover bg-no-repeat rounded-full"
              />
              <div>
                <p className="text-3xl sm:text-5xl font-bold">
                  {profile?.display_name}
                </p>
                <p className="text-sm sm:text-base text-spotify-200">
                  {profile?.followers.total} followers
                </p>
              </div>
            </div>

            <div className="flex flex-row items-center sm:flex-col sm:items-end gap-4 mt-6">
              <CtaLink
                href={profile?.external_urls.spotify}
                target="_blank"
                className="text-green-600 font-semibold"
              >
                <img
                  src="/Spotify_Icon_RGB_Black.png"
                  className="w-6 aspect-square"
                  width={24}
                  height={24}
                />
                <span>Open Spotify</span>
              </CtaLink>
              <button
                className="block w-fit bg-neutral-700 hover:bg-red-600 px-4 py-1 rounded-full text-sm font-medium text-spotify-100"
                onClick={() => {
                  localStorage.removeItem("spotify-token");
                  replace("/")
                }}
              >
                Sign out
              </button>
            </div>
          </div>

          <div>
            <h2 className="font-semibold text-2xl mt-12 mb-4">
              Your playlists
            </h2>
            <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-4">
              {playlists &&
                playlists.map((list, idx) => (
                  <a
                    key={idx}
                    href={`playlistdetails/${list.id}`}
                    className="flex flex-col items-start gap-2 border-white/10 border-2 bg-white/5 hover:bg-white/10 p-5 rounded-xl transition-colors duration-300"
                  >
                    <img src={list.images[0].url} className="rounded-lg" />
                    <div>
                      <span className="capitalize font-medium">
                        {list.name}
                      </span>
                      <br />
                      <span className="text-spotify-200">
                        {list.tracks.total} tracks
                      </span>
                    </div>
                  </a>
                ))}
            </div>
          </div>
        </>
      ) : (
        <div className="w-screen h-screen grid place-content-center">
          <span>Loading...</span>
          <a href="/" className="block text-spotify-200 mb-4">&lt; Back</a>
        </div>
      )}
    </main>
  );
}
