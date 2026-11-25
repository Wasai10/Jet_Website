import { Link } from 'react-router-dom'
import {
  Info, Calendar, Heart, Images, BookOpen, Phone, ArrowUpRight
} from 'lucide-react'

const actions = [
  {
    title: 'Learn About Us',
    desc: 'Our roots, founder & vision',
    href: '/about',
    icon: Info,
    color: 'from-blue-600/20 to-blue-500/5',
    iconColor: 'text-[#0096FF]',
    borderColor: 'border-blue-500/20',
  },
  {
    title: 'Upcoming Events',
    desc: 'Services, conferences & RSVP',
    href: '/events',
    icon: Calendar,
    color: 'from-emerald-600/20 to-emerald-500/5',
    iconColor: 'text-emerald-400',
    borderColor: 'border-emerald-500/20',
  },
  {
    title: 'Giving & Tithes',
    desc: 'Easy M-Pesa & bank giving',
    href: '/giving',
    icon: Heart,
    color: 'from-amber-600/20 to-amber-500/5',
    iconColor: 'text-amber-400',
    borderColor: 'border-amber-500/20',
  },
  {
    title: 'Explore Gallery',
    desc: 'Outreach & fellowship photos',
    href: '/gallery',
    icon: Images,
    color: 'from-purple-600/20 to-purple-500/5',
    iconColor: 'text-purple-400',
    borderColor: 'border-purple-500/20',
  },
  {
    title: 'Sermons & Blogs',
    desc: 'Pastoral messages & wisdom',
    href: '/blog',
    icon: BookOpen,
    color: 'from-cyan-600/20 to-cyan-500/5',
    iconColor: 'text-cyan-400',
    borderColor: 'border-cyan-500/20',
  },
  {
    title: 'Contact Us',
    desc: 'Prayer requests & inquiries',
    href: '/about',
    icon: Phone,
    color: 'from-rose-600/20 to-rose-500/5',
    iconColor: 'text-rose-400',
    borderColor: 'border-rose-500/20',
  },
]

export default function QuickLinks() {
  return (
    <section className="relative w-full py-8 sm:py-12 bg-background border-b border-border/60">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 md:px-8">
        <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-2 mb-6">
          <div>
            <span className="text-[11px] sm:text-xs font-bold uppercase tracking-widest text-primary">
              Quick Access Hub
            </span>
            <h2 className="text-xl sm:text-2xl font-black text-foreground tracking-tight">
              What are you looking for?
            </h2>
          </div>
          <p className="text-xs sm:text-sm text-muted-foreground">
            Tap any section below for instant access
          </p>
        </div>

        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-2.5 sm:gap-3.5">
          {actions.map((item) => {
            const Icon = item.icon
            return (
              <Link
                key={item.title}
                to={item.href}
                className={`group flex flex-col justify-between p-3.5 sm:p-4 rounded-2xl bg-gradient-to-br ${item.color} bg-card border ${item.borderColor} hover:border-primary/50 transition-all duration-200 active:scale-95 shadow-xs hover:shadow-md touch-manipulation`}
              >
                <div className="flex items-center justify-between mb-3">
                  <div className={`w-8 h-8 rounded-xl bg-background/80 border border-white/10 flex items-center justify-center shrink-0 ${item.iconColor}`}>
                    <Icon className="w-4 h-4" />
                  </div>
                  <ArrowUpRight className="w-3.5 h-3.5 text-muted-foreground/40 group-hover:text-primary transition-colors" />
                </div>

                <div>
                  <h3 className="text-xs sm:text-sm font-bold text-foreground leading-snug group-hover:text-primary transition-colors">
                    {item.title}
                  </h3>
                  <p className="text-[10px] sm:text-xs text-muted-foreground mt-0.5 line-clamp-1">
                    {item.desc}
                  </p>
                </div>
              </Link>
            )
          })}
        </div>
      </div>
    </section>
  )
}
