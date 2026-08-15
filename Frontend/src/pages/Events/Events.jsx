import { useState, useEffect, useCallback } from 'react';
import { Link } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import {
  Calendar, MapPin, Clock, ArrowUpRight, ArrowRight,
  CalendarX2, ChevronRight, Star, Sparkles, Users, Layers
} from 'lucide-react';
import { eventsService } from '@/api/events.service';

// ── Config ───────────────────────────────────────────────────────────────────

const TYPE = {
  UPCOMING:        { label: 'Upcoming',   color: '#0096FF', bg: 'rgba(0,150,255,0.1)',   gradient: 'from-[#00172b] to-[#00345e]' },
  PAST:            { label: 'Past',       color: '#64748B', bg: 'rgba(100,116,139,0.1)', gradient: 'from-[#0f172a] to-[#1e293b]' },
  HOME_FELLOWSHIP: { label: 'Fellowship', color: '#A855F7', bg: 'rgba(168,85,247,0.1)',  gradient: 'from-[#180830] to-[#3b0d6b]' },
  WORSHIP:         { label: 'Worship',    color: '#F59E0B', bg: 'rgba(245,158,11,0.1)',  gradient: 'from-[#2d1a00] to-[#5c3a00]' },
  CONFERENCE:      { label: 'Conference', color: '#EC4899', bg: 'rgba(236,72,153,0.1)',  gradient: 'from-[#2d0a1a] to-[#5c1535]' },
  OUTREACH:        { label: 'Outreach',   color: '#14B8A6', bg: 'rgba(20,184,166,0.1)', gradient: 'from-[#002d2a] to-[#005c54]' },
  YOUTH:           { label: 'Youth',      color: '#EF4444', bg: 'rgba(239,68,68,0.1)',   gradient: 'from-[#2d0000] to-[#5c0000]' },
  PRAYER:          { label: 'Prayer',     color: '#87CEEB', bg: 'rgba(135,206,235,0.1)', gradient: 'from-[#001a2d] to-[#003459]' },
  SPECIAL:         { label: 'Special',    color: '#6366F1', bg: 'rgba(99,102,241,0.1)',  gradient: 'from-[#0f0a2d] to-[#1e1459]' },
};

const CATEGORY_TABS = [
  { key: 'ALL',          label: 'All Events' },
  { key: 'JET_EVENTS',   label: '⚡ JET Events' },
  { key: 'PARTNERSHIPS', label: '🤝 Partnership Events' },
  { key: 'UPCOMING',     label: 'Upcoming' },
  { key: 'PAST',         label: 'Past' },
  { key: 'HOME_FELLOWSHIP', label: 'Fellowship' },
];

const FALLBACK_POSTERS = [
  'https://images.unsplash.com/photo-1542601906990-b4d3fb778b09?auto=format&fit=crop&w=1200&q=80',
  'https://images.unsplash.com/photo-1529156069898-49953e39b3ac?auto=format&fit=crop&w=1200&q=80',
  'https://images.unsplash.com/photo-1475721027785-f74eccf877e2?auto=format&fit=crop&w=1200&q=80',
  'https://images.unsplash.com/photo-1511632765486-a01980e01a18?auto=format&fit=crop&w=1200&q=80',
  'https://images.unsplash.com/photo-1438232992991-995b7058bbb3?auto=format&fit=crop&w=1200&q=80',
];

// ── Helpers ──────────────────────────────────────────────────────────────────

function fmtDate(iso) {
  if (!iso) return '';
  return new Date(iso).toLocaleDateString('en-GB', {
    day: 'numeric', month: 'short', year: 'numeric',
  });
}

function parseDateParts(iso) {
  const d = new Date(iso);
  return {
    day:   String(d.getDate()).padStart(2, '0'),
    month: d.toLocaleDateString('en-GB', { month: 'short' }).toUpperCase(),
    year:  String(d.getFullYear()),
  };
}

function checkIsJetEvent(event) {
  if (event.ownership === 'JET') return true;
  if (event.ownership === 'PARTNERSHIP') return false;
  const titleLower = (event.title || '').toLowerCase();
  const tagLower = (event.tag || '').toLowerCase();
  return (
    titleLower.includes('mission') ||
    titleLower.includes('ossen') ||
    titleLower.includes('impact conference') ||
    titleLower.includes('house fellowship') ||
    tagLower.includes('mission') ||
    event.type === 'HOME_FELLOWSHIP'
  );
}

