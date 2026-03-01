import { motion } from 'framer-motion'
import {
  Newspaper,
  BarChart2,
  Globe,
  UserCheck,
  CalendarDays,
  Bell,
} from 'lucide-react'

const topCards = [
  {
    icon: Newspaper,
    label: 'WSJ Live',
    desc: 'Real-time headlines',
  },
  {
    icon: BarChart2,
    label: 'Market Data',
    desc: 'Live quotes',
    lime: true,
  },
]

const infoCards = [
  {
    icon: Globe,
    label: 'World Report',
    desc: 'Latest global news roundup curated daily',
  },
  {
    icon: UserCheck,
    label: 'Top Analysts',
    desc: 'Featured expert perspectives and insights',
  },
  {
    icon: CalendarDays,
    label: 'Earnings Calendar',
    desc: 'Upcoming corporate earnings & reports',
  },
  {
    icon: Bell,
    label: 'Alerts',
    desc: 'Set custom keyword notification rules',
  },
]

export default function RightPanel() {
  return (
    <div className="w-[260px] flex-shrink-0 bg-[#EFEFED] border-l border-[#e5e5e3] flex flex-col overflow-y-auto px-4 py-6 gap-4">
      {/* Top 2-col grid */}
      <div className="grid grid-cols-2 gap-2.5">
        {topCards.map((card, i) => (
          <motion.div
            key={card.label}
            className="rounded-2xl p-3.5 flex flex-col items-start gap-2 border"
            style={
              card.lime
                ? { backgroundColor: '#C8F53A', borderColor: '#b8e530' }
                : { backgroundColor: '#fff', borderColor: '#ebebeb' }
            }
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: i * 0.07 }}
          >
            <div
              className="w-8 h-8 rounded-xl flex items-center justify-center"
              style={{ backgroundColor: card.lime ? '#1a1a1a' : '#f0f0ee' }}
            >
              <card.icon
                size={15}
                strokeWidth={2}
                style={{ color: card.lime ? '#C8F53A' : '#555' }}
              />
            </div>
            <div>
              <p className="text-[12px] font-semibold leading-tight" style={{ color: '#1a1a1a' }}>
                {card.label}
              </p>
              <p className="text-[10px] mt-0.5" style={{ color: card.lime ? '#1a1a1a99' : '#aaa' }}>
                {card.desc}
              </p>
            </div>
          </motion.div>
        ))}
      </div>

      {/* Divider */}
      <div className="h-px bg-[#e0e0de]" />

      {/* Info cards */}
      <div className="flex flex-col gap-2.5">
        {infoCards.map((card, i) => (
          <motion.div
            key={card.label}
            className="bg-white rounded-2xl p-3.5 flex items-start gap-3 border border-[#ebebeb] text-left"
            initial={{ opacity: 0, x: 12 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: 0.1 + i * 0.07 }}
          >
            <div className="w-7 h-7 rounded-xl bg-[#f0f0ee] flex items-center justify-center flex-shrink-0 mt-0.5">
              <card.icon size={14} strokeWidth={1.8} className="text-[#666]" />
            </div>
            <div>
              <p className="text-[12px] font-semibold text-[#1a1a1a] leading-tight">
                {card.label}
              </p>
              <p className="text-[11px] text-[#aaa] mt-0.5 leading-snug">
                {card.desc}
              </p>
            </div>
          </motion.div>
        ))}
      </div>
    </div>
  )
}
