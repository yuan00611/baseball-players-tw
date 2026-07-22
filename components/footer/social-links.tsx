import { SITE } from "@/lib/site";
import {
  YoutubeIcon,
  InstagramIcon,
  ThreadsIcon,
  FacebookIcon,
} from "@/components/icons/social-icons";

const LINKS = [
  { label: "YouTube", href: SITE.socials.youtube, Icon: YoutubeIcon },
  { label: "Instagram", href: SITE.socials.instagram, Icon: InstagramIcon },
  { label: "Threads", href: SITE.socials.threads, Icon: ThreadsIcon },
  { label: "Facebook", href: SITE.socials.facebook, Icon: FacebookIcon },
] as const;

export function SocialLinks() {
  return (
    <ul className="flex items-center gap-2">
      {LINKS.map(({ label, href, Icon }) => (
        <li key={label}>
          <a
            href={href}
            target="_blank"
            rel="noopener noreferrer"
            aria-label={`${label}（另開新視窗）`}
            className="inline-flex size-10 items-center justify-center rounded-md text-text-muted transition-colors hover:bg-canvas hover:text-accent-text"
          >
            <Icon className="size-5" />
          </a>
        </li>
      ))}
    </ul>
  );
}