function getEventCover(event, index = 0) {
  return event.coverImage || event.images?.[0] || FALLBACK_POSTERS[index % FALLBACK_POSTERS.length];
}

function formatDateRange(event) {
  const startStr = fmtDate(event.date);
  if (event.endDate) {
    const endStr = fmtDate(event.endDate);
    if (startStr === endStr) return `From: ${startStr}`;
    return `From: ${startStr} To: ${endStr}`;
  }
  return `From: ${startStr}`;
}

// ── Skeletons ─────────────────────────────────────────────────────────────────

function SkeletonCard() {
  return (
    <div className="rounded-2xl overflow-hidden border border-border animate-pulse bg-card">
      <div className="aspect-[16/9] bg-muted" />
      <div className="p-5 space-y-3">
        <div className="h-3 bg-muted rounded-full w-24" />
        <div className="h-5 bg-muted/80 rounded-full w-3/4" />
        <div className="h-3 bg-muted rounded-full w-2/5" />
      </div>
    </div>
  );
}

function EmptyState({ filterKey }) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 16 }}
      animate={{ opacity: 1, y: 0 }}
      className="flex flex-col items-center justify-center py-20 gap-5 text-center"
    >
      <div className="w-14 h-14 rounded-2xl bg-primary/10 flex items-center justify-center">
        <CalendarX2 className="w-6 h-6 text-primary" />
      </div>
      <div>
        <p className="text-foreground font-semibold text-base mb-1">No events listed</p>
        <p className="text-muted-foreground text-sm max-w-xs">
          There are currently no events matching this filter. Check back soon!
        </p>
      </div>
    </motion.div>
  );
}

// ── Ownership Pill Component ──────────────────────────────────────────────────

function OwnershipBadge({ isJet }) {
  if (isJet) {
    return (
      <span className="inline-flex items-center gap-1 text-[10px] font-extrabold uppercase tracking-wider px-2.5 py-0.5 rounded-full bg-[#0096FF]/20 text-[#0096FF] border border-[#0096FF]/40 shadow-[0_0_12px_rgba(0,150,255,0.2)]">
        <Sparkles className="w-3 h-3" /> JET Event
      </span>
    );
  }
  return (
    <span className="inline-flex items-center gap-1 text-[10px] font-bold uppercase tracking-wider px-2.5 py-0.5 rounded-full bg-purple-500/15 text-purple-400 border border-purple-500/30">
      <Users className="w-3 h-3" /> Partnership
    </span>
  );
}

// ── Event Card Component ──────────────────────────────────────────────────────

