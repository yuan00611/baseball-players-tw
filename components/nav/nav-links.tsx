"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { NAV_ITEMS } from "@/components/nav/nav-items";
import { cn } from "@/lib/utils";

/** 桌機水平導覽；active 態用 --brand-accent + aria-current */
export function NavLinks({ className }: { className?: string }) {
  const pathname = usePathname();

  return (
    <ul className={cn("flex items-center gap-6", className)}>
      {NAV_ITEMS.map((item) => {
        const isActive =
          pathname === item.href || pathname.startsWith(`${item.href}/`);
        return (
          <li key={item.href}>
            <Link
              href={item.href}
              aria-current={isActive ? "page" : undefined}
              className={cn(
                "text-sm font-medium transition-colors hover:text-accent-text",
                isActive ? "text-accent-text" : "text-text",
              )}
            >
              {item.label}
            </Link>
          </li>
        );
      })}
    </ul>
  );
}
