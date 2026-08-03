import { useState, useEffect, useCallback } from 'react';
import { Link } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import {
  Calendar, MapPin, Clock, ArrowUpRight, ArrowRight,
  CalendarX2, ChevronRight, Star,
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

const TABS = [
  { key: 'ALL',            label: 'All Events' },
  { key: 'UPCOMING',       label: 'Upcoming' },
  { key: 'PAST',           label: 'Past' },
  { key: 'HOME_FELLOWSHIP',label: 'Fellowship' },
  { key: 'WORSHIP',        label: 'Worship' },
  { key: 'CONFERENCE',     label: 'Conference' },
  { key: 'OUTREACH',       label: 'Outreach' },
  { key: 'YOUTH',          label: 'Youth' },
  { key: 'PRAYER',         label: 'Prayer' },
  { key: 'SPECIAL',        label: 'Special' },
];

// ── Helpers ──────────────────────────────────────────────────────────────────

function fmtDate(iso) {
  return new Date(iso).toLocaleDateString('en-GB', {
    day: 'numeric', month: 'long', year: 'numeric',
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

// ── Skeletons ─────────────────────────────────────────────────────────────────

function SkeletonCard() {
  return (
    <div className="rounded-2xl overflow-hidden border border-border animate-pulse bg-card">
      <div className="aspect-[16/9] bg-muted" />
      <div className="p-5 space-y-3">
        <div className="h-3 bg-muted rounded-full w-24" />
        <div className="h-5 bg-muted/80 rounded-full w-3/4" />
        <div className="h-3 bg-muted rounded-full w-2/5" />
        <div className="space-y-2 pt-1">
          <div className="h-3 bg-muted rounded-full w-full" />
          <div className="h-3 bg-muted rounded-full w-5/6" />
        </div>
      </div>
    </div>
  );
}

function SkeletonHero() {
  return (
    <div className="rounded-2xl overflow-hidden border border-border animate-pulse bg-card" style={{ minHeight: 340 }}>
      <div className="w-full bg-muted" style={{ minHeight: 340 }} />
    </div>
  );
}

function SkeletonAllLayout() {
  return (
    <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
      <div className="lg:col-span-5 rounded-2xl border border-border animate-pulse h-[420px] bg-card" />
      <div className="lg:col-span-7 flex flex-col gap-5">
        {[0, 1, 2].map(i => (
          <div key={i} className="rounded-xl border border-border animate-pulse h-[110px] bg-card" />
        ))}
      </div>
    </div>
  );
}

// ── Empty State ───────────────────────────────────────────────────────────────

function EmptyState({ typeKey }) {
  const cfg = typeKey && typeKey !== 'ALL' ? (TYPE[typeKey] ?? TYPE.UPCOMING) : TYPE.UPCOMING;
  const label = typeKey && typeKey !== 'ALL' ? cfg.label.toLowerCase() : 'matching';
  return (
    <motion.div
      initial={{ opacity: 0, y: 16 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.4 }}
      className="flex flex-col items-center justify-center py-20 gap-5 text-center"
    >
      <div className="relative flex items-center justify-center">
        {[48, 80, 112].map((size, i) => (
          <motion.div
            key={size}
            className="absolute rounded-full border"
            style={{ width: size, height: size, borderColor: cfg.color, opacity: 0 }}
            animate={{ opacity: [0, 0.18, 0], scale: [0.8, 1.05, 1.05] }}
            transition={{ duration: 2.4, repeat: Infinity, delay: i * 0.5, ease: 'easeOut' }}
          />
        ))}
        <div
          className="w-14 h-14 rounded-2xl flex items-center justify-center relative z-10"
          style={{ background: cfg.bg }}
        >
          <CalendarX2 className="w-6 h-6" style={{ color: cfg.color }} />
        </div>
      </div>
      <div>
        <p className="text-foreground font-semibold text-base mb-1">No {label} events</p>
        <p className="text-muted-foreground text-sm max-w-xs">
          Nothing scheduled here yet — check back soon.
        </p>
      </div>
    </motion.div>
  );
}

// ── ALL tab: Featured large card (left) ──────────────────────────────────────

function FeaturedLargeCard({ event, fullWidth }) {
  const cfg = TYPE[event.type] ?? TYPE.UPCOMING;
  const { day, month, year } = parseDateParts(event.date);
  return (
    <motion.div
      initial={{ opacity: 0, x: -30 }}
      animate={{ opacity: 1, x: 0 }}
      transition={{ duration: 0.7, ease: 'easeOut' }}
      className={`${fullWidth ? 'col-span-12' : 'lg:col-span-5'} relative bg-foreground/5 backdrop-blur-sm border border-foreground/10 rounded-2xl overflow-hidden p-7 flex flex-col justify-between transition-all duration-300 hover:bg-foreground/10 hover:border-foreground/15 hover:shadow-[0_12px_40px_rgba(0,150,255,0.08)] group cursor-pointer`}
    >
      {/* Top accent line */}
      <div
        className="absolute top-0 left-0 right-0 h-0.5 opacity-60"
        style={{ background: `linear-gradient(to right, ${cfg.color}, transparent)` }}
      />

      {/* Tag + year */}
      <div className="flex items-center justify-between mb-6">
        <span
          className="text-[10px] uppercase tracking-widest font-bold px-3 py-1 rounded-full border"
          style={{ color: cfg.color, backgroundColor: `${cfg.color}18`, borderColor: `${cfg.color}30` }}
        >
          {event.tag ?? cfg.label}
        </span>
        <div className="flex items-center gap-1.5 text-foreground/40 text-xs">
          <Calendar className="w-3.5 h-3.5" />
          <span>{year}</span>
        </div>
      </div>

      {/* Big date */}
      <div className="mb-5">
        <div className="flex items-end gap-2">
          <span className="text-6xl font-black text-foreground leading-none">{day}</span>
          <div className="flex flex-col mb-1">
            <span className="text-sm font-bold leading-tight" style={{ color: cfg.color }}>{month}</span>
            <span className="text-foreground/30 text-xs leading-tight">{year}</span>
          </div>
        </div>
      </div>

      {/* Title + description */}
      <div className="flex-grow">
        <h3 className="text-xl font-bold text-foreground leading-snug mb-3 group-hover:text-[#87CEEB] transition-colors duration-300">
          {event.title}
        </h3>
        {event.description && (
          <p className="text-sm text-foreground/60 leading-relaxed font-light line-clamp-3">
            {event.description}
          </p>
        )}
      </div>

      {/* Meta */}
      <div className="mt-6 space-y-2">
        {event.time && (
          <div className="flex items-center gap-2 text-foreground/50 text-xs">
            <Clock className="w-3.5 h-3.5" style={{ color: cfg.color }} />
            <span>{event.time}</span>
          </div>
        )}
        <div className="flex items-center gap-2 text-foreground/50 text-xs">
          <MapPin className="w-3.5 h-3.5" style={{ color: cfg.color }} />
          <span>{event.location}</span>
        </div>
      </div>

      {/* CTA */}
      <Link
        to={event.type === 'UPCOMING' ? `/events/${event.id}/rsvp` : '/events'}
        className="mt-7 flex items-center gap-2.5 text-xs uppercase tracking-widest font-semibold transition-colors duration-300 group/btn w-fit"
        style={{ color: cfg.color }}
      >
        <span>{event.type === 'UPCOMING' ? 'Register Now' : 'Learn More'}</span>
        <div
          className="w-7 h-7 rounded-full flex items-center justify-center border transition-all duration-300 group-hover/btn:scale-110"
          style={{ backgroundColor: `${cfg.color}20`, borderColor: `${cfg.color}30` }}
        >
          <ArrowRight className="w-3.5 h-3.5" />
        </div>
      </Link>
    </motion.div>
  );
}

// ── ALL tab: Stacked list card (right) ───────────────────────────────────────

function ListCard({ event, index }) {
  const [hovered, setHovered] = useState(false);
  const cfg = TYPE[event.type] ?? TYPE.UPCOMING;
  const { day, month } = parseDateParts(event.date);
  return (
    <motion.div
      initial={{ opacity: 0, x: 30 }}
      animate={{ opacity: 1, x: 0 }}
      transition={{ duration: 0.6, delay: index * 0.08, ease: 'easeOut' }}
      onMouseEnter={() => setHovered(true)}
      onMouseLeave={() => setHovered(false)}
      className="relative flex items-start gap-5 bg-foreground/5 backdrop-blur-sm border border-foreground/10 rounded-xl p-5 transition-all duration-300 hover:bg-foreground/10 hover:border-foreground/15 hover:scale-[1.01] hover:shadow-[0_8px_24px_rgba(0,150,255,0.06)] group cursor-pointer"
    >
      {/* Left accent line */}
      <div
        className="absolute left-0 top-4 bottom-4 w-0.5 rounded-full opacity-50"
        style={{ backgroundColor: cfg.color }}
      />

      {/* Date block */}
      <div className="flex-shrink-0 text-center w-12 pl-3">
        <div className="text-2xl font-black text-foreground leading-none">{day}</div>
        <div className="text-[10px] font-bold uppercase tracking-widest mt-0.5" style={{ color: cfg.color }}>
          {month}
        </div>
      </div>

      {/* Divider */}
      <div className="w-px self-stretch bg-foreground/5 flex-shrink-0" />

      {/* Content */}
      <div className="flex-grow min-w-0">
        <div className="flex items-center justify-between gap-2 mb-1.5">
          <span
            className="text-[9px] uppercase tracking-widest font-bold px-2 py-0.5 rounded-full border"
            style={{ color: cfg.color, borderColor: `${cfg.color}33`, backgroundColor: `${cfg.color}11` }}
          >
            {event.tag ?? cfg.label}
          </span>
          {event.time && (
            <div className="flex items-center gap-1 text-foreground/30 text-[10px]">
              <Clock className="w-3 h-3" />
              <span>{event.time}</span>
            </div>
          )}
        </div>

        <h4 className="text-[15px] font-bold text-foreground leading-snug mb-1.5 group-hover:text-[#87CEEB] transition-colors duration-300 truncate">
          {event.title}
        </h4>
        {event.description && (
          <p className="text-[12px] text-foreground/50 leading-relaxed font-light line-clamp-2">
            {event.description}
          </p>
        )}
        <div className="flex items-center gap-1.5 mt-2.5 text-foreground/40 text-[11px]">
          <MapPin className="w-3 h-3 flex-shrink-0" style={{ color: cfg.color }} />
          <span className="truncate">{event.location}</span>
        </div>
      </div>

      {/* Arrow */}
      <div
        className="flex-shrink-0 w-7 h-7 rounded-full flex items-center justify-center border transition-all duration-300 group-hover:scale-110"
        style={{
          backgroundColor: hovered ? cfg.color : `${cfg.color}15`,
          borderColor: `${cfg.color}30`,
          color: hovered ? '#fff' : cfg.color,
        }}
      >
        <ArrowRight className="w-3.5 h-3.5" />
      </div>
    </motion.div>
  );
}

// ── ALL tab layout wrapper ────────────────────────────────────────────────────

function AllEventsLayout({ events }) {
  const featuredEvent = events.find(e => e.featured) ?? events[0];
  const rest = events.filter(e => e !== featuredEvent);
  return (
    <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
      <FeaturedLargeCard event={featuredEvent} fullWidth={rest.length === 0} />
      {rest.length > 0 && (
        <div className="lg:col-span-7 flex flex-col gap-5">
          {rest.map((evt, i) => (
            <ListCard key={evt.id} event={evt} index={i} />
          ))}
        </div>
      )}
    </div>
  );
}

// ── Filtered tab: hero banner ─────────────────────────────────────────────────

function HeroCard({ event }) {
  const cfg = TYPE[event.type] ?? TYPE.UPCOMING;
  const cover = event.images?.[0];

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5 }}
      className="relative w-full rounded-2xl overflow-hidden group cursor-pointer border border-border"
      style={{ minHeight: 380 }}
    >
      {/* ── Background ── */}
      {cover ? (
        <>
          <img
            src={cover} alt={event.title}
            className="absolute inset-0 w-full h-full object-cover transition-transform duration-700 group-hover:scale-103"
          />
          {/* Dark overlay over photo — same in both modes; it's intentional cinematic */}
          <div className="absolute inset-0 bg-gradient-to-t from-black/90 via-black/40 to-black/10" />
        </>
      ) : (
        <>
          {/* Light mode: very subtle tinted background */}
          <div
            className="absolute inset-0 dark:hidden"
            style={{ background: `linear-gradient(135deg, ${cfg.color}08 0%, ${cfg.color}18 100%)` }}
          />
          {/* Dark mode: rich gradient */}
          <div className={`absolute inset-0 hidden dark:block bg-gradient-to-br ${cfg.gradient}`} />
        </>
      )}

      {/* Left accent bar */}
      <div className="absolute left-0 top-0 bottom-0 w-1" style={{ backgroundColor: cfg.color }} />

      {/* ── Content ── */}
      <div className="relative z-10 flex flex-col justify-end p-8 md:p-12" style={{ minHeight: 380 }}>

        {/* Tags */}
        <div className="flex flex-wrap items-center gap-2 mb-4">
          <span
            className="text-[10px] font-bold uppercase tracking-widest px-2.5 py-1 rounded-full"
            style={{ background: cfg.bg, color: cfg.color, border: `1px solid ${cfg.color}50` }}
          >
            {cfg.label}
          </span>
          {event.featured && (
            <span className={`text-[10px] font-bold uppercase tracking-widest px-2.5 py-1 rounded-full flex items-center gap-1 border border-yellow-400/30 bg-yellow-400/15 ${
              cover ? 'text-yellow-300' : 'text-yellow-600 dark:text-yellow-300'
            }`}>
              <Star className="w-2.5 h-2.5" /> Featured
            </span>
          )}
          {event.tag && (
            <span className={`text-[10px] font-semibold uppercase tracking-widest px-2.5 py-1 rounded-full ${
              cover
                ? 'bg-white/10 text-white/60 border border-white/10'
                : 'bg-foreground/8 text-foreground/50 dark:bg-white/10 dark:text-white/60 border border-foreground/10 dark:border-white/10'
            }`}>
              {event.tag}
            </span>
          )}
        </div>

        {/* Title */}
        <h2 className={`text-3xl md:text-5xl font-black mb-4 leading-tight tracking-tight max-w-3xl ${
          cover ? 'text-white' : 'text-foreground dark:text-white'
        }`}>
          {event.title}
        </h2>

        {/* Date + location */}
        <div className={`flex flex-wrap gap-5 mb-5 text-sm ${
          cover ? 'text-white/55' : 'text-foreground/55 dark:text-white/55'
        }`}>
          <span className="flex items-center gap-1.5">
            <Calendar className="w-4 h-4" />
            {fmtDate(event.date)}{event.time ? ` · ${event.time}` : ''}
          </span>
          <span className="flex items-center gap-1.5">
            <MapPin className="w-4 h-4" />
            {event.location}
          </span>
        </div>

        {/* Description */}
        {event.description && (
          <p className={`text-base max-w-2xl leading-relaxed mb-7 line-clamp-2 ${
            cover ? 'text-white/65' : 'text-muted-foreground dark:text-white/65'
          }`}>
            {event.description}
          </p>
        )}

        {/* CTA */}
        <div>
          <Link
            to={event.type === 'UPCOMING' ? `/events/${event.id}/rsvp` : '/events'}
            className="inline-flex items-center gap-2 px-7 py-3 rounded-full text-sm font-bold text-white transition-all duration-300 hover:scale-105"
            style={{ backgroundColor: cfg.color, boxShadow: `0 0 28px ${cfg.color}40` }}
          >
            {event.type === 'UPCOMING' ? 'Register Now' : 'View Event'}
            <ArrowUpRight className="w-4 h-4" />
          </Link>
        </div>
      </div>
    </motion.div>
  );
}

// ── Filtered tab: regular event card ─────────────────────────────────────────

function EventCard({ event, index }) {
  const cfg = TYPE[event.type] ?? TYPE.UPCOMING;
  const cover = event.images?.[0];
  const { day, month, year } = parseDateParts(event.date);

  return (
    <motion.div
      initial={{ opacity: 0, y: 18 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.4, delay: index * 0.06 }}
      className="group flex flex-col rounded-2xl overflow-hidden border border-border bg-card hover:border-foreground/20 transition-all duration-300 cursor-pointer hover:-translate-y-1 hover:shadow-xl hover:shadow-black/10 dark:hover:shadow-black/40"
    >
      {/* Cover */}
      <div className="relative aspect-[16/9] overflow-hidden flex-shrink-0">
        {cover ? (
          <>
            <img
              src={cover} alt={event.title}
              className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105"
            />
            <div className="absolute inset-0 bg-gradient-to-t from-black/65 via-black/10 to-transparent" />
            <div className="absolute bottom-3 left-4 flex items-end gap-2">
              <span className="text-4xl font-black text-white leading-none drop-shadow">{day}</span>
              <div className="flex flex-col mb-0.5 drop-shadow">
                <span className="text-sm font-bold leading-tight" style={{ color: cfg.color }}>{month}</span>
                <span className="text-white/50 text-[11px] leading-tight">{year}</span>
              </div>
            </div>
          </>
        ) : (
          <div className="relative w-full h-full flex flex-col items-start justify-end p-4">
            {/* Light mode: subtle tint */}
            <div
              className="absolute inset-0 dark:hidden"
              style={{ background: `linear-gradient(135deg, ${cfg.color}10 0%, ${cfg.color}22 100%)` }}
            />
            {/* Dark mode: original rich gradient */}
            <div className={`absolute inset-0 hidden dark:block bg-gradient-to-br ${cfg.gradient}`} />
            {/* Date */}
            <div className="relative z-10">
              <span className="text-4xl font-black leading-none text-foreground dark:text-white">{day}</span>
              <div className="flex items-center gap-2 mt-1">
                <span className="text-sm font-bold" style={{ color: cfg.color }}>{month}</span>
                <span className="text-foreground/40 dark:text-white/40 text-xs">{year}</span>
              </div>
            </div>
          </div>
        )}

        {/* Type pill — top-left when cover present, top-right otherwise to avoid clash */}
        <span
          className={`absolute top-3 ${cover ? 'right-3' : 'left-3'} text-[10px] font-bold uppercase tracking-widest px-2.5 py-1 rounded-full backdrop-blur-sm`}
          style={{ background: `${cfg.color}28`, color: cfg.color, border: `1px solid ${cfg.color}45` }}
        >
          {cfg.label}
        </span>

        {event.featured && (
          <span className={`absolute top-3 ${cover ? 'left-3' : 'right-3'} w-7 h-7 rounded-full bg-yellow-400/20 border border-yellow-400/30 flex items-center justify-center backdrop-blur-sm`}>
            <Star className="w-3 h-3 text-yellow-300" />
          </span>
        )}
      </div>

      {/* Body */}
      <div className="flex flex-col flex-1 p-5">
        <h3 className="text-foreground font-bold text-base leading-snug mb-2 line-clamp-2 group-hover:text-primary transition-colors duration-200">
          {event.title}
        </h3>

        {event.description && (
          <p className="text-muted-foreground text-sm leading-relaxed line-clamp-2 flex-1 mb-4">
            {event.description}
          </p>
        )}

        {/* Footer meta */}
        <div className="mt-auto pt-3 border-t border-border space-y-1.5">
          {event.time && (
            <div className="flex items-center gap-1.5 text-muted-foreground text-xs">
              <Clock className="w-3 h-3 flex-shrink-0" style={{ color: cfg.color }} />
              <span>{event.time}</span>
            </div>
          )}
          <div className="flex items-center justify-between gap-2">
            <div className="flex items-center gap-1.5 text-muted-foreground text-xs min-w-0">
              <MapPin className="w-3 h-3 flex-shrink-0" style={{ color: cfg.color }} />
              <span className="truncate">{event.location}</span>
            </div>
            <Link
              to={event.type === 'UPCOMING' ? `/events/${event.id}/rsvp` : '/events'}
              className="flex-shrink-0 inline-flex items-center gap-1 text-xs font-semibold transition-all duration-200 group-hover:gap-2"
              style={{ color: cfg.color }}
            >
              {event.type === 'UPCOMING' ? 'Register' : 'Details'}
              <ChevronRight className="w-3.5 h-3.5" />
            </Link>
          </div>
        </div>
      </div>
    </motion.div>
  );
}

// ── Page ──────────────────────────────────────────────────────────────────────

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

  const filtered = filter === 'ALL'
    ? events
    : events.filter(e => e.type === filter);

  const counts = TABS.reduce((acc, t) => {
    acc[t.key] = t.key === 'ALL' ? events.length : events.filter(e => e.type === t.key).length;
    return acc;
  }, {});

  const featuredEvent = filtered.find(e => e.featured);
  const restEvents = filtered.filter(e => !e.featured || !featuredEvent);

  return (
    <div className="min-h-screen bg-background text-foreground">

      {/* ── Hero section ── */}
      <div className="max-w-7xl mx-auto px-6 pt-20 pb-10">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          className="max-w-2xl"
        >
          <span className="text-primary dark:text-secondary text-xs font-semibold uppercase tracking-widest mb-3 block">
            Gather · Serve · Grow
          </span>
          <h1 className="text-4xl md:text-5xl font-black text-foreground tracking-tight leading-tight mb-4">
            Ministry Events
          </h1>
          <p className="text-muted-foreground text-base leading-relaxed">
            From conferences and outreach missions to intimate home fellowships — every gathering is a moment of purpose.
          </p>
        </motion.div>
      </div>

      {/* ── Filter tabs ── */}
      <div className="sticky top-[64px] z-20 bg-background/80 backdrop-blur-md border-b border-border">
        <div className="max-w-7xl mx-auto px-6">
          <div className="flex items-center gap-1 overflow-x-auto scrollbar-none py-1">
            {TABS.map(tab => {
              const active = filter === tab.key;
              const count = counts[tab.key];
              const tabColor = tab.key !== 'ALL' ? (TYPE[tab.key]?.color ?? '#0096FF') : '#0096FF';
              return (
                <button
                  key={tab.key}
                  onClick={() => setFilter(tab.key)}
                  className={`relative flex items-center gap-2 px-4 py-2.5 text-sm font-semibold whitespace-nowrap transition-all duration-200 cursor-pointer rounded-none ${
                    active ? '' : 'text-muted-foreground hover:text-foreground'
                  }`}
                  style={active ? { color: tabColor } : {}}
                >
                  {tab.label}
                  {!loading && count > 0 && (
                    <span
                      className={`text-[10px] font-bold px-1.5 py-0.5 rounded-full transition-all ${
                        active ? '' : 'bg-muted text-muted-foreground'
                      }`}
                      style={active ? { background: `${tabColor}20`, color: tabColor } : {}}
                    >
                      {count}
                    </span>
                  )}
                  {active && (
                    <motion.div
                      layoutId="tab-indicator"
                      className="absolute bottom-0 left-0 right-0 h-0.5 rounded-full"
                      style={{ backgroundColor: tabColor }}
                      transition={{ type: 'spring', stiffness: 500, damping: 35 }}
                    />
                  )}
                </button>
              );
            })}
          </div>
        </div>
      </div>

      {/* ── Content ── */}
      <div className="max-w-7xl mx-auto px-6 py-14">
        {error && (
          <div className="rounded-2xl border border-destructive/20 bg-destructive/5 px-5 py-4 text-destructive text-sm flex items-center gap-3 mb-8">
            <span className="font-semibold">Error:</span> {error}
            <button onClick={load} className="ml-auto text-xs underline cursor-pointer hover:no-underline">Retry</button>
          </div>
        )}

        <AnimatePresence mode="wait">
          <motion.div
            key={filter}
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -6 }}
            transition={{ duration: 0.25 }}
          >
            {/* Loading */}
            {loading && (
              filter === 'ALL'
                ? <SkeletonAllLayout />
                : (
                  <div className="space-y-5">
                    <SkeletonHero />
                    <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-5">
                      <SkeletonCard /><SkeletonCard /><SkeletonCard />
                    </div>
                  </div>
                )
            )}

            {/* Empty */}
            {!loading && filtered.length === 0 && !error && (
              <EmptyState typeKey={filter} />
            )}

            {/* ALL tab: featured-left + list-right */}
            {!loading && filtered.length > 0 && filter === 'ALL' && (
              <AllEventsLayout events={filtered} />
            )}

            {/* Filtered tabs: hero banner + image card grid */}
            {!loading && filtered.length > 0 && filter !== 'ALL' && (
              <div className="space-y-5">
                {featuredEvent && <HeroCard event={featuredEvent} />}
                {restEvents.length > 0 && (
                  <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-5">
                    {restEvents.map((evt, i) => (
                      <EventCard key={evt.id} event={evt} index={i} />
                    ))}
                  </div>
                )}
              </div>
            )}
          </motion.div>
        </AnimatePresence>
      </div>
    </div>
  );
}
