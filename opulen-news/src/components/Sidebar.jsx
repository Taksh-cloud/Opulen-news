import { motion } from 'framer-motion'
import { Home, Globe, TrendingUp, Cpu, Building2, BarChart2, LandPlot } from 'lucide-react'
import useNewsStore from '../store/useNewsStore'

const navItems = [
  { icon: Home,       category: 'All',         label: 'All' },
  { icon: Globe,      category: 'World',       label: 'World' },
  { icon: Building2,  category: 'Business',    label: 'Business' },
  { icon: BarChart2,  category: 'Economy',     label: 'Economy' },
  { icon: Cpu,        category: 'Tech',        label: 'Tech' },
  { icon: TrendingUp, category: 'Finance',     label: 'Markets' },
  { icon: LandPlot,   category: 'Real Estate', label: 'Real Estate' },
]

export default function Sidebar() {
  const activeCategory = useNewsStore((s) => s.activeCategory)
  const setCategory = useNewsStore((s) => s.setCategory)

  return (
    <div className="w-16 bg-[#111111] flex flex-col items-center py-5 gap-1 flex-shrink-0">
      {/* Nav icons */}
      <div className="flex flex-col gap-1.5 flex-1">
        {navItems.map((item) => {
          const isActive = activeCategory === item.category
          return (
            <motion.button
              key={item.category}
              onClick={() => setCategory(item.category)}
              className={`w-10 h-10 rounded-2xl flex items-center justify-center transition-colors duration-150 ${
                isActive
                  ? 'bg-[#2a2a2a] text-white'
                  : 'text-[#4a4a4a] hover:text-[#888] hover:bg-[#1c1c1c]'
              }`}
              whileHover={{ scale: 1.06 }}
              whileTap={{ scale: 0.94 }}
              title={item.label}
            >
              <item.icon size={17} strokeWidth={isActive ? 2.2 : 1.8} />
            </motion.button>
          )
        })}
      </div>

      {/* Avatar */}
      <motion.div
        className="w-8 h-8 rounded-full bg-gradient-to-br from-[#C8F53A] to-[#7ab020] flex items-center justify-center text-[#111] text-[10px] font-bold cursor-default"
        whileHover={{ scale: 1.08 }}
      >
        OP
      </motion.div>
    </div>
  )
}
