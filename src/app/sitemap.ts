import { MetadataRoute } from "next";

const URL = "https://websortify.vercel.app";

export default function sitemap(): MetadataRoute.Sitemap {
  return [
    {
      url: URL,
      lastModified: new Date(),
      priority: 1,
    },
  ];
}
