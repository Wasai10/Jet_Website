import { useState, useEffect } from 'react'
import { motion } from 'framer-motion'
import { Calendar, MapPin, Clock, ArrowRight, ChevronRight, CalendarX2 } from 'lucide-react'
import { Link } from 'react-router-dom'
import { eventsService } from '@/api/events.service'

// ── Config ────────────────────────────────────────────────────────────────────

const TYPE_COLOR = {
  UPCOMING:        '#0096FF',
  PAST:            '#64748B',
  HOME_FELLOWSHIP: '#A855F7',
  WORSHIP:         '#F59E0B',
  CONFERENCE:      '#EC4899',
  OUTREACH:        '#14B8A6',
  YOUTH:           '#EF4444',
  PRAYER:          '#87CEEB',
  SPECIAL:         '#6366F1',
}

// ── Helpers ───────────────────────────────────────────────────────────────────

function parseDateParts(iso) {
  const d = new Date(iso)
  return {
    day:   String(d.getDate()).padStart(2, '0'),
    month: d.toLocaleDateString('en-GB', { month: 'short' }).toUpperCase(),
    year:  String(d.getFullYear()),
  }
}

function getColor(event) {
  return event.color ?? TYPE_COLOR[event.type] ?? '#0096FF'
}

// ── Skeletons ─────────────────────────────────────────────────────────────────

function SkeletonFeatured() {
  return (
    <div className="lg:col-span-5 bg-foreground/5 border border-foreground/10 rounded-2xl p-7 animate-pulse">
      <div className="flex items-center justify-between mb-6">
        <div className="h-5 w-20 bg-foreground/10 rounded-full" />
        <div className="h-4 w-10 bg-foreground/8 rounded-full" />
      </div>
      <div className="flex items-end gap-2 mb-5">
        <div className="h-16 w-14 bg-foreground/10 rounded-lg" />
        <div className="space-y-1 mb-1">
          <div className="h-3 w-8 bg-foreground/10 rounded-full" />
          <div className="h-3 w-10 bg-foreground/8 rounded-full" />
        </div>
      </div>
      <div className="space-y-2 mb-6">
        <div className="h-5 w-3/4 bg-foreground/10 rounded-full" />
        <div className="h-4 w-full bg-foreground/8 rounded-full" />
        <div className="h-4 w-5/6 bg-foreground/8 rounded-full" />
      </div>
      <div className="space-y-2">
        <div className="h-3 w-44 bg-foreground/8 rounded-full" />
        <div className="h-3 w-36 bg-foreground/8 rounded-full" />
      </div>
    </div>
  )
}

function SkeletonListCard() {
  return (
    <div className="relative flex items-start gap-5 bg-foreground/5 border border-foreground/10 rounded-xl p-5 animate-pulse">
      <div className="w-12 pl-3 space-y-1.5">
        <div className="h-7 w-7 bg-foreground/10 rounded" />
        <div className="h-2.5 w-6 bg-foreground/8 rounded-full" />
      </div>
      <div className="w-px self-stretch bg-foreground/5 flex-shrink-0" />
      <div className="flex-1 space-y-2">
        <div className="h-3.5 w-1/3 bg-foreground/8 rounded-full" />
        <div className="h-4 w-2/3 bg-foreground/10 rounded-full" />
        <div className="h-3 w-1/2 bg-foreground/8 rounded-full" />
      </div>
      <div className="w-7 h-7 rounded-full bg-foreground/8 flex-shrink-0" />
    </div>
  )
}

// ── Empty state ───────────────────────────────────────────────────────────────

