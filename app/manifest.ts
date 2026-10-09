import type { MetadataRoute } from "next";

export default function manifest(): MetadataRoute.Manifest {
  return {
    name: "DIKOR · Custom 3D-Printed Keepsakes",
    short_name: "DIKOR",
    description: "Custom decor, gifts & 3D creations — made with precision.",
    start_url: "/",
    display: "standalone",
    background_color: "#FAF5EC",
    theme_color: "#FAF5EC",
    icons: [
      { src: "/icon", sizes: "512x512", type: "image/png", purpose: "any" },
      { src: "/apple-icon", sizes: "180x180", type: "image/png", purpose: "any" },
    ],
  };
}
