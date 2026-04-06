import { Link } from "react-router-dom";
import { useFeaturedContent, useTopRatedContent } from "../hooks/queries/useContent";
import LoadingSpinner from "../components/ui/LoadingSpinner";
import EmptyState from "../components/ui/EmptyState";
import {
  ArrowRight,
  Sparkles,
  TrendingUp,
  Copy,
  Bookmark,
  Star,
  ChevronRight,
  Wand2,
  Flame,
} from "lucide-react";

function HomeContentCard({ content, variant = "featured" }) {
  const isPrompt = content.type === "prompt";

  return (
    <Link
      to={`/content/${content.slug}`}
      className="group relative overflow-hidden rounded-3xl border border-white/10 bg-[#101320]/70 p-5 backdrop-blur-xl transition-all duration-300 hover:-translate-y-1 hover:border-amber-300/40 hover:bg-[#14192a]"
    >
      <div className="pointer-events-none absolute inset-0 opacity-0 transition-opacity duration-300 group-hover:opacity-100">
        <div className="absolute -right-12 -top-12 h-32 w-32 rounded-full bg-amber-300/10 blur-3xl" />
      </div>

      <div className="relative flex items-start justify-between gap-3">
        <div className="min-w-0">
          <div className="mb-2 flex flex-wrap items-center gap-2 text-[11px] font-medium tracking-wide text-slate-300/80 uppercase">
            <span
              className={`rounded-full border px-2 py-1 ${
                isPrompt
                  ? "border-cyan-300/30 bg-cyan-300/10 text-cyan-200"
                  : "border-fuchsia-300/30 bg-fuchsia-300/10 text-fuchsia-200"
              }`}
            >
              {content.type}
            </span>
            {content.skillProvider && <span>{content.skillProvider}</span>}
            {content.category && <span className="text-slate-400">{content.category}</span>}
          </div>

          <h3 className="line-clamp-2 text-lg font-semibold text-slate-100">{content.title}</h3>
          <p className="mt-2 line-clamp-2 text-sm text-slate-300/75">{content.description}</p>
        </div>

        {content.rating > 0 && (
          <div className="flex shrink-0 items-center gap-1 rounded-full bg-amber-400/15 px-2 py-1 text-xs font-semibold text-amber-200">
            <Star size={12} fill="currentColor" />
            {content.rating.toFixed(1)}
          </div>
        )}
      </div>

      <div className="relative mt-4 flex items-center gap-4 text-xs text-slate-300/80">
        <span className="flex items-center gap-1">
          <Flame size={12} className={variant === "top" ? "text-amber-300" : "text-cyan-300"} />
          {content.upvoteCount}
        </span>
        <span className="flex items-center gap-1">
          <Copy size={12} />
          {content.copyCount}
        </span>
        <span className="flex items-center gap-1">
          <Bookmark size={12} />
          {content.saveCount}
        </span>

        <span className="ml-auto flex items-center gap-1 text-slate-200/90">
          Open <ChevronRight size={13} />
        </span>
      </div>
    </Link>
  );
}

function SectionHeader({ icon, title, href, action }) {
  return (
    <div className="mb-5 flex items-center justify-between">
      <h2 className="flex items-center gap-2 text-xl font-semibold text-slate-100 md:text-2xl">
        <span className="text-amber-200">{icon}</span>
        {title}
      </h2>
      <Link
        to={href}
        className="inline-flex items-center gap-1 rounded-full border border-white/15 bg-white/5 px-3 py-1.5 text-xs font-medium text-slate-200 transition hover:border-amber-200/40 hover:bg-amber-300/10"
      >
        {action} <ArrowRight size={13} />
      </Link>
    </div>
  );
}

