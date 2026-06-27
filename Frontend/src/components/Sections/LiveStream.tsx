import { useCallback, useEffect, useState } from "react";
import { PlayCircle, Radio, Clock, RefreshCw, CalendarClock } from "lucide-react";

// Lucide-react has no YouTube icon — inline SVG
function YtIcon({ className }: { className?: string }) {
  return (
    <svg className={className} viewBox="0 0 24 24" fill="currentColor" aria-hidden="true">
      <path d="M23.498 6.186a3.016 3.016 0 0 0-2.122-2.136C19.505 3.545 12 3.545 12 3.545s-7.505 0-9.377.505A3.017 3.017 0 0 0 .502 6.186C0 8.07 0 12 0 12s0 3.93.502 5.814a3.016 3.016 0 0 0 2.122 2.136c1.871.505 9.376.505 9.376.505s7.505 0 9.377-.505a3.015 3.015 0 0 0 2.122-2.136C24 15.93 24 12 24 12s0-3.93-.502-5.814zM9.545 15.568V8.432L15.818 12l-6.273 3.568z" />
    </svg>
  );
}

const API_URL =
  (import.meta.env.VITE_API_URL as string | undefined) ?? "http://localhost:3000/api";

interface LivestreamData {
  configured: boolean;
  isLive?: boolean;
  isUpcoming?: boolean;
  videoId?: string;
  title?: string;
  description?: string;
  thumbnail?: string;
  channelTitle?: string;
  publishedAt?: string;
}

function formatDate(iso: string) {
  return new Date(iso).toLocaleDateString("en-GB", {
    weekday: "long",
    day: "numeric",
    month: "long",
    year: "numeric",
  });
}

function truncate(str: string, max: number) {
  if (!str) return "";
  return str.length <= max ? str : str.slice(0, max).trimEnd() + "…";
}

