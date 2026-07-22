import type { Platform } from "@/types/social";

/** 四平台 inline SVG（lucide 1.x 已無品牌 icon），footer 與 media 共用。24x24, fill=currentColor */
type IconProps = { className?: string };

export function YoutubeIcon({ className }: IconProps) {
  return (
    <svg viewBox="0 0 24 24" fill="currentColor" aria-hidden="true" className={className}>
      <path d="M23.5 6.2a3 3 0 0 0-2.1-2.1C19.5 3.6 12 3.6 12 3.6s-7.5 0-9.4.5A3 3 0 0 0 .5 6.2 31.4 31.4 0 0 0 0 12a31.4 31.4 0 0 0 .5 5.8 3 3 0 0 0 2.1 2.1c1.9.5 9.4.5 9.4.5s7.5 0 9.4-.5a3 3 0 0 0 2.1-2.1A31.4 31.4 0 0 0 24 12a31.4 31.4 0 0 0-.5-5.8ZM9.6 15.6V8.4l6.2 3.6-6.2 3.6Z" />
    </svg>
  );
}

export function InstagramIcon({ className }: IconProps) {
  return (
    <svg viewBox="0 0 24 24" fill="none" aria-hidden="true" className={className}>
      <rect x="2.5" y="2.5" width="19" height="19" rx="5" stroke="currentColor" strokeWidth="1.8" />
      <circle cx="12" cy="12" r="4.2" stroke="currentColor" strokeWidth="1.8" />
      <circle cx="17.4" cy="6.6" r="1.2" fill="currentColor" />
    </svg>
  );
}

export function ThreadsIcon({ className }: IconProps) {
  return (
    <svg viewBox="0 0 24 24" fill="currentColor" aria-hidden="true" className={className}>
      <path d="M17.1 11.1c-.1 0-.2-.1-.3-.1-.2-3-1.8-4.7-4.5-4.7-1.6 0-3 .7-3.8 2l1.5 1c.6-.9 1.5-1.1 2.3-1.1 1.5 0 2.3.9 2.5 2.4-.6-.1-1.2-.2-1.9-.1-2.6.1-4.3 1.7-4.2 3.7.1 1 .6 1.9 1.5 2.4.7.5 1.6.7 2.6.6 1.3-.1 2.3-.6 3-1.5.5-.7.9-1.5 1-2.6.7.4 1.2 1 1.5 1.7.5 1.2.5 3.1-1.1 4.7-1.3 1.3-2.9 1.9-5.2 1.9-2.6 0-4.5-.8-5.7-2.5C5.2 16.9 4.7 15 4.7 12.5s.5-4.4 1.6-5.9C7.5 4.9 9.4 4.1 12 4.1c2.6 0 4.6.8 5.8 2.5.6.8 1 1.9 1.3 3.1l1.7-.4c-.3-1.5-.8-2.7-1.6-3.7C18.6 3.4 15.6 2.4 12 2.4c-3 0-5.5 1-7.2 3C3.2 7.2 2.5 9.6 2.5 12.5s.7 5.3 2.3 7.1c1.7 2 4.2 3 7.2 3 2.7 0 4.8-.7 6.4-2.4 2.1-2.1 2.1-4.8 1.4-6.4-.5-1.2-1.4-2.1-2.7-2.7ZM12.4 16c-1.1.1-2.2-.4-2.3-1.4 0-.7.5-1.5 2.5-1.7l.7-.1c.5 0 1 0 1.5.1-.2 2.1-1.2 3-2.4 3.1Z" />
    </svg>
  );
}

export function FacebookIcon({ className }: IconProps) {
  return (
    <svg viewBox="0 0 24 24" fill="currentColor" aria-hidden="true" className={className}>
      <path d="M24 12a12 12 0 1 0-13.9 11.9v-8.4H7.1V12h3V9.4c0-3 1.8-4.6 4.5-4.6 1.3 0 2.6.2 2.6.2v2.9h-1.5c-1.4 0-1.9.9-1.9 1.8V12h3.3l-.5 3.5h-2.8v8.4A12 12 0 0 0 24 12Z" />
    </svg>
  );
}

export const PLATFORM_ICON: Record<Platform, (p: IconProps) => React.ReactNode> = {
  youtube: YoutubeIcon,
  instagram: InstagramIcon,
  threads: ThreadsIcon,
  facebook: FacebookIcon,
};

/** 各平台品牌色（用於 media 卡片佔位漸層） */
export const PLATFORM_COLOR: Record<Platform, string> = {
  youtube: "#ff0000",
  instagram: "#c13584",
  threads: "#000000",
  facebook: "#1877f2",
};
