"use client";
import { useState } from "react";

export function BackButton({ to }: { to: string }) {
  const [isHovered, setIsHovered] = useState(false);

  return (
    <a
      href={to}
      className="flex gap-2 text-spotify-200 hover:text-spotify-100 transition-colors mb-4"
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
    >
      <i
        className={`inline-block translate-y-0.5 fi fi-rr-angle-left ${
          isHovered ? "-translate-x-1" : "translate-x-0"
        } transition-transform`}
      />
      <span>Back</span>
    </a>
  );
}
