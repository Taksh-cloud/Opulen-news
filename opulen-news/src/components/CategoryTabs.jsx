import { motion, AnimatePresence } from 'framer-motion'
import useNewsStore from '../store/useNewsStore'
import { CATEGORIES } from '../data/mockData'

function PillBtn({ active, onClick, children, small = false }) {
  return (
    <motion.button
      onClick={onClick}
      className={`rounded-full font-medium whitespace-nowrap transition-colors duration-150 ${
        small ? 'text-[12px] px-3 py-1' : 'text-[13px] px-4 py-1.5'
      } ${
        active
          ? 'bg-[#1a1a1a] text-white shadow-sm'
          : 'bg-white text-[#555] border border-[#e8e8e8] hover:border-[#bbb] hover:text-[#1a1a1a]'
      }`}
      whileHover={{ scale: 1.03 }}
      whileTap={{ scale: 0.97 }}
      layout
    >
      {children}
    </motion.button>
  )
}

const DISPLAY_LABELS = { Finance: 'Markets & Finance' }

export default function CategoryTabs() {
  const activeCategory = useNewsStore((s) => s.activeCategory)
  const activeSubCategory = useNewsStore((s) => s.activeSubCategory)
  const setCategory = useNewsStore((s) => s.setCategory)
  const setSubCategory = useNewsStore((s) => s.setSubCategory)

  const subCategories = CATEGORIES[activeCategory] || []

  return (
    <div className="space-y-2.5">
      {/* Main category pills */}
      <div className="flex gap-2 flex-wrap">
        <PillBtn active={activeCategory === 'All'} onClick={() => setCategory('All')}>
          All
        </PillBtn>
        {Object.keys(CATEGORIES).map((cat) => (
          <PillBtn
            key={cat}
            active={activeCategory === cat}
            onClick={() => setCategory(cat)}
          >
            {DISPLAY_LABELS[cat] || cat}
          </PillBtn>
        ))}
      </div>

      {/* Sub-category pills */}
      <AnimatePresence>
        {subCategories.length > 0 && (
          <motion.div
            key={activeCategory}
            className="flex gap-2 flex-wrap overflow-hidden"
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: 'auto' }}
            exit={{ opacity: 0, height: 0 }}
            transition={{ duration: 0.22, ease: 'easeInOut' }}
          >
            {subCategories.map((sub) => (
              <PillBtn
                key={sub}
                active={activeSubCategory === sub}
                onClick={() => setSubCategory(sub)}
                small
              >
                {sub}
              </PillBtn>
            ))}
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  )
}
