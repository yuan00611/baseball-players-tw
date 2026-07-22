import type { MetadataRoute } from "next";
import { SITE } from "@/lib/site";
import { allSlugs } from "@/lib/players";

/** 路由 sitemap。主地圖在首頁 `/`；含每位選手頁。 */
export default function sitemap(): MetadataRoute.Sitemap {
  const lastModified = new Date();
  const routes = ["", "/players", "/media", "/about"];
  const staticEntries = routes.map((path) => ({
    url: `${SITE.url}${path}`,
    lastModified,
    changeFrequency: "weekly" as const,
    priority: path === "" ? 1 : 0.7,
  }));
  const playerEntries = allSlugs().map((slug) => ({
    url: `${SITE.url}/players/${slug}`,
    lastModified,
    changeFrequency: "weekly" as const,
    priority: 0.6,
  }));
  return [...staticEntries, ...playerEntries];
}
