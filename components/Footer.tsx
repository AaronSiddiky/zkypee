import Link from "next/link";
import { Twitter, Linkedin, Github, Youtube } from "lucide-react";

export default function Footer() {
  const socials = [
    { href: process.env.NEXT_PUBLIC_X_URL || process.env.NEXT_PUBLIC_TWITTER_URL, label: "X", Icon: Twitter },
    { href: process.env.NEXT_PUBLIC_LINKEDIN_URL, label: "LinkedIn", Icon: Linkedin },
    { href: process.env.NEXT_PUBLIC_GITHUB_URL, label: "GitHub", Icon: Github },
    { href: process.env.NEXT_PUBLIC_YOUTUBE_URL, label: "YouTube", Icon: Youtube },
  ].filter((s): s is { href: string; label: string; Icon: any } => Boolean(s.href));

  return (
    <footer className="border-t border-neutral-200 bg-white">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 py-14">
        <div className="flex flex-col lg:flex-row lg:items-start lg:justify-between gap-10">
          <div className="max-w-sm">
            <div className="text-2xl font-semibold">Zkypee</div>
            <p className="mt-2 text-sm text-neutral-600">
              Lightweight calling and messaging. Clean. Fast. Reliable.
            </p>
          </div>

          <div className="grid grid-cols-2 sm:grid-cols-3 gap-8">
            <nav aria-labelledby="f-prod" className="space-y-3">
              <div id="f-prod" className="text-sm font-semibold text-neutral-900">Product</div>
              <ul className="space-y-2 text-sm">
                <li><Link href="/ai-assistant" className="text-neutral-600 hover:text-black">AI Voice Assistant</Link></li>
                <li><Link href="/calling" className="text-neutral-600 hover:text-black">Calling</Link></li>
                <li><Link href="/buy-number" className="text-neutral-600 hover:text-black">Buy Number</Link></li>
                <li><Link href="/credits" className="text-neutral-600 hover:text-black">Buy Credits</Link></li>
              </ul>
            </nav>

            <nav aria-labelledby="f-res" className="space-y-3">
              <div id="f-res" className="text-sm font-semibold text-neutral-900">Resources</div>
              <ul className="space-y-2 text-sm">
                <li><Link href="/receive-sms" className="text-neutral-600 hover:text-black">Receive SMS Online</Link></li>
                <li><Link href="/receive-email" className="text-neutral-600 hover:text-black">Receive Emails Online</Link></li>
                <li><Link href="/help" className="text-neutral-600 hover:text-black">Help Center</Link></li>
                <li><Link href="/status" className="text-neutral-600 hover:text-black">Status</Link></li>
              </ul>
            </nav>

            <nav aria-labelledby="f-co" className="space-y-3">
              <div id="f-co" className="text-sm font-semibold text-neutral-900">Company</div>
              <ul className="space-y-2 text-sm">
                <li><Link href="/about" className="text-neutral-600 hover:text-black">About</Link></li>
                <li><Link href="/contact" className="text-neutral-600 hover:text-black">Contact</Link></li>
              </ul>
            </nav>
          </div>
        </div>

        <div className="mt-10 border-t border-neutral-200 pt-6 flex flex-col md:flex-row md:items-center md:justify-between gap-4">
          <div className="text-sm text-neutral-500">© {new Date().getFullYear()} Zkypee. All rights reserved.</div>
          {socials.length > 0 && (
            <div className="flex items-center gap-3">
              {socials.map(({ href, label, Icon }) => (
                <a
                  key={label}
                  href={href}
                  target="_blank"
                  rel="noopener noreferrer"
                  aria-label={label}
                  className="inline-flex h-10 w-10 items-center justify-center rounded-full border border-neutral-200 hover:bg-neutral-50"
                >
                  <Icon className="h-5 w-5" />
                </a>
              ))}
            </div>
          )}
        </div>
      </div>
    </footer>
  );
}