function EmptyState() {
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.55 }}
      className="col-span-12 flex flex-col items-center justify-center py-20 gap-6 text-center"
    >
      {/* Pulsing rings */}
      <div className="relative flex items-center justify-center">
        {[56, 92, 128].map((size, i) => (
          <motion.div
            key={size}
            className="absolute rounded-full border border-[#0096FF]"
            style={{ width: size, height: size, opacity: 0 }}
            animate={{ opacity: [0, 0.15, 0], scale: [0.88, 1.04, 1.04] }}
            transition={{ duration: 2.6, repeat: Infinity, delay: i * 0.55, ease: 'easeOut' }}
          />
        ))}
        <div className="w-16 h-16 rounded-2xl bg-[#0096FF]/10 border border-[#0096FF]/20 flex items-center justify-center relative z-10">
          <CalendarX2 className="w-7 h-7 text-[#0096FF]" />
        </div>
      </div>

      {/* Copy */}
      <div className="space-y-2">
        <p className="text-foreground font-bold text-xl">No events scheduled yet</p>
        <p className="text-foreground/45 text-sm max-w-xs leading-relaxed">
          We're planning something meaningful. Come back soon — great things are on the way.
        </p>
      </div>

      {/* CTA */}
      <Link
        to="/events"
        className="inline-flex items-center gap-2 px-6 py-2.5 rounded-full text-sm font-semibold text-[#0096FF] border border-[#0096FF]/30 bg-[#0096FF]/8 hover:bg-[#0096FF] hover:text-white transition-all duration-300"
      >
        <Calendar className="w-4 h-4" />
        <span>Browse events page</span>
      </Link>
    </motion.div>
  )
}

// ── Main section ──────────────────────────────────────────────────────────────

