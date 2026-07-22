import Link from "next/link";
import { Logo } from "@/components/brand/logo";
import { SocialLinks } from "@/components/footer/social-links";
import { NewsletterForm } from "@/components/footer/newsletter-form";
import { SITE } from "@/lib/site";

const SITEMAP_LINKS = [
  { href: "/", label: "地圖" },
  { href: "/players", label: "選手" },
  { href: "/media", label: "媒體牆" },
  { href: "/about", label: "關於" },
  { href: "/about#sponsors", label: "贊助我們" },
];

/** 全站頁尾（Server）。三欄：品牌／網站地圖／社群＋電子報，手機堆疊。 */
export function Footer() {
  return (
    <footer className="mt-16 border-t border-border-subtle bg-surface">
      <div className="mx-auto grid max-w-[1200px] gap-10 px-4 py-12 md:grid-cols-3">
        {/* 1. 品牌 */}
        <div>
          <Logo />
          <p className="mt-3 max-w-xs text-sm text-text-muted">
            {SITE.tagline}
          </p>
        </div>

        {/* 2. 網站地圖 */}
        <nav aria-label="網站地圖">
          <h2 className="mb-3 font-sans text-sm font-bold text-text">
            網站地圖
          </h2>
          <ul className="flex flex-col gap-2">
            {SITEMAP_LINKS.map((item) => (
              <li key={item.label}>
                <Link
                  href={item.href}
                  className="text-sm text-text-muted transition-colors hover:text-accent-text"
                >
                  {item.label}
                </Link>
              </li>
            ))}
          </ul>
        </nav>

        {/* 3. 社群 + 電子報 */}
        <div>
          <h2 className="mb-3 font-sans text-sm font-bold text-text">
            追蹤旅美幫
          </h2>
          <SocialLinks />
          <div className="mt-5">
            <NewsletterForm />
          </div>
        </div>
      </div>

      <div className="border-t border-border-subtle">
        <p className="mx-auto max-w-[1200px] px-4 py-5 text-sm text-text-muted">
          © 2026 旅美幫 MLBTW.NET
        </p>
      </div>
    </footer>
  );
}
