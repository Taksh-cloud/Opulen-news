import { motion } from 'framer-motion'
import { chartData } from '../data/mockData'
import { ChevronDown } from 'lucide-react'

const CHART_H = 140

function ChartBar({ pct, color, dotBorder, delay = 0 }) {
  return (
    <div
      className="relative rounded-full w-[18px] flex-shrink-0"
      style={{ height: CHART_H, backgroundColor: '#e8e8e5' }}
    >
      <motion.div
        className="absolute bottom-0 left-0 right-0 rounded-full"
        style={{ backgroundColor: color }}
        initial={{ height: '0%' }}
        animate={{ height: `${pct}%` }}
        transition={{ duration: 0.8, delay, ease: [0.34, 1.1, 0.64, 1] }}
      >
        {/* Dot at top of fill */}
        <div
          className="absolute left-1/2 bg-white rounded-full"
          style={{
            width: 14,
            height: 14,
            top: -7,
            transform: 'translateX(-50%)',
            border: `2.5px solid ${color}`,
            boxShadow: `0 0 0 2px #fff`,
          }}
        />
      </motion.div>
    </div>
  )
}

export default function VolumeChart() {
  const maxVal = Math.max(...chartData.map((d) => Math.max(d.articles, d.breaking)))
  const todayIndex = chartData.length - 1

  return (
    <motion.div
      className="bg-white rounded-3xl p-5"
      initial={{ opacity: 0, y: 12 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.4, delay: 0.15 }}
    >
      {/* Header */}
      <div className="flex items-center justify-between mb-4">
        <div className="flex items-center gap-4">
          <span className="text-[15px] font-semibold text-[#1a1a1a]">Article Volume</span>
          <div className="flex items-center gap-3">
            <div className="flex items-center gap-1.5">
              <div className="w-2 h-2 rounded-full bg-[#1a1a1a]" />
              <span className="text-[11px] text-[#999]">Articles</span>
            </div>
            <div className="flex items-center gap-1.5">
              <div className="w-2 h-2 rounded-full bg-[#C8F53A]" />
              <span className="text-[11px] text-[#999]">Breaking</span>
            </div>
          </div>
        </div>
        <motion.button
          className="flex items-center gap-1 text-[12px] font-medium text-[#555] bg-[#f5f5f3] border border-[#e8e8e8] px-3 py-1.5 rounded-full"
          whileHover={{ scale: 1.02 }}
          whileTap={{ scale: 0.98 }}
        >
          2026
          <ChevronDown size={11} strokeWidth={2} />
        </motion.button>
      </div>

      {/* Y-axis + bars */}
      <div className="flex gap-3 items-end">
        {/* Y-axis labels */}
        <div
          className="flex flex-col justify-between text-right"
          style={{ height: CHART_H, paddingTop: 6 }}
        >
          {[1.0, 0.8, 0.6, 0.4, 0.2].map((v) => (
            <span key={v} className="text-[10px] text-[#bbb] leading-none">
              {v.toFixed(1)}
            </span>
          ))}
        </div>

        {/* Bars */}
        <div className="flex-1 flex items-end justify-between gap-1.5">
          {chartData.map((d, i) => {
            const isToday = i === todayIndex
            const artPct = Math.round((d.articles / maxVal) * 100)
            const brePct = Math.round((d.breaking / maxVal) * 100)

            return (
              <div key={d.day} className="flex flex-col items-center gap-1.5">
                {/* Highlighted container */}
                <div
                  className={`flex gap-1 items-end p-1.5 rounded-2xl transition-all ${
                    isToday
                      ? 'border border-dashed border-[#ccc] bg-[#fafafa]'
                      : ''
                  }`}
                >
                  {/* Percentage labels on today */}
                  {isToday && (
                    <div className="absolute -mt-6 flex gap-3">
                      {/* labels appear via AnimatePresence above bars */}
                    </div>
                  )}
                  <div className="relative flex flex-col items-center gap-0.5">
                    {isToday && (
                      <motion.span
                        className="text-[9px] font-bold bg-[#1a1a1a] text-white px-1.5 py-0.5 rounded-full mb-1"
                        initial={{ opacity: 0, y: 4 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: 0.9 }}
                      >
                        {artPct}%
                      </motion.span>
                    )}
                    <ChartBar
                      pct={artPct}
                      color="#1a1a1a"
                      delay={i * 0.05}
                    />
                  </div>
                  <div className="relative flex flex-col items-center gap-0.5">
                    {isToday && (
                      <motion.span
                        className="text-[9px] font-bold bg-[#C8F53A] text-[#1a1a1a] px-1.5 py-0.5 rounded-full mb-1"
                        initial={{ opacity: 0, y: 4 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: 0.95 }}
                      >
                        {brePct}%
                      </motion.span>
                    )}
                    <ChartBar
                      pct={brePct}
                      color="#C8F53A"
                      delay={i * 0.05 + 0.04}
                    />
                  </div>
                </div>
                <span className="text-[10px] text-[#aaa]">{d.day}</span>
              </div>
            )
          })}
        </div>
      </div>
    </motion.div>
  )
}