export default function LiveStream() {
  const [data, setData] = useState<LivestreamData | null>(null);
  // Starts true so the skeleton shows on first load without a synchronous setState in the effect
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  // All setState calls happen after awaits — satisfies the linter rule that
  // prohibits synchronous setState in effect bodies.
  const fetchData = useCallback(async () => {
    try {
      const res = await fetch(`${API_URL}/livestream`);
      if (!res.ok) throw new Error(`Server error ${res.status}`);
      const json = (await res.json()) as LivestreamData;
      setData(json);
      setError("");
    } catch (e) {
      setError(e instanceof Error ? e.message : "Failed to load stream info.");
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    // setTimeout defers the call out of the synchronous effect body,
    // satisfying the linter rule against setState in effect bodies.
    const init = setTimeout(() => void fetchData(), 0);
    const poll = setInterval(() => void fetchData(), 60_000);
    return () => {
      clearTimeout(init);
      clearInterval(poll);
    };
  }, [fetchData]);

  // Refresh button: event handler is allowed to call setState synchronously
  const handleRefresh = () => {
    setLoading(true);
    setError("");
    void fetchData();
  };

  const youtubeUrl = data?.videoId
    ? `https://www.youtube.com/watch?v=${data.videoId}`
    : "https://www.youtube.com/@JETMinistries";

  return (
    <section
      id="livestream"
      className="relative w-full py-20 md:py-28 bg-white dark:bg-[#001726] text-foreground overflow-hidden"
    >
      {/* Background glows */}
      <div className="absolute top-0 left-1/4 w-96 h-96 bg-[radial-gradient(circle,rgba(0,150,255,0.06),transparent_60%)] pointer-events-none" />
      <div className="absolute bottom-0 right-1/4 w-96 h-96 bg-[radial-gradient(circle,rgba(239,68,68,0.04),transparent_60%)] pointer-events-none" />
      {/* Dot grid */}
      <div
        className="absolute inset-0 opacity-[0.03] pointer-events-none"
        style={{
          backgroundImage: `radial-gradient(rgba(100,100,100,0.3) 1px, transparent 1px)`,
          backgroundSize: "28px 28px",
        }}
      />

      <div className="relative max-w-7xl mx-auto px-6">
        {/* Header */}
        <div className="flex flex-col md:flex-row md:items-end md:justify-between gap-4 mb-12">
          <div>
            <span className="text-[#0096FF] dark:text-[#87CEEB] text-xs font-semibold uppercase tracking-widest mb-3 block">
              Watch &amp; Worship
            </span>
            <h2 className="text-3xl md:text-4xl font-bold text-foreground tracking-tight leading-tight">
              Live Stream
            </h2>
          </div>

          <div className="flex items-center gap-3">
            {!loading && data?.isLive && (
              <div className="flex items-center gap-2 bg-red-500/10 border border-red-500/30 rounded-full px-4 py-2">
                <span className="relative flex h-2 w-2">
                  <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-red-400 opacity-75" />
                  <span className="relative inline-flex rounded-full h-2 w-2 bg-red-500" />
                </span>
                <span className="text-xs text-red-400 font-semibold uppercase tracking-widest">
                  Live Now
                </span>
              </div>
            )}
            {!loading && data?.isUpcoming && !data.isLive && (
              <div className="flex items-center gap-2 bg-[#0096FF]/10 border border-[#0096FF]/30 rounded-full px-4 py-2">
                <CalendarClock className="w-3.5 h-3.5 text-[#0096FF]" />
                <span className="text-xs text-[#0096FF] font-semibold uppercase tracking-widest">
                  Upcoming
                </span>
              </div>
            )}
            <button
              onClick={handleRefresh}
              disabled={loading}
              title="Refresh"
              className="w-9 h-9 rounded-full bg-foreground/5 border border-foreground/10 flex items-center justify-center text-foreground/40 hover:text-foreground/80 transition-all cursor-pointer disabled:opacity-40"
            >
              <RefreshCw className={`w-3.5 h-3.5 ${loading ? "animate-spin" : ""}`} />
            </button>
          </div>
        </div>

        {/* Loading skeleton */}
        {loading && (
          <div className="w-full rounded-2xl border border-foreground/10 overflow-hidden animate-pulse">
            <div className="flex flex-col md:flex-row">
              <div className="w-full md:w-1/2 aspect-video bg-foreground/10" />
              <div className="flex-1 p-8 space-y-4">
                <div className="h-6 bg-foreground/10 rounded-lg w-3/4" />
                <div className="h-4 bg-foreground/10 rounded-lg w-full" />
                <div className="h-4 bg-foreground/10 rounded-lg w-5/6" />
                <div className="h-4 bg-foreground/10 rounded-lg w-2/3" />
                <div className="h-10 bg-foreground/10 rounded-full w-40 mt-6" />
              </div>
            </div>
          </div>
        )}

        {/* Error */}
        {!loading && error && (
          <div className="w-full rounded-2xl border border-red-500/20 bg-red-500/5 p-8 text-center">
            <p className="text-red-400 text-sm mb-3">{error}</p>
            <button
              onClick={handleRefresh}
              className="inline-flex items-center gap-2 text-xs text-red-400 hover:text-red-300 underline cursor-pointer"
            >
              <RefreshCw className="w-3 h-3" /> Try again
            </button>
          </div>
        )}

        {/* Not configured */}
        {!loading && !error && data && !data.configured && <NotConfigured />}

        {/* Main card */}
        {!loading && !error && data?.configured && (
          <MainCard data={data} youtubeUrl={youtubeUrl} />
        )}
      </div>
    </section>
  );
}

/* ── Sub-components ──────────────────────────────────────────────────────────── */

function NotConfigured() {
  return (
    <div className="relative w-full rounded-2xl overflow-hidden border border-[#0096FF]/20 bg-foreground/5 backdrop-blur-md shadow-[0_8px_32px_rgba(0,150,255,0.08)]">
      <div className="absolute inset-0 bg-gradient-to-r from-[#0096FF]/8 to-transparent pointer-events-none" />
      <div className="relative z-10 flex flex-col md:flex-row items-center p-8 md:p-10 gap-8">
        <div className="relative w-full md:w-5/12 aspect-video rounded-xl overflow-hidden bg-black/30 border border-foreground/10 flex items-center justify-center flex-shrink-0">
          <div className="absolute inset-0 bg-gradient-to-br from-[#001e33] to-[#001726]" />
          <YtIcon className="w-14 h-14 text-foreground/10 relative z-10" />
        </div>
        <div className="flex-1 text-center md:text-left">
          <h3 className="text-2xl md:text-3xl font-bold text-foreground leading-tight mb-3">
            Sunday Worship Service
          </h3>
          <p className="text-sm md:text-base text-foreground/60 leading-relaxed mb-6 max-w-lg">
            Follow our live sessions. Experience worship, the Word, and the presence of God from
            wherever you are. Subscribe on YouTube to get notified when we go live.
          </p>
          <a
            href="https://www.youtube.com/@JETMinistries"
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex items-center gap-2.5 bg-[#FF0000] text-white px-7 py-3 rounded-full text-sm font-semibold hover:bg-[#cc0000] transition-all duration-300 shadow-[0_0_20px_rgba(255,0,0,0.25)] hover:scale-105"
          >
            <YtIcon className="w-5 h-5" />
            Subscribe on YouTube
          </a>
        </div>
      </div>
    </div>
  );
}

function MainCard({ data, youtubeUrl }: { data: LivestreamData; youtubeUrl: string }) {
  const isLive = !!data.isLive;
  const isUpcoming = !!data.isUpcoming && !isLive;

  const borderClass = isLive ? "border-red-500/30" : "border-[#0096FF]/25";
  const glowShadow = isLive
    ? "0 8px 48px rgba(239,68,68,0.15)"
    : "0 8px 48px rgba(0,150,255,0.1)";
  const gradientBg = isLive
    ? "linear-gradient(135deg, rgba(239,68,68,0.06), transparent)"
    : "linear-gradient(135deg, rgba(0,150,255,0.08), transparent)";

  return (
    <div
      className={`relative w-full rounded-2xl overflow-hidden border ${borderClass} bg-foreground/5`}
      style={{ boxShadow: glowShadow }}
    >
      <div className="absolute inset-0 pointer-events-none" style={{ background: gradientBg }} />

      <div className="relative z-10 flex flex-col md:flex-row items-stretch">
        {/* Thumbnail */}
        <a
          href={youtubeUrl}
          target="_blank"
          rel="noopener noreferrer"
          className="relative w-full md:w-1/2 aspect-video md:aspect-auto md:min-h-[280px] flex-shrink-0 group overflow-hidden block"
        >
          {data.thumbnail ? (
            <img
              src={data.thumbnail}
              alt={data.title ?? "YouTube stream thumbnail"}
              className="absolute inset-0 w-full h-full object-cover transition-transform duration-700 group-hover:scale-105"
            />
          ) : (
            <div className="absolute inset-0 bg-gradient-to-br from-[#001e33] to-[#001726]" />
          )}
          <div className="absolute inset-0 bg-black/25 group-hover:bg-black/10 transition-colors duration-500" />

          {/* Play button */}
          <div className="absolute inset-0 flex items-center justify-center">
            <div
              className={`w-16 h-16 rounded-full flex items-center justify-center border border-white/20 backdrop-blur-sm transition-all duration-300 group-hover:scale-110 ${
                isLive
                  ? "bg-red-500/70 group-hover:bg-red-500 group-hover:shadow-[0_0_24px_rgba(239,68,68,0.5)]"
                  : "bg-black/40 group-hover:bg-[#0096FF]/70 group-hover:shadow-[0_0_24px_rgba(0,150,255,0.5)]"
              }`}
            >
              <PlayCircle className="w-7 h-7 text-white" />
            </div>
          </div>

          {/* Status badge */}
          {isLive && (
            <div className="absolute top-4 left-4 bg-red-500 text-white text-[10px] font-bold uppercase tracking-widest px-3 py-1 rounded-full flex items-center gap-1.5">
              <span className="relative flex h-1.5 w-1.5">
                <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-white opacity-75" />
                <span className="relative inline-flex rounded-full h-1.5 w-1.5 bg-white" />
              </span>
              Live Now
            </div>
          )}
          {isUpcoming && (
            <div className="absolute top-4 left-4 bg-[#0096FF] text-white text-[10px] font-bold uppercase tracking-widest px-3 py-1 rounded-full flex items-center gap-1.5">
              <CalendarClock className="w-3 h-3" />
              Upcoming
            </div>
          )}
          {!isLive && !isUpcoming && (
            <div className="absolute top-4 left-4 bg-black/50 backdrop-blur-sm text-white text-[10px] font-semibold uppercase tracking-widest px-3 py-1 rounded-full flex items-center gap-1.5 border border-white/10">
              <Radio className="w-3 h-3 text-[#87CEEB]" />
              Latest Video
            </div>
          )}
        </a>

        {/* Info panel */}
        <div className="flex flex-col justify-center flex-1 p-7 md:p-10 text-center md:text-left">
          {data.channelTitle && (
            <span className="text-[#87CEEB] text-xs font-semibold uppercase tracking-widest mb-2 block">
              {data.channelTitle}
            </span>
          )}

          <h3 className="text-xl md:text-2xl lg:text-3xl font-bold text-foreground leading-snug mb-3">
            {data.title ?? "Sunday Worship Service"}
          </h3>

          {data.description && (
            <p className="text-sm text-foreground/60 leading-relaxed mb-5 max-w-lg mx-auto md:mx-0">
              {truncate(data.description, 180)}
            </p>
          )}

          {data.publishedAt && !isLive && (
            <div className="flex items-center gap-1.5 justify-center md:justify-start text-foreground/40 text-xs mb-6">
              <Clock className="w-3.5 h-3.5" />
              {formatDate(data.publishedAt)}
            </div>
          )}

          <div className="flex flex-col sm:flex-row items-center md:items-start gap-3">
            <a
              href={youtubeUrl}
              target="_blank"
              rel="noopener noreferrer"
              className={`inline-flex items-center gap-2.5 px-7 py-3 rounded-full text-sm font-semibold transition-all duration-300 hover:scale-105 ${
                isLive
                  ? "bg-red-500 text-white hover:bg-red-600 shadow-[0_0_20px_rgba(239,68,68,0.4)]"
                  : "bg-[#0096FF] text-white hover:bg-[#007acc] shadow-[0_0_20px_rgba(0,150,255,0.35)]"
              }`}
            >
              <PlayCircle className="w-5 h-5" />
              {isLive ? "Watch Live Now" : isUpcoming ? "Set Reminder" : "Watch on YouTube"}
            </a>

            <a
              href="https://www.youtube.com/@JETMinistries"
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-2 px-5 py-3 rounded-full text-sm font-medium border border-foreground/15 text-foreground/60 hover:text-foreground hover:border-foreground/30 transition-all duration-300"
            >
              <YtIcon className="w-4 h-4 text-[#FF0000]" />
              Subscribe
            </a>
          </div>
        </div>
      </div>
    </div>
  );
}
