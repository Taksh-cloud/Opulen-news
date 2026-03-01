import { motion } from 'framer-motion'
import { useEffect, useState } from 'react'
import { Newspaper, Flame, Zap } from 'lucide-react'
import useNewsStore from '../store/useNewsStore'

function useCountUp(target, duration = 900) {
  const [count, setCount] = useState(0)
  useEffect(() => {
    let start = 0
    const steps = 40
    const increment = target / steps
    const interval = duration / steps
    const timer = setInterval(() => {
      start += increment
      if (start >= target) {
        setCount(target)
        clearInterval(timer)
      } else {
        setCount(Math.floor(start))
      }
    }, interval)
    return () => clearInterval(timer)
  }, [target, duration])
  return count
}

function PillBar({ total = 8, filled, variant }) {
  const filled_color =
    variant === 'lime' ? 'bg-[#1a1a1a]' : 'bg-white'
  const empty_color =
    variant === 'lime' ? 'bg-[#1a1a1a]/20' : 'bg-white/20'

  return (
    <div className="flex gap-1 mt-4">
      {Array.from({ length: total }).map((_, i) => (
        <motion.div
          key={i}
          className={`h-2 flex-1 rounded-full ${i < filled ? filled_color : empty_color}`}
          initial={{ scaleX: 0, originX: 0 }}
          animate={{ scaleX: 1 }}
          transition={{ delay: 0.3 + i * 0.04, duration: 0.25, ease: 'easeOut' }}
        />
      ))}
    </div>
  )
}

function StatCard({ variant, icon: Icon, label, value, outOf, pct, pillFilled }) {
  const displayCount = useCountUp(value, 900)

  const isDark = variant === 'dark'
  const isLime = variant === 'lime'

  return (
    <motion.div
      className={`rounded-3xl p-5 flex flex-col justify-between ${
        isDark ? 'bg-[#1a1a1a] text-white' : isLime ? 'bg-[#C8F53A] text-[#1a1a1a]' : ''
      }`}
      initial={{ opacity: 0, y: 16 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.4, ease: 'easeOut' }}
      whileHover={{ y: -2, transition: { duration: 0.2 } }}
      style={{ minHeight: 148 }}
    >
      {/* Top row */}
      <div className="flex items-center justify-between">
        <div className={`flex items-center gap-2 text-[12px] font-medium ${isDark ? 'text-white/70' : 'text-[#1a1a1a]/70'}`}>
          <Icon size={13} strokeWidth={2} />
          {label}
        </div>
        <div className={`text-[12px] font-semibold px-2 py-0.5 rounded-full ${
          isDark ? 'bg-white/10 text-white/80' : 'bg-[#1a1a1a]/10 text-[#1a1a1a]/70'
        }`}>
          {pct}%
        </div>
      </div>

      {/* Number */}
      <div className="mt-2">
        <div className="flex items-baseline gap-1.5">
          <span className="text-[36px] font-bold leading-none tracking-tight">
            {displayCount}
          </span>
          <span className={`text-[13px] font-normal ${isDark ? 'text-white/50' : 'text-[#1a1a1a]/50'}`}>
            /{outOf}
          </span>
        </div>
      </div>

      {/* Pill bar */}
      <PillBar total={8} filled={pillFilled} variant={isLime ? 'lime' : 'dark'} />
    </motion.div>
  )
}

function LiveCard({ total }) {
  const count = useCountUp(total, 900)

  return (
    <motion.div
      className="rounded-3xl bg-[#1a1a1a] text-white p-5 flex flex-col justify-between relative overflow-hidden"
      initial={{ opacity: 0, y: 16 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.4, delay: 0.1, ease: 'easeOut' }}
      whileHover={{ y: -2, transition: { duration: 0.2 } }}
      style={{ minHeight: 148 }}
    >
      {/* Decorative glow */}
      <div className="absolute -right-6 -top-6 w-28 h-28 bg-[#C8F53A]/10 rounded-full blur-2xl pointer-events-none" />

      <div className="relative z-10">
        <div className="flex items-center gap-2 mb-3">
          <motion.div
            className="w-2 h-2 bg-[#C8F53A] rounded-full"
            animate={{ scale: [1, 1.4, 1], opacity: [1, 0.6, 1] }}
            transition={{ duration: 1.5, repeat: Infinity, ease: 'easeInOut' }}
          />
          <span className="text-[11px] font-semibold text-white/60 uppercase tracking-widest">
            Live Feed
          </span>
        </div>
        <div className="flex items-baseline gap-1.5 mb-1">
          <span className="text-[36px] font-bold leading-none tracking-tight">
            {count}
          </span>
          <span className="text-[13px] text-white/50">articles</span>
        </div>
        <p className="text-[12px] text-white/50 leading-snug">
          Scraped live from WSJ today
        </p>
      </div>

      <div className="relative z-10 flex items-center gap-2 mt-3">
        <Zap size={12} strokeWidth={2.5} className="text-[#C8F53A]" />
        <span className="text-[11px] font-semibold text-[#C8F53A]">19 sections monitored</span>
      </div>
    </motion.div>
  )
}

export default function StatsCards() {
  const articles = useNewsStore((s) => s.articles)
  const total = articles.length
  const categories = [...new Set(articles.map((a) => a.category))].length

  return (
    <div className="grid grid-cols-3 gap-4">
      <StatCard
        variant="dark"
        icon={Newspaper}
        label="Total Articles"
        value={total}
        outOf={400}
        pct={Math.min(Math.round((total / 400) * 100), 100)}
        pillFilled={Math.min(Math.round((total / 400) * 8), 8)}
      />
      <StatCard
        variant="lime"
        icon={Flame}
        label="Categories"
        value={categories}
        outOf={7}
        pct={Math.round((categories / 7) * 100)}
        pillFilled={Math.min(categories, 8)}
      />
      <LiveCard total={total} />
    </div>
  )
}