function EventCard({ event, index }) {
  const cfg = TYPE[event.type] ?? TYPE.UPCOMING;
  const cover = getEventCover(event, index);
  const { day, month, year } = parseDateParts(event.date);
  const isJet = checkIsJetEvent(event);
  const dateRangeText = formatDateRange(event);

  return (
    <motion.div
      initial={{ opacity: 0, y: 18 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.4, delay: index * 0.05 }}
      className="group flex flex-col rounded-2xl overflow-hidden border border-border bg-card hover:border-primary/40 transition-all duration-300 hover:-translate-y-1 hover:shadow-2xl hover:shadow-primary/10"
    >
      {/* Cover Background Photo */}
      <div className="relative aspect-[16/9] overflow-hidden flex-shrink-0 bg-slate-900">
        <img
          src={cover}
          alt={event.title}
          className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-105"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-black/85 via-black/35 to-black/10" />

        {/* Date Overlay */}
        <div className="absolute bottom-3 left-4 flex items-end gap-2">
          <span className="text-4xl font-black text-white leading-none drop-shadow">{day}</span>
          <div className="flex flex-col mb-0.5 drop-shadow">
            <span className="text-xs font-extrabold leading-tight text-[#0096FF]">{month}</span>
            <span className="text-white/60 text-[10px] leading-tight">{year}</span>
          </div>
        </div>

        {/* Top Badges */}
        <div className="absolute top-3 left-3 right-3 flex items-center justify-between gap-2">
          <OwnershipBadge isJet={isJet} />
          <span
            className="text-[10px] font-bold uppercase tracking-widest px-2.5 py-0.5 rounded-full backdrop-blur-md"
            style={{ background: 'rgba(0,0,0,0.6)', color: cfg.color, border: `1px solid ${cfg.color}50` }}
          >
            {cfg.label}
          </span>
        </div>
      </div>

      {/* Card Content */}
      <div className="flex flex-col flex-1 p-5">
        <h3 className="text-foreground font-bold text-base leading-snug mb-2 line-clamp-2 group-hover:text-primary transition-colors">
          {event.title}
        </h3>

        {event.description && (
          <p className="text-muted-foreground text-xs leading-relaxed line-clamp-2 mb-4 flex-1">
            {event.description}
          </p>
        )}

        {/* Date, Time & Location Meta */}
        <div className="mt-auto pt-3 border-t border-border space-y-1.5 text-xs text-muted-foreground">
          <div className="flex items-center gap-1.5 font-medium text-foreground/80">
            <Calendar className="w-3.5 h-3.5 text-primary shrink-0" />
            <span className="truncate">{dateRangeText}</span>
          </div>

          {event.time && (
            <div className="flex items-center gap-1.5">
              <Clock className="w-3.5 h-3.5 text-amber-400 shrink-0" />
              <span>Time: {event.time}</span>
            </div>
          )}

          <div className="flex items-center justify-between gap-2 pt-1">
            <div className="flex items-center gap-1.5 min-w-0">
              <MapPin className="w-3.5 h-3.5 text-teal-400 shrink-0" />
              <span className="truncate">{event.location}</span>
            </div>

            <Link
              to={`/events/${event.id}/rsvp`}
              className="shrink-0 inline-flex items-center gap-1 px-3 py-1.5 rounded-xl bg-primary text-primary-foreground font-bold text-xs hover:bg-primary/90 transition-all shadow-md hover:shadow-primary/25 cursor-pointer"
            >
              <span>Register NOW</span>
              <ChevronRight className="w-3.5 h-3.5" />
            </Link>
          </div>
        </div>
      </div>
    </motion.div>
  );
}

// ── Hero Banner Event ─────────────────────────────────────────────────────────

function FeaturedHeroEvent({ event }) {
  const cover = getEventCover(event, 0);
  const isJet = checkIsJetEvent(event);
  const dateRangeText = formatDateRange(event);

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className="relative w-full rounded-3xl overflow-hidden border border-border bg-slate-900 group shadow-2xl mb-10"
      style={{ minHeight: 400 }}
    >
      <img
        src={cover}
        alt={event.title}
        className="absolute inset-0 w-full h-full object-cover transition-transform duration-1000 group-hover:scale-103"
      />
      <div className="absolute inset-0 bg-gradient-to-t from-black/95 via-black/55 to-black/20" />

      <div className="relative z-10 p-8 md:p-12 flex flex-col justify-end min-h-[400px]">
        <div className="flex flex-wrap items-center gap-3 mb-4">
          <OwnershipBadge isJet={isJet} />
          {event.featured && (
            <span className="text-[10px] font-bold uppercase tracking-widest px-2.5 py-1 rounded-full bg-amber-400/20 text-amber-300 border border-amber-400/40 flex items-center gap-1">
              <Star className="w-3 h-3 fill-amber-300" /> Featured Event
            </span>
          )}
        </div>

        <h2 className="text-3xl md:text-5xl font-black text-white leading-tight mb-4 max-w-3xl">
          {event.title}
        </h2>

        <p className="text-white/80 text-sm md:text-base leading-relaxed max-w-2xl mb-6 line-clamp-2">
          {event.description}
        </p>

        <div className="flex flex-wrap items-center gap-6 text-sm text-white/90 mb-8">
          <div className="flex items-center gap-2 bg-black/40 backdrop-blur-md px-3.5 py-1.5 rounded-xl border border-white/10">
            <Calendar className="w-4 h-4 text-[#0096FF]" />
            <span className="font-semibold">{dateRangeText}</span>
          </div>

          {event.time && (
            <div className="flex items-center gap-2 bg-black/40 backdrop-blur-md px-3.5 py-1.5 rounded-xl border border-white/10">
              <Clock className="w-4 h-4 text-amber-400" />
              <span>Time: {event.time}</span>
            </div>
          )}

          <div className="flex items-center gap-2 bg-black/40 backdrop-blur-md px-3.5 py-1.5 rounded-xl border border-white/10">
            <MapPin className="w-4 h-4 text-teal-400" />
            <span>{event.location}</span>
          </div>
        </div>

        <div>
          <Link
            to={`/events/${event.id}/rsvp`}
            className="inline-flex items-center gap-2 px-8 py-3.5 rounded-2xl bg-[#0096FF] hover:bg-[#0080ee] text-white font-bold text-sm shadow-[0_0_24px_rgba(0,150,255,0.4)] transition-all hover:scale-105"
          >
            <span>Register NOW</span>
            <ArrowRight className="w-4 h-4" />
          </Link>
        </div>
      </div>
    </motion.div>
  );
}

