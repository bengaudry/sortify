"use client";
import { CtaLink } from "@/components/cta";
import { useRouter } from "next/navigation";
import { useEffect, useRef, useState } from "react";
import { fetchPlaylistDetails } from "@/api/spotify";

const formatMsDuration = (duration_ms: number): string => {
  let seconds = Math.floor(duration_ms / 1000);
  let minutes = Math.floor(seconds / 60);
  seconds -= 60 * minutes;
  return `${minutes}m${seconds}s`;
};

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

  const getAllUris = (items: PlaylistTrackObject[]) => {
    const uris: string[] = [];
    items.map((item) => uris.push(item.track.uri));
    return uris;
  };

  useEffect(() => {}, [tracksItems]);

  const moveSongUp = (songIdx: number) => {
    if (!tracksItems || !playlist) return;
    console.log("editing playlist");
    fetch(`https://api.spotify.com/v1/playlists/${playlist.id}/tracks`, {
      method: "PUT",
      headers: {
        Authorization: `Bearer ${localStorage.getItem("spotify-token")}`,
      },
      body: JSON.stringify({
        range_start: songIdx,
        insert_before: songIdx - 1,
        range_length: 1,
      }),
    })
      .then((res) => res.json())
      .then((data) => console.log(data));
  };

  const moveSongDown = (songIdx: number) => {
    if (!tracksItems || !playlist) return;
    console.log("editing playlist");
    fetch(`https://api.spotify.com/v1/playlists/${playlist.id}/tracks`, {
      method: "PUT",
      headers: {
        Authorization: `Bearer ${localStorage.getItem("spotify-token")}`,
      },
      body: JSON.stringify({
        range_start: songIdx,
        insert_before: songIdx + 2,
        range_length: 1,
      }),
    })
      .then((res) => res.json())
      .then((data) => console.log(data));
  };

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
      className={`pl-4 pr-6 py-12 bg-gradient-to-b from-[${playlist?.primary_color}] to-black`}
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
        className={`fixed w-screen flex justify-between items-center px-3 py-3 backdrop-blur-lg inset-0 bottom-auto ${
          isHeaderVisible ? "-translate-y-full" : "translate-y-0"
        } transition-transform duration-500`}
      >
        <a href="/playlists" className="flex-1">
          &lt; Back
        </a>
        <div className="flex-1 justify-center flex items-center gap-3">
          <img src={playlist?.images[0].url} width={32} height={32} className="rounded-md" />
          <span>{playlist?.name}</span>
        </div>
        <div className="flex-1" />
      </div>

      <div className="flex flex-col gap-4">
        {tracksItems?.map((track, idx) => (
          <TrackDisplayer
            idx={idx}
            track={track.track}
            onup={() => {
              setTracksItems((prev) => {
                const newarr = prev?.filter((_, i) => i !== idx);
                newarr?.splice(idx - 1, 0, track);
                moveSongUp(idx);
                return newarr;
              });
            }}
            ondown={() => {
              setTracksItems((prev) => {
                const newarr = prev?.filter((_, i) => i !== idx);
                newarr?.splice(idx + 1, 0, track);
                moveSongDown(idx);
                return newarr;
              });
            }}
          />
        ))}
      </div>
    </div>
  );
}

function TrackDisplayer({
  idx,
  track,
  onup,
  ondown,
}: {
  idx: number;
  track: Track;
  onup: () => void;
  ondown: () => void;
}) {
  return (
    <div className="flex flex-row justify-between gap-2">
      <div className="flex flex-row items-center">
        <span className="text-white/50 w-4 text-right mr-2">{idx + 1}</span>
        <div className="flex flex-col">
          <button
            onClick={onup}
            className="flex-1 w-6 text-spotify-200 hover:text-spotify-100 hover:scale-150 transition-all"
          >
            ⭡
          </button>
          <button
            onClick={ondown}
            className="flex-1 w-6 text-spotify-200 hover:text-spotify-100 hover:scale-150 transition-all"
          >
            ⭣
          </button>
        </div>
        <img
          src={track.album.images[0].url}
          className="h-12 aspect-square rounded-sm mr-2 bg-neutral-600"
          width={48}
          height={48}
        />
        <div className="flex flex-col">
          <span className="font-medium">{track.name}</span>
          <span className="text-spotify-200 text-sm">
            {track.explicit && (
              <span className="inline-grid place-content-center h-4 text-medium bg-spotify-200/50 text-spotify-900 font-semibold mr-1 rounded-sm aspect-square text-sm">
                E
              </span>
            )}
            {track.artists.map((artist, idx) => {
              if (idx === track.artists.length - 1) return artist.name;
              return artist.name + ", ";
            })}
          </span>
        </div>
      </div>
      <div className="flex flex-col items-end justify-center">
        <span className="text-spotify-200 text-xs">
          {formatMsDuration(track.duration_ms)}
        </span>
      </div>
    </div>
  );
}
