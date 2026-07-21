import Link from "next/link";
import { Logo } from "@/components/brand/logo";
import { NavLinks } from "@/components/nav/nav-links";
import { MobileMenu } from "@/components/nav/mobile-menu";
import { ThemeToggle } from "@/components/theme/theme-toggle";

/**
 * 全站導覽列（Server 外殼）。
 * 桌機：Logo + 水平導覽 + 主題鈕；手機（<md）：Logo + 漢堡全屏選單。
 */
export function Nav() {
  return (
    <header className="sticky top-0 z-40 border-b border-border-subtle bg-canvas/90 backdrop-blur">
      <nav
        aria-label="主導覽"
        className="mx-auto flex h-16 max-w-[1200px] items-center justify-between px-4"
      >
        <Link href="/" aria-label="旅美幫首頁">
          <Logo />
        </Link>

        {/* 桌機 */}
        <div className="hidden items-center gap-8 md:flex">
          <NavLinks />
          <ThemeToggle />
        </div>

        {/* 手機 */}
        <div className="md:hidden">
          <MobileMenu />
        </div>
      </nav>
    </header>
  );
}