export default function HomePage() {
  const featured = useFeaturedContent();
  const topRated = useTopRatedContent();

  const featuredCount = featured.data?.data?.length || 0;
  const topRatedCount = topRated.data?.data?.length || 0;

  return (
    <div className="relative isolate overflow-hidden rounded-3xl border border-white/10 bg-[#090b13] p-5 sm:p-8 md:p-10">
      <div className="pointer-events-none absolute inset-0 -z-10">
        <div className="absolute -left-20 top-0 h-64 w-64 rounded-full bg-fuchsia-500/20 blur-3xl" />
        <div className="absolute right-0 top-20 h-72 w-72 rounded-full bg-cyan-400/20 blur-3xl" />
        <div className="absolute bottom-0 left-1/3 h-64 w-64 rounded-full bg-amber-300/10 blur-3xl" />
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_top,rgba(255,255,255,0.08),transparent_40%)]" />
      </div>

      <section className="relative grid gap-8 pb-10 md:grid-cols-[1.15fr,0.85fr] md:items-end">
        <div>
          <p className="inline-flex items-center gap-2 rounded-full border border-white/20 bg-white/5 px-3 py-1 text-xs tracking-[0.2em] text-slate-200 uppercase">
            <Wand2 size={12} /> Curated Prompt Intelligence
          </p>

          <h1 className="mt-4 text-4xl font-semibold leading-tight text-white sm:text-5xl lg:text-6xl">
            Design better AI outputs with a <span className="text-amber-200">living prompt archive</span>
          </h1>

          <p className="mt-5 max-w-2xl text-base text-slate-300 sm:text-lg">
            PromptHive is where creators publish tested prompts and reusable skills. Discover winning structures,
            fork ideas, and ship faster with community-proven building blocks.
          </p>

          <div className="mt-7 flex flex-wrap gap-3">
            <Link
              to="/explore"
              className="inline-flex items-center gap-2 rounded-full bg-amber-300 px-5 py-3 text-sm font-semibold text-[#171717] transition hover:bg-amber-200"
            >
              Explore prompt library <ArrowRight size={16} />
            </Link>
            <Link
              to="/register"
              className="inline-flex items-center gap-2 rounded-full border border-white/20 bg-white/5 px-5 py-3 text-sm font-semibold text-white transition hover:border-white/40 hover:bg-white/10"
            >
              Join the hive
            </Link>
          </div>
        </div>

        <div className="grid grid-cols-2 gap-3 text-sm">
          <div className="rounded-2xl border border-cyan-200/25 bg-cyan-200/10 p-4">
            <p className="text-slate-300">Featured now</p>
            <p className="mt-1 text-2xl font-semibold text-cyan-100">{featuredCount}</p>
          </div>
          <div className="rounded-2xl border border-amber-200/25 bg-amber-200/10 p-4">
            <p className="text-slate-300">Top rated</p>
            <p className="mt-1 text-2xl font-semibold text-amber-100">{topRatedCount}</p>
          </div>
          <div className="col-span-2 rounded-2xl border border-white/15 bg-white/5 p-4">
            <p className="text-slate-300">Momentum</p>
            <p className="mt-1 text-2xl font-semibold text-white">Community-curated, quality-first prompts</p>
          </div>
        </div>
      </section>

      <section className="pb-10">
        <SectionHeader icon={<Sparkles size={20} />} title="Featured Drops" href="/explore" action="See all" />
        {featured.isLoading ? (
          <LoadingSpinner />
        ) : featuredCount > 0 ? (
          <div className="grid grid-cols-1 gap-4 md:grid-cols-2 xl:grid-cols-3">
            {featured.data.data.map((item) => (
              <HomeContentCard key={item._id} content={item} variant="featured" />
            ))}
          </div>
        ) : (
          <div className="rounded-2xl border border-white/10 bg-white/5 p-6">
            <EmptyState message="No featured content yet" />
          </div>
        )}
      </section>

      <section>
        <SectionHeader
          icon={<TrendingUp size={20} />}
          title="Most Loved by the Community"
          href="/explore?sort=rating"
          action="Browse ranked"
        />
        {topRated.isLoading ? (
          <LoadingSpinner />
        ) : topRatedCount > 0 ? (
          <div className="grid grid-cols-1 gap-4 md:grid-cols-2 xl:grid-cols-3">
            {topRated.data.data.map((item) => (
              <HomeContentCard key={item._id} content={item} variant="top" />
            ))}
          </div>
        ) : (
          <div className="rounded-2xl border border-white/10 bg-white/5 p-6">
            <EmptyState message="No rated content yet" />
          </div>
        )}
      </section>
    </div>
  );
}
