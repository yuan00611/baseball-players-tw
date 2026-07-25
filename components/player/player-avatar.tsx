import Image from "next/image";
import { headshotUrl } from "@/lib/headshot";

/**
 * 球員頭像：有 mlbamId → 官方 MLB 頭像（next/image，圓形、object-cover、lazy）；
 * 無 → 沿用字母 avatar fallback。列表與球員頁 hero 共用。
 * sizePx 以 inline style 固定寬高避免 CLS（尺寸為動態值，不走 Tailwind class 以免 purge）。
 */
export function PlayerAvatar({
  name,
  mlbamId,
  sizePx,
  imgSize = 240,
  fallbackTextClassName = "text-lg",
  className = "",
}: {
  name: string;
  mlbamId?: number;
  sizePx: number;
  imgSize?: 120 | 240;
  fallbackTextClassName?: string;
  className?: string;
}) {
  const dims = { width: sizePx, height: sizePx };

  if (mlbamId) {
    return (
      <Image
        src={headshotUrl(mlbamId, imgSize)}
        alt={`${name} 頭像`}
        width={sizePx}
        height={sizePx}
        sizes={`${sizePx}px`}
        style={dims}
        className={`shrink-0 rounded-full bg-surface-raised object-cover ${className}`}
      />
    );
  }

  return (
    <span
      aria-hidden="true"
      style={dims}
      className={`flex shrink-0 items-center justify-center rounded-full bg-brand font-num font-semibold text-on-brand ${fallbackTextClassName} ${className}`}
    >
      {name.charAt(0)}
    </span>
  );
}
