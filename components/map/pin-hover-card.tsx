"use client";

import Link from "next/link";
import { X } from "lucide-react";
import type { MapPin } from "@/components/map/map-types";

/** pin 迷你卡：schedule 顯示對戰+台灣時間；homebase 顯示選手+球隊+等級。連個別球員頁。 */
export function PinHoverCard({
  pin,
  onClose,
}: {
  pin: MapPin;
  onClose: () => void;
}) {
  return (
    <div
      role="dialog"
      aria-label="球場資訊"
      className="w-56 rounded-lg border border-border-subtle bg-surface-raised p-3 text-left shadow-[var(--elevation-2)]"
    >
      <div className="flex items-start justify-between gap-2">
        <p className="font-sans text-sm font-bold text-text">
          {pin.variant === "schedule" ? pin.teamName : pin.players?.[0]?.affiliate}
        </p>
        <button
          type="button"
          onClick={onClose}
          aria-label="關閉"
          className="-mr-1 -mt-1 rounded p-1 text-text-muted hover:text-text"
        >
          <X className="size-4" />
        </button>
      </div>

      {pin.variant === "schedule" ? (
        <div className="mt-1 space-y-1 text-sm">
          <p className="text-text">{pin.matchup}</p>
          {pin.venue && (
            <p className="text-text-muted">
              {pin.homeAway} · {pin.venue}
            </p>
          )}
          <p className="text-text-muted">台灣時間 {pin.taiwanTime}</p>
          <p className="text-text-muted">
            {pin.playerName} · {pin.status}
          </p>
          {pin.playerSlug && (
            <Link
              href={`/players/${pin.playerSlug}`}
              className="inline-block pt-1 text-sm font-medium text-accent-text hover:underline"
            >
              看 {pin.playerName} →
            </Link>
          )}
        </div>
      ) : (
        <ul className="mt-1 space-y-1.5 text-sm">
          {pin.players?.map((pl) => (
            <li key={pl.slug}>
              <Link
                href={`/players/${pl.slug}`}
                className="group flex items-center justify-between gap-2"
              >
                <span className="text-text group-hover:text-accent-text">
                  {pl.name}
                  <span className="text-text-muted"> · {pl.level}</span>
                </span>
                <span className="text-accent-text opacity-0 group-hover:opacity-100">
                  →
                </span>
              </Link>
            </li>
          ))}
          {pin.venueApprox && (
            <li className="text-xs text-text-muted">（位置為近似）</li>
          )}
        </ul>
      )}
    </div>
  );
}
