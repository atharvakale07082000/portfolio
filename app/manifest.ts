import type { MetadataRoute } from "next";
import { profile } from "@/lib/content";

export default function manifest(): MetadataRoute.Manifest {
    return {
        name: `${profile.name} — ${profile.role}`,
        short_name: profile.firstName,
        description: profile.statement,
        start_url: "/",
        display: "standalone",
        background_color: "#000000",
        theme_color: "#0071E3",
        icons: [
            { src: "/icon", sizes: "64x64", type: "image/png" },
            { src: "/apple-icon", sizes: "180x180", type: "image/png" },
        ],
    };
}
