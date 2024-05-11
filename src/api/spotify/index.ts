import { navigate } from "@/lib/navigate";

const CLIENT_ID = process.env.SPOTIFY_CLIENT_ID;
const REDIRECT_URI = process.env.NODE_ENV === "development"
  ? "http://localhost:3000/callback"
  : "https://websortify.vercel.app/callback";

export const signInWithSpotify = async () => {
  console.log("here");
  if (!CLIENT_ID) {
    return console.log("client id not found");
  }
  redirectToAuthCodeFlow(CLIENT_ID);
};

export async function redirectToAuthCodeFlow(clientId: string) {
  const verifier = generateCodeVerifier(128);
  const challenge = await generateCodeChallenge(verifier);

  localStorage.setItem("verifier", verifier);

  const params = new URLSearchParams();
  params.append("client_id", clientId);
  params.append("response_type", "code");
  params.append("redirect_uri", REDIRECT_URI);
  params.append(
    "scope",
    "user-read-private user-read-email playlist-read-private playlist-modify-private playlist-modify-public"
  );
  params.append("code_challenge_method", "S256");
  params.append("code_challenge", challenge);

  navigate(`https://accounts.spotify.com/authorize?${params.toString()}`);
}

function generateCodeVerifier(length: number) {
  let text = "";
  let possible =
    "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789";

  for (let i = 0; i < length; i++) {
    text += possible.charAt(Math.floor(Math.random() * possible.length));
  }
  return text;
}

async function generateCodeChallenge(codeVerifier: string) {
  const data = new TextEncoder().encode(codeVerifier);
  const digest = await window.crypto.subtle.digest("SHA-256", data);
  return btoa(String.fromCharCode.apply(null, [...new Uint8Array(digest)]))
    .replace(/\+/g, "-")
    .replace(/\//g, "_")
    .replace(/=+$/, "");
}

export async function getAccessToken(code: string) {
  if (!CLIENT_ID) return { access_token: null, expires_in: -1 };
  const verifier = localStorage.getItem("verifier");

  const params = new URLSearchParams();
  params.append("client_id", CLIENT_ID);
  params.append("grant_type", "authorization_code");
  params.append("code", code);
  params.append("redirect_uri", REDIRECT_URI);
  params.append("code_verifier", verifier!);

  const result = await fetch("https://accounts.spotify.com/api/token", {
    method: "POST",
    headers: { "Content-Type": "application/x-www-form-urlencoded" },
    body: params,
  });

  const { access_token, token_type, expires_in, refresh_token, scope } =
    await result.json();
  return { access_token, expires_in } as {
    access_token: string;
    expires_in: number;
  };
}

export async function fetchProfile(token: string): Promise<UserProfile> {
  const result = await fetch("https://api.spotify.com/v1/me", {
    method: "GET",
    headers: { Authorization: `Bearer ${token}` },
  });

  return await result.json();
}

export async function fetchUsersPlaylists(
  token: string
): Promise<any> {
  return await fetch(`https://api.spotify.com/v1/me/playlists`, {
    method: "GET",
    headers: { Authorization: `Bearer ${token}` },
  });
}

export async function fetchPlaylistDetails(listid: string, token: string) {
  return new Promise((resolve, reject) => {
    fetch(`https://api.spotify.com/v1/playlists/${listid}`, {
      method: "GET",
      headers: { Authorization: `Bearer ${token}` },
    })
      .then((json) => json.json())
      .then((data) => {
        if ("error" in data) reject(data.error);
        console.log(data);
        resolve(data);
      })
      .catch(reject);
  });
}