// ── Main Page ─────────────────────────────────────────────────────────────────

export default function Events() {
  const [events, setEvents] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [filter, setFilter] = useState('ALL');

  const load = useCallback(async () => {
    try {
      const data = await eventsService.getAll();
      setEvents(data);
    } catch (e) {
      setError(e?.message ?? 'Failed to load events.');
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => { load(); }, [load]);

  const filtered = events.filter(e => {
    if (filter === 'ALL') return true;
    if (filter === 'JET_EVENTS') return checkIsJetEvent(e);
    if (filter === 'PARTNERSHIPS') return !checkIsJetEvent(e);
    return e.type === filter;
  });

  const featuredHero = filtered.find(e => e.featured) || filtered[0];

  return (
    <div className="min-h-screen bg-background text-foreground">

      {/* Header Banner */}
      <div className="max-w-7xl mx-auto px-6 pt-16 pb-8">
        <motion.div
          initial={{ opacity: 0, y: 16 }}
          animate={{ opacity: 1, y: 0 }}
          className="max-w-2xl"
        >
          <span className="text-primary font-bold text-xs uppercase tracking-widest mb-2 block">
            Gather · Fellowship · Serve
          </span>
          <h1 className="text-4xl md:text-5xl font-black tracking-tight leading-tight mb-3">
            Ministry & Partner Events
          </h1>
          <p className="text-muted-foreground text-base">
            Explore our JET ministry gatherings and partner conferences. Join us to grow, worship, and build kingdom connections.
          </p>
        </motion.div>
      </div>

      {/* Filter Tabs */}
      <div className="sticky top-[56px] z-20 bg-background/85 backdrop-blur-md border-y border-border">
        <div className="max-w-7xl mx-auto px-6">
          <div className="flex items-center gap-2 overflow-x-auto scrollbar-none py-2">
            {CATEGORY_TABS.map(tab => {
              const active = filter === tab.key;
              return (
                <button
                  key={tab.key}
                  onClick={() => setFilter(tab.key)}
                  className={`px-4 py-2 rounded-xl text-xs font-bold whitespace-nowrap transition-all cursor-pointer ${
                    active
                      ? 'bg-primary text-primary-foreground shadow-md shadow-primary/20'
                      : 'bg-card border border-border text-muted-foreground hover:text-foreground hover:bg-muted/50'
                  }`}
                >
                  {tab.label}
                </button>
              );
            })}
          </div>
        </div>
      </div>

      {/* Events Grid */}
      <div className="max-w-7xl mx-auto px-6 py-12">
        {error && (
          <div className="rounded-2xl border border-destructive/20 bg-destructive/10 p-4 text-destructive text-sm mb-6 flex justify-between items-center">
            <span>{error}</span>
            <button onClick={load} className="underline text-xs cursor-pointer">Retry</button>
          </div>
        )}

        {loading ? (
          <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6">
            <SkeletonCard /><SkeletonCard /><SkeletonCard />
          </div>
        ) : filtered.length === 0 ? (
          <EmptyState filterKey={filter} />
        ) : (
          <div>
            {featuredHero && filter === 'ALL' && <FeaturedHeroEvent event={featuredHero} />}
            <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6">
              {filtered.map((evt, idx) => (
                <EventCard key={evt.id} event={evt} index={idx} />
              ))}
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
