import type { MetadataRoute } from "next";

export default function robots(): MetadataRoute.Robots {
  return {
    rules: [
      {
        userAgent: "*",
        allow: ["/", "/privacy", "/terms"],
        disallow: ["/studio", "/api/"],
      },
    ],
    sitemap: "https://photosphere.2xxn.dev/sitemap.xml",
    host: "https://photosphere.2xxn.dev",
  };
}
