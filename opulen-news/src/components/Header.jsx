import { motion } from 'framer-motion'
import { RefreshCw, Zap } from 'lucide-react'
import { useState } from 'react'
import useNewsStore from '../store/useNewsStore'

function getGreeting() {
  const h = new Date().getHours()
  if (h < 12) return 'Good morning'
  if (h < 17) return 'Good afternoon'
  return 'Good evening'
}

function formatDate() {
  return new Date().toLocaleDateString('en-US', {
    weekday: 'long',
    month: 'long',
    day: 'numeric',
    year: 'numeric',
  })
}

export default function Header() {
  const loadLiveData = useNewsStore((s) => s.loadLiveData)
  const isLive = useNewsStore((s) => s.isLive)
  const [spinning, setSpinning] = useState(false)

  async function handleRefresh() {
    setSpinning(true)
    await loadLiveData()
    setTimeout(() => setSpinning(false), 700)
  }

  return (
    <div className="flex items-center justify-between px-6 pt-6 pb-3 flex-shrink-0">
      {/* Left: branding */}
      <div>
        <div className="flex items-center gap-2.5">
          <motion.div
            className="w-7 h-7 bg-[#C8F53A] rounded-xl flex items-center justify-center"
            initial={{ rotate: -10, scale: 0.8 }}
            animate={{ rotate: 0, scale: 1 }}
            transition={{ type: 'spring', stiffness: 260, damping: 20 }}
          >
            <Zap size={14} strokeWidth={2.5} className="text-[#111]" />
          </motion.div>
          <motion.h1
            className="text-[22px] font-bold tracking-tight text-[#1a1a1a]"
            initial={{ opacity: 0, x: -10 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.4 }}
          >
            Opulen News
          </motion.h1>
          {isLive && (
            <motion.span
              className="text-[10px] font-semibold bg-[#C8F53A] text-[#111] px-2 py-0.5 rounded-full"
              initial={{ opacity: 0, scale: 0.8 }}
              animate={{ opacity: 1, scale: 1 }}
            >
              LIVE
            </motion.span>
          )}
        </div>
        <p className="text-[12px] text-[#999] mt-0.5 ml-0.5">
          {getGreeting()} — {formatDate()}
        </p>
      </div>

      {/* Right: refresh only */}
      <motion.button
        onClick={handleRefresh}
        className="flex items-center gap-2 bg-[#1a1a1a] text-white text-[13px] font-medium px-4 py-2 rounded-full hover:bg-[#2a2a2a] transition-colors"
        whileHover={{ scale: 1.03 }}
        whileTap={{ scale: 0.97 }}
      >
        <motion.span animate={{ rotate: spinning ? 360 : 0 }} transition={{ duration: 0.6 }}>
          <RefreshCw size={13} strokeWidth={2} />
        </motion.span>
        Refresh Feed
      </motion.button>
    </div>
  )
}
