import type { MetadataRoute } from "next";
import { SITE } from "@/lib/site";

/** 靜態路由 sitemap（M1）。M4 之後再加入每位選手 URL。 */
export default function sitemap(): MetadataRoute.Sitemap {
  const routes = ["", "/map", "/players", "/media", "/about"];
  const lastModified = new Date();
  return routes.map((path) => ({
    url: `${SITE.url}${path}`,
    lastModified,
    changeFrequency: "weekly",
    priority: path === "" ? 1 : 0.7,
  }));
}
