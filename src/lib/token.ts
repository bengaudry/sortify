"use client";
import { redirect } from "next/navigation";

/** Checks in local storage if the token exists and is still valid. */
export function checkTokenValidity(opt?: {
  withRedirect?: boolean;
  redirectOptions?: { url?: string; error?: string };
}): boolean {
  const token = getToken();
  const expires_at = localStorage.getItem("spotify-token-expiration");
  const now = Date.now();

  if (token && expires_at && now < parseInt(expires_at)) return true;

  deleteToken();
  if (opt?.withRedirect) {
    redirect(
      `${opt?.redirectOptions?.url ?? "/"}?error=${
        opt?.redirectOptions?.error ?? "token_expired"
      }`
    );
  }
  return false;
}

/** Gets the token in local storage and returns it, or returns null if the token doesn't exist */
export function getToken(): string | null {
  const token = localStorage.getItem("spotify-token");
  if (!token) return null;
  return token as string;
}

/** Deletes the token cookie in local storage */
export function deleteToken(): void {
  localStorage.removeItem("spotify-token");
  localStorage.removeItem("spotify-token-expiration");
}
