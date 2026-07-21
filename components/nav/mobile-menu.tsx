"use client";

import * as React from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { Dialog as DialogPrimitive } from "radix-ui";
import { Menu, X } from "lucide-react";
import { NAV_ITEMS } from "@/components/nav/nav-items";
import { ThemeToggle } from "@/components/theme/theme-toggle";
import { Logo } from "@/components/brand/logo";
import { cn } from "@/lib/utils";

/**
 * 手機全屏選單。用 Radix Dialog primitives（非 shadcn 置中版）做全屏 overlay，
 * 內建 focus trap / Esc 關閉 / scroll-lock。點連結後自動關閉。
 */
export function MobileMenu() {
  const [open, setOpen] = React.useState(false);
  const pathname = usePathname();

  return (
    <DialogPrimitive.Root open={open} onOpenChange={setOpen}>
      <DialogPrimitive.Trigger asChild>
        <button
          type="button"
          aria-label="開啟選單"
          className="inline-flex size-10 items-center justify-center rounded-md text-text hover:bg-surface"
        >
          <Menu className="size-6" />
        </button>
      </DialogPrimitive.Trigger>

      <DialogPrimitive.Portal>
        <DialogPrimitive.Overlay className="fixed inset-0 z-50 bg-black/40" />
        <DialogPrimitive.Content className="fixed inset-0 z-50 flex flex-col bg-canvas p-4 outline-none">
          <DialogPrimitive.Title className="sr-only">
            主導覽選單
          </DialogPrimitive.Title>

          <div className="flex h-14 items-center justify-between">
            <Logo />
            <DialogPrimitive.Close asChild>
              <button
                type="button"
                aria-label="關閉選單"
                className="inline-flex size-10 items-center justify-center rounded-md text-text hover:bg-surface"
              >
                <X className="size-6" />
              </button>
            </DialogPrimitive.Close>
          </div>

          <nav aria-label="手機主導覽" className="mt-6 flex-1">
            <ul className="flex flex-col gap-1">
              {NAV_ITEMS.map((item) => {
                const isActive =
                  pathname === item.href ||
                  pathname.startsWith(`${item.href}/`);
                return (
                  <li key={item.href}>
                    <Link
                      href={item.href}
                      onClick={() => setOpen(false)}
                      aria-current={isActive ? "page" : undefined}
                      className={cn(
                        "block rounded-md px-3 py-3 font-sans text-2xl font-bold transition-colors",
                        isActive
                          ? "text-accent-text"
                          : "text-text hover:bg-surface",
                      )}
                    >
                      {item.label}
                    </Link>
                  </li>
                );
              })}
            </ul>
          </nav>

          <div className="border-t border-border-subtle pt-4">
            <ThemeToggle />
          </div>
        </DialogPrimitive.Content>
      </DialogPrimitive.Portal>
    </DialogPrimitive.Root>
  );
}
