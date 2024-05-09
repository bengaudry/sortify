interface UserProfile {
  country: string;
  display_name: string;
  email: string;
  explicit_content: {
    filter_enabled: boolean;
    filter_locked: boolean;
  };
  external_urls: ExternalUrls;
  followers: { href: string; total: number };
  href: string;
  id: string;
  images: Image[];
  product: string;
  type: string;
  uri: string;
}

interface Image {
  url: string;
  height: number;
  width: number;
}

interface Playlist {
  collaborative: boolean;
  description: string;
  external_urls: {
    spotify: string;
  };
  href: string;
  id: string;
  images: Array<Image>;
  name: string;
  owner: {
    display_name: string;
    external_urls: ExternalUrls;
    href: string;
    id: string;
    type: string;
    uri: string;
  };
  primary_color: string | null;
  public: boolean;
  snapshot_id: string;
  tracks: {
    href: string;
    limit?: number;
    next?: string;
    offset?: number;
    previous?: string;
    total: number;
    items?: Array<PlaylistTrackObject>;
  };
  type: string;
  uri: string;
}

interface PlaylistTrackObject {
  added_at: DateString;
  added_by: any;
  is_local: boolean;
  track: Track;
}

interface Track {
  album: Album;
  artists: Array<Artist>;
  duration_ms: number;
  explicit: boolean;
  external_urls: ExternalUrls;
  href: string;
  id: string;
  is_playable: boolean;
  name: string;
  popularity: number;
  preview_url: string | null;
  uri: string;
  is_local: boolean;
}

interface Artist {
  genres: Array<string>;
  href: string;
  id: string;
  images: Array<Image>;
  name: string;
  popularity: number;
  uri: string;
}

interface Album {
  album_type: string;
  total_tracks: number;
  available_markets: Array<string>;
  external_urls: ExternalUrls;
  href: string;
  id: string;
  images: Array<Image>;
  name: string;
  release_date: string;
  release_date_precision: "year" | "month" | "day";
  type: string;
  uri: string;
  artists: Array<{ href: string; name: string; type: string; uri: string }>;
}

type ExternalUrls = { spotify: string };
