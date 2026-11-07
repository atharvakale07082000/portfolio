import type { MetadataRoute } from "next";
import { profile } from "@/lib/content";

export default function sitemap(): MetadataRoute.Sitemap {
    const routes = ["", "/about", "/projects", "/experience", "/contact"];
    return routes.map((r) => ({
        url: `${profile.siteUrl}${r}`,
        changeFrequency: "monthly",
        priority: r === "" ? 1 : 0.7,
    }));
}
