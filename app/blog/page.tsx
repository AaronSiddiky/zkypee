import Link from "next/link";
import Image from "next/image";

type Post = {
  slug: string;
  title: string;
  excerpt: string;
  date: string;
  category: string;
  image?: string;
};

const posts: Post[] = [
  {
    slug: "skype-shutting-down",
    title: "Best Skype Alternative 2025: Cheapest International Calling",
    excerpt:
      "Skype ends May 2025. Compare alternatives and see why Zkypee offers lower rates and a smoother transition.",
    date: "Mar 1, 2025",
    category: "Guides",
    image: "/blog/communication.jpg",
  },
  {
    slug: "voip-communication-tips",
    title: "10 Essential VoIP Communication Tips for Remote Teams",
    excerpt:
      "Practical, battle-tested tips to improve your team’s call quality and collaboration.",
    date: "Aug 3, 2025",
    category: "Tips",
    image: "/blog/remote-work.jpg",
  },
  {
    slug: "video-call-best-practices",
    title: "Video Call Best Practices Professionals Actually Use",
    excerpt:
      "Make every call look and sound like you run a top-tier operation.",
    date: "Jul 10, 2025",
    category: "Tips",
    image: "/blog/video-calls.jpg",
  },
  {
    slug: "secure-online-communication",
    title: "Security Essentials for Modern Communication",
    excerpt:
      "Core practices for keeping calls and messages secure without slowing teams down.",
    date: "Jun 21, 2025",
    category: "Security",
    image: "/blog/security.jpg",
  },
];

export default function BlogPage() {
  const [featured, ...rest] = posts;

  return (
    <main>
      <section className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 pt-16 pb-8 sm:pt-24">
        <div className="text-center">
          <h1 className="text-4xl sm:text-5xl font-extrabold tracking-tight text-neutral-900">
            Zkypee Blog
          </h1>
          <p className="mt-3 text-neutral-600 text-lg">
            Practical guides on calling, messaging, and remote communication.
          </p>
        </div>

        <div className="mt-12 grid gap-8 lg:grid-cols-2">
          <Link
            href={`/blog/${featured.slug}`}
            className="group rounded-3xl border border-neutral-200 bg-white overflow-hidden shadow-[0_30px_80px_-40px_rgba(0,0,0,0.25)]"
          >
            <div className="relative aspect-[16/9] bg-neutral-100">
              {featured.image && (
                <Image
                  src={featured.image}
                  alt={featured.title}
                  fill
                  className="object-cover"
                  priority
                />
              )}
            </div>
            <div className="p-6 sm:p-8">
              <div className="flex items-center gap-2 text-sm text-neutral-600">
                <span className="rounded-full border border-neutral-200 px-2 py-0.5">
                  {featured.category}
                </span>
                <span>•</span>
                <span>{featured.date}</span>
              </div>
              <h2 className="mt-3 text-2xl sm:text-3xl font-bold text-neutral-900 group-hover:opacity-90">
                {featured.title}
              </h2>
              <p className="mt-3 text-neutral-600">{featured.excerpt}</p>
              <div className="mt-4 text-neutral-900 font-medium">Read more →</div>
            </div>
          </Link>

          <div className="grid sm:grid-cols-2 gap-8">
            {rest.map((p) => (
              <Link
                key={p.slug}
                href={`/blog/${p.slug}`}
                className="group rounded-2xl border border-neutral-200 bg-white overflow-hidden hover:shadow-[0_30px_80px_-40px_rgba(0,0,0,0.25)] transition-shadow"
              >
                <div className="relative aspect-[16/9] bg-neutral-100">
                  {p.image && (
                    <Image src={p.image} alt={p.title} fill className="object-cover" />
                  )}
                </div>
                <div className="p-6">
                  <div className="flex items-center gap-2 text-sm text-neutral-600">
                    <span className="rounded-full border border-neutral-200 px-2 py-0.5">
                      {p.category}
                    </span>
                    <span>•</span>
                    <span>{p.date}</span>
                  </div>
                  <h3 className="mt-3 text-xl font-semibold text-neutral-900 group-hover:opacity-90">
                    {p.title}
                  </h3>
                  <p className="mt-2 text-neutral-600">{p.excerpt}</p>
                  <div className="mt-3 text-neutral-900 font-medium">Read more →</div>
                </div>
              </Link>
            ))}
          </div>
        </div>
      </section>
    </main>
  );
}