export default function Events() {
  const [events, setEvents]   = useState([])
  const [loading, setLoading] = useState(true)
  const [hovered, setHovered] = useState(null)

  useEffect(() => {
    eventsService
      .getAll()
      .then(data => {
        // Non-past upcoming first (nearest date), then past (most recent)
        const upcoming = [...data]
          .filter(e => e.type !== 'PAST')
          .sort((a, b) => new Date(a.date) - new Date(b.date))
        const past = [...data]
          .filter(e => e.type === 'PAST')
          .sort((a, b) => new Date(b.date) - new Date(a.date))
        setEvents([...upcoming, ...past])
      })
      .catch(() => setEvents([]))
      .finally(() => setLoading(false))
  }, [])

  const featured = events.find(e => e.featured) ?? events[0]
  const rest     = featured ? events.filter(e => e !== featured).slice(0, 3) : []

  return (
    <section
      id="events"
      className="relative w-full py-20 md:py-28 bg-background dark:bg-[#00111F] text-foreground overflow-hidden"
    >
      {/* Background glow blobs */}
      <div className="absolute top-0 left-1/4 w-96 h-96 bg-[radial-gradient(circle,rgba(0,150,255,0.06),transparent_60%)] pointer-events-none" />
      <div className="absolute bottom-0 right-1/4 w-96 h-96 bg-[radial-gradient(circle,rgba(135,206,235,0.05),transparent_60%)] pointer-events-none" />

      {/* Dot grid texture */}
      <div
        className="absolute inset-0 opacity-[0.03] pointer-events-none"
        style={{
          backgroundImage: 'radial-gradient(rgba(100,100,100,0.3) 1px, transparent 1px)',
          backgroundSize: '28px 28px',
        }}
      />

      <div className="relative max-w-7xl mx-auto px-6">

        {/* ── Section header ── */}
        <motion.div
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, amount: 0.5 }}
          variants={{
            hidden:   { opacity: 0, y: -20 },
            visible:  { opacity: 1, y: 0, transition: { duration: 0.6 } },
          }}
          className="flex flex-col md:flex-row md:items-end md:justify-between gap-4 mb-14"
        >
          <div>
            <span className="text-[#0096FF] dark:text-[#87CEEB] text-xs font-semibold uppercase tracking-widest mb-3 block">
              What's Coming Up
            </span>
            <h2 className="text-3xl md:text-4xl font-bold text-foreground tracking-tight leading-tight">
              Upcoming Events
            </h2>
          </div>

          <Link
            to="/events"
            className="flex items-center space-x-2 text-sm font-semibold text-[#0096FF] dark:text-[#87CEEB] hover:text-foreground transition-colors duration-300 group self-start md:self-auto"
          >
            <span>View all events</span>
            <ChevronRight className="w-4 h-4 transition-transform duration-300 group-hover:translate-x-1" />
          </Link>
        </motion.div>

        {/* ── Grid ── */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">

          {/* Loading state */}
          {loading && (
            <>
              <SkeletonFeatured />
              <div className="lg:col-span-7 flex flex-col gap-5">
                <SkeletonListCard />
                <SkeletonListCard />
                <SkeletonListCard />
              </div>
            </>
          )}

          {/* Empty state */}
          {!loading && events.length === 0 && <EmptyState />}

          {/* ── Featured event card (left) ── */}
          {!loading && featured && (() => {
            const color = getColor(featured)
            const { day, month, year } = parseDateParts(featured.date)
            return (
              <motion.div
                initial={{ opacity: 0, x: -30 }}
                whileInView={{ opacity: 1, x: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.8, ease: 'easeOut' }}
                className="lg:col-span-5 relative bg-foreground/5 backdrop-blur-sm border border-foreground/10 rounded-2xl overflow-hidden p-7 flex flex-col justify-between transition-all duration-300 hover:bg-foreground/10 hover:border-foreground/15 hover:shadow-[0_12px_40px_rgba(0,150,255,0.08)] group cursor-pointer"
              >
                {/* Top accent line */}
                <div
                  className="absolute top-0 left-0 right-0 h-0.5 opacity-60"
                  style={{ background: `linear-gradient(to right, ${color}, transparent)` }}
                />

                {/* Tag + year */}
                <div className="flex items-center justify-between mb-6">
                  <span
                    className="text-[10px] uppercase tracking-widest font-bold px-3 py-1 rounded-full border"
                    style={{ color, backgroundColor: `${color}18`, borderColor: `${color}30` }}
                  >
                    {featured.tag ?? featured.type}
                  </span>
                  <div className="flex items-center space-x-1.5 text-foreground/40 text-xs">
                    <Calendar className="w-3.5 h-3.5" />
                    <span>{year}</span>
                  </div>
                </div>

                {/* Date block */}
                <div className="mb-5">
                  <div className="flex items-end space-x-2">
                    <span className="text-6xl font-black text-foreground leading-none">{day}</span>
                    <div className="flex flex-col mb-1">
                      <span className="text-sm font-bold leading-tight" style={{ color }}>{month}</span>
                      <span className="text-foreground/30 text-xs leading-tight">{year}</span>
                    </div>
                  </div>
                </div>

                {/* Title + description */}
                <div className="flex-grow">
                  <h3 className="text-xl font-bold text-foreground leading-snug mb-3 group-hover:text-[#87CEEB] transition-colors duration-300">
                    {featured.title}
                  </h3>
                  {featured.description && (
                    <p className="text-sm text-foreground/60 leading-relaxed font-light line-clamp-3">
                      {featured.description}
                    </p>
                  )}
                </div>

                {/* Meta */}
                <div className="mt-6 space-y-2">
                  {featured.time && (
                    <div className="flex items-center space-x-2 text-foreground/50 text-xs">
                      <Clock className="w-3.5 h-3.5" style={{ color }} />
                      <span>{featured.time}</span>
                    </div>
                  )}
                  <div className="flex items-center space-x-2 text-foreground/50 text-xs">
                    <MapPin className="w-3.5 h-3.5" style={{ color }} />
                    <span>{featured.location}</span>
                  </div>
                </div>

                {/* CTA */}
                <Link
                  to="/events"
                  className="mt-7 flex items-center space-x-2.5 text-xs uppercase tracking-widest font-semibold transition-colors duration-300 group/btn w-fit"
                  style={{ color }}
                >
                  <span>{featured.type === 'UPCOMING' ? 'Register Now' : 'Learn More'}</span>
                  <div
                    className="w-7 h-7 rounded-full flex items-center justify-center border transition-all duration-300 group-hover/btn:scale-110"
                    style={{ backgroundColor: `${color}20`, borderColor: `${color}30` }}
                  >
                    <ArrowRight className="w-3.5 h-3.5" />
                  </div>
                </Link>
              </motion.div>
            )
          })()}

          {/* ── List cards (right) ── */}
          {!loading && rest.length > 0 && (
            <div className="lg:col-span-7 flex flex-col gap-5">
              {rest.map((event, idx) => {
                const color = getColor(event)
                const { day, month } = parseDateParts(event.date)
                const isHovered = hovered === event.id
                return (
                  <motion.div
                    key={event.id}
                    initial={{ opacity: 0, x: 30 }}
                    whileInView={{ opacity: 1, x: 0 }}
                    viewport={{ once: true }}
                    transition={{ duration: 0.6, delay: idx * 0.12, ease: 'easeOut' }}
                    className="relative flex items-start space-x-5 bg-foreground/5 backdrop-blur-sm border border-foreground/10 rounded-xl p-5 transition-all duration-300 hover:bg-foreground/10 hover:border-foreground/15 hover:scale-[1.01] hover:shadow-[0_8px_24px_rgba(0,150,255,0.06)] group cursor-pointer"
                    onMouseEnter={() => setHovered(event.id)}
                    onMouseLeave={() => setHovered(null)}
                  >
                    {/* Left accent line */}
                    <div
                      className="absolute left-0 top-4 bottom-4 w-0.5 rounded-full opacity-50"
                      style={{ backgroundColor: color }}
                    />

                    {/* Date block */}
                    <div className="flex-shrink-0 text-center w-12 pl-3">
                      <div className="text-2xl font-black text-foreground leading-none">{day}</div>
                      <div
                        className="text-[10px] font-bold uppercase tracking-widest mt-0.5"
                        style={{ color }}
                      >
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
                          style={{
                            color,
                            borderColor: `${color}33`,
                            backgroundColor: `${color}11`,
                          }}
                        >
                          {event.tag ?? event.type}
                        </span>
                        {event.time && (
                          <div className="flex items-center space-x-1 text-foreground/30 text-[10px]">
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

                      <div className="flex items-center space-x-1.5 mt-2.5 text-foreground/40 text-[11px]">
                        <MapPin className="w-3 h-3 flex-shrink-0" style={{ color }} />
                        <span className="truncate">{event.location}</span>
                      </div>
                    </div>

                    {/* Arrow */}
                    <div
                      className="flex-shrink-0 w-7 h-7 rounded-full flex items-center justify-center border transition-all duration-300 group-hover:scale-110"
                      style={{
                        backgroundColor: isHovered ? color : `${color}15`,
                        borderColor: `${color}30`,
                        color: isHovered ? '#fff' : color,
                      }}
                    >
                      <ArrowRight className="w-3.5 h-3.5" />
                    </div>
                  </motion.div>
                )
              })}

              {/* "See more" nudge when there are more events than the 3 shown */}
              {events.length > 4 && (
                <motion.div
                  initial={{ opacity: 0 }}
                  whileInView={{ opacity: 1 }}
                  viewport={{ once: true }}
                  transition={{ delay: 0.4 }}
                >
                  <Link
                    to="/events"
                    className="flex items-center justify-center gap-2 w-full py-3 rounded-xl border border-foreground/10 text-foreground/45 hover:text-foreground hover:border-foreground/20 hover:bg-foreground/5 text-sm font-medium transition-all duration-200 group"
                  >
                    <span>+{events.length - 4} more events</span>
                    <ChevronRight className="w-4 h-4 transition-transform duration-200 group-hover:translate-x-1" />
                  </Link>
                </motion.div>
              )}
            </div>
          )}
        </div>
      </div>
    </section>
  )
}
