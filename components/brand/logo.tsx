import { SITE } from "@/lib/site";
import { cn } from "@/lib/utils";

/** 手繪棒球圖示（縫線用 brand 紅），綁 token；之後可換正式向量稿 */
export function BaseballIcon({
  className,
  size = 28,
}: {
  className?: string;
  size?: number;
}) {
  return (
    <svg
      width={size}
      height={size}
      viewBox="0 0 32 32"
      fill="none"
      aria-hidden="true"
      className={className}
    >
      <circle
        cx="16"
        cy="16"
        r="13"
        className="fill-surface stroke-border-strong"
        strokeWidth="1.5"
      />
      {/* 兩道縫線 */}
      <path
        d="M8 5.5c3 3.2 4.5 6.8 4.5 10.5S11 23.3 8 26.5"
        className="stroke-brand"
        strokeWidth="1.6"
        strokeLinecap="round"
        fill="none"
      />
      <path
        d="M24 5.5c-3 3.2-4.5 6.8-4.5 10.5S21 23.3 24 26.5"
        className="stroke-brand"
        strokeWidth="1.6"
        strokeLinecap="round"
        fill="none"
      />
      {/* 縫線針腳 */}
      <g className="stroke-brand" strokeWidth="1.2" strokeLinecap="round">
        <path d="M11.2 9.5l1.8-.6M11.8 13l1.8-.3M11.8 19l1.8.3M11.2 22.5l1.8.6" />
        <path d="M20.8 9.5l-1.8-.6M20.2 13l-1.8-.3M20.2 19l-1.8.3M20.8 22.5l-1.8.6" />
      </g>
    </svg>
  );
}

/** 品牌 LOGO：棒球圖示 + 字樣。iconOnly 只出圖示。 */
export function Logo({
  className,
  iconOnly = false,
  size = 28,
}: {
  className?: string;
  iconOnly?: boolean;
  size?: number;
}) {
  return (
    <span className={cn("inline-flex items-center gap-2", className)}>
      <BaseballIcon size={size} />
      {!iconOnly && (
        <span className="font-sans text-lg font-bold text-text">
          {SITE.shortName}
        </span>
      )}
    </span>
  );
}
