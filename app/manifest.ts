import type { MetadataRoute } from "next";

export default function manifest(): MetadataRoute.Manifest {
  return {
    name: "DIKOR · Custom 3D-Printed Keepsakes Atelier",
    short_name: "DIKOR",
    description: "Custom decor, gifts & 3D creations :  made with precision.",
    start_url: "/",
    display: "standalone",
    background_color: "#FAF5EC",
    theme_color: "#FAF5EC",
    icons: [
      { src: "/favicon.svg", sizes: "any", type: "image/svg+xml", purpose: "any" },
    ],
  };
}
