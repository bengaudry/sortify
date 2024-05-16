"use client";
import { CtaLink } from "@/components/cta";
import { useRouter } from "next/navigation";
import { useEffect, useRef, useState } from "react";
import { fetchPlaylistDetails } from "@/api/spotify";
import { DraggableTrackList } from "@/components/DraggableTrackList";
import { checkTokenValidity, getToken } from "@/lib/token";

export function PlaylistDetailsPage({ listid }: { listid: string }) {
  const r = useRouter();
  const [playlist, setPlaylist] = useState<Playlist>();
  const [tracksItems, setTracksItems] = useState(playlist?.tracks.items);
  const [isHeaderVisible, setHeaderVisible] = useState(true);
  const header = useRef<HTMLElement>(null);

  useEffect(() => {
    const token = localStorage.getItem("spotify-token");
    if (!token) return r.replace("/?tokenerror=notoken");
    fetchPlaylistDetails(listid, token).then((data) => {
      setPlaylist(data as Playlist);
      setTracksItems((data as Playlist).tracks.items);
    });
  }, []);

  useEffect(() => {}, [tracksItems]);

  const moveSong = (offset: number) => (songIdx: number) => {
    checkTokenValidity({ withRedirect: true });
    if (!tracksItems || !playlist) return;
    fetch(`https://api.spotify.com/v1/playlists/${playlist.id}/tracks`, {
      method: "PUT",
      headers: {
        Authorization: `Bearer ${getToken() as string}`,
      },
      body: JSON.stringify({
        range_start: songIdx,
        insert_before: songIdx + offset,
        range_length: 1,
      }),
    });
  };

  const moveSongUp = moveSong(-1);
  const moveSongDown = moveSong(2);

  useEffect(() => {
    if (!header.current) return;
    const obs = new IntersectionObserver(
      ([entry]) => {
        console.log("is intersecting", entry.isIntersecting);
        setHeaderVisible(entry.isIntersecting);
      },
      { threshold: 0.25 }
    );
    obs.observe(header.current);
    return () => obs.disconnect();
  }, []);

  return (
    <div
      className={`pl-4 py-12 bg-gradient-to-b from-[${playlist?.primary_color}] to-black`}
    >
      <header ref={header}>
        <a href="/playlists" className="block text-spotify-200 mb-4">
          &lt; Back
        </a>
        <div className="pl-2 mb-6 flex flex-row gap-4 items-center">
          <img
            src={playlist?.images[0].url}
            className="w-28 rounded-md bg-neutral-700"
            width={112}
            height={112}
          />
          <div>
            <h1
              className={`${
                !playlist && "h-9 bg-neutral-700 w-24"
              } mb-2 font-bold text-3xl`}
            >
              {playlist?.name}
            </h1>
            <p className="text-spotify-200 text-sm">
              <span>
                By{" "}
                <span
                  className={`${
                    !playlist && "h-4 bg-neutral-700 w-24"
                  } inline-block`}
                >
                  {playlist?.owner.display_name}
                </span>
              </span>
              <span
                className={`${!playlist && "h-4 bg-neutral-700 w-24"} block`}
              >
                {playlist && !playlist.description && "No description provided"}
              </span>
            </p>
          </div>
        </div>

        <CtaLink
          className="my-6"
          href={playlist?.external_urls.spotify}
          target="_blank"
        >
          <img src="/Spotify_Icon_RGB_Black.png" width={22} height={22} />
          Play on Spotify
        </CtaLink>
      </header>

      <div
        className={`fixed w-screen flex justify-between items-center pl-3 pr-9 py-3 z-20 backdrop-blur-lg inset-0 bottom-auto ${
          isHeaderVisible ? "-translate-y-full" : "translate-y-0"
        } transition-transform duration-500`}
      >
        <a href="/playlists" className="flex-1">
          &lt; Back
        </a>
        <div className="flex-1 justify-center flex items-center gap-3">
          <img
            src={playlist?.images[0].url}
            width={32}
            height={32}
            className="rounded-md"
          />
          <span>{playlist?.name}</span>
        </div>
        <div className="flex-1" />
      </div>

      <DraggableTrackList
        tracksItems={tracksItems}
        setTracksItems={setTracksItems}
        moveSongDown={moveSongDown}
        moveSongUp={moveSongUp}
      />
    </div>
  );
}
