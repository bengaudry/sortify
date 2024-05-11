import { MetadataRoute } from "next";

const URL = "https://websortify.vercel.com";

export default function sitemap(): MetadataRoute.Sitemap {
  return [
    {
      url: URL,
      lastModified: new Date(),
      priority: 1,
    },
    {
      url: URL + "/playlists",
      lastModified: new Date(),
      changeFrequency: "monthly",
      priority: 0.6,
    },
    {
      url: URL + "/playlistdetails",
      lastModified: new Date(),
      changeFrequency: "monthly",
    },
  ];
}
