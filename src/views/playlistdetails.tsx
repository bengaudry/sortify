"use client";
import { CtaLink } from "@/components/cta";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import { fetchPlaylistDetails } from "@/api/spotify";

const formatMsDuration = (duration_ms: number): string => {
  let seconds = Math.floor(duration_ms / 1000);
  let minutes = Math.floor(seconds / 60);
  seconds -= 60 * minutes;
  return `${minutes}m${seconds}s`;
};

export function PlaylistDetailsPage({listid}: {listid: string}) {
  const r = useRouter();
  const [playlist, setPlaylist] = useState<Playlist>();
  const [tracksItems, setTracksItems] = useState(playlist?.tracks.items);
  const [previewPlaying, setPreviewPlaying] = useState("");

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

  return playlist ? (
    <div
      className={`pl-4 pr-6 py-12 bg-gradient-to-b from-[${playlist?.primary_color}] to-black`}
    >
      <a href="/playlists" className="block text-spotify-200 mb-4">
        &lt; Back
      </a>
      <header className="pl-2 mb-6 flex flex-row gap-4 items-center">
        <img src={playlist?.images[0].url} className="w-28 rounded-md" />
        <div>
          <h1 className="font-bold text-3xl">{playlist?.name}</h1>
          <p className="text-spotify-200">
            By {playlist?.owner.display_name}
            {" • "}
            {playlist?.description || "No description provided"}
          </p>
        </div>
      </header>

      <CtaLink
        className="my-6"
        href={playlist?.external_urls.spotify}
        target="_blank"
      >
        <img src="/Spotify_Icon_RGB_Black.png" width={22} />
        Play on Spotify
      </CtaLink>

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
            onPlay={setPreviewPlaying}
          />
        ))}
      </div>
    </div>
  ) : (
    <div className="w-full h-screen grid place-content-center">
      <span>Loading playlist details...</span>
      <a href="/playlists" className="block text-spotify-200 mb-4">
        &lt; Back
      </a>
    </div>
  );
}

function TrackDisplayer({
  idx,
  track,
  onup,
  ondown,
  onPlay,
}: {
  idx: number;
  track: Track;
  onup: () => void;
  ondown: () => void;
  onPlay: (url: string) => void;
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
          className="h-12 aspect-square rounded-sm mr-2"
        />
        <div className="flex flex-col">
          <span className="font-medium">
            {track.name}{" "}
            {track.explicit && (
              <span className="inline-grid place-content-center h-4 text-medium bg-spotify-200/50 rounded-sm aspect-square text-sm">
                E
              </span>
            )}
          </span>
          <span className="text-spotify-200 text-sm">
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
