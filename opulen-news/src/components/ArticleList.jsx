import { AnimatePresence, motion } from 'framer-motion'
import useNewsStore from '../store/useNewsStore'
import ArticleCard from './ArticleCard'

export default function ArticleList() {
  const articles = useNewsStore((s) => s.articles)
  const activeCategory = useNewsStore((s) => s.activeCategory)
  const activeSubCategory = useNewsStore((s) => s.activeSubCategory)

  const filtered = articles.filter((a) => {
    if (activeCategory !== 'All' && a.category !== activeCategory) return false
    if (activeSubCategory && a.sub_category !== activeSubCategory) return false
    return true
  })

  return (
    <div>
      {/* Section header */}
      <div className="flex items-center justify-between mb-3">
        <div className="flex items-center gap-2">
          <span className="text-[14px] font-semibold text-[#1a1a1a]">
            Latest Stories
          </span>
          <motion.span
            key={filtered.length}
            className="text-[11px] font-medium bg-[#1a1a1a] text-white px-2 py-0.5 rounded-full"
            initial={{ scale: 0.8, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            transition={{ duration: 0.2 }}
          >
            {filtered.length}
          </motion.span>
        </div>
      </div>

      {/* Article grid */}
      <AnimatePresence mode="popLayout">
        {filtered.length === 0 ? (
          <motion.div
            key="empty"
            className="text-center py-12 text-[#bbb] text-[13px]"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
          >
            No articles found for this filter.
          </motion.div>
        ) : (
          <motion.div
            key={`${activeCategory}-${activeSubCategory}`}
            className="grid grid-cols-2 gap-3"
          >
            {filtered.map((article, i) => (
              <ArticleCard key={article.article_id} article={article} index={i} />
            ))}
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  )
}
