import { motion } from 'framer-motion'
import { Clock, ExternalLink } from 'lucide-react'

function timeAgo(value) {
  if (!value) return null
  // Handle relative strings from scraper e.g. "12 hours ago"
  if (typeof value === 'string' && value.includes('ago')) return value
  const diff = (Date.now() - new Date(value).getTime()) / 1000
  if (isNaN(diff)) return null
  if (diff < 3600) return `${Math.floor(diff / 60)}m ago`
  if (diff < 86400) return `${Math.floor(diff / 3600)}h ago`
  return `${Math.floor(diff / 86400)}d ago`
}

const categoryColors = {
  World: '#3b82f6',
  Business: '#8b5cf6',
  Economy: '#f59e0b',
  Tech: '#10b981',
  Finance: '#ef4444',
  'Real Estate': '#ec4899',
}

export default function ArticleCard({ article, index = 0 }) {
  const accentColor = categoryColors[article.category] || '#C8F53A'
  const ts = timeAgo(article.published_at)

  return (
    <motion.a
      href={article.url}
      target="_blank"
      rel="noopener noreferrer"
      className="bg-white rounded-2xl p-4 flex flex-col gap-3 group cursor-pointer border border-transparent hover:border-[#ebebeb] hover:shadow-md transition-shadow no-underline"
      initial={{ opacity: 0, y: 14 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: -8, scale: 0.97 }}
      transition={{ duration: 0.3, delay: index * 0.04, ease: 'easeOut' }}
      whileHover={{ y: -2, transition: { duration: 0.18 } }}
    >
      {/* Top tags */}
      <div className="flex items-center gap-2 flex-wrap">
        <span className="text-[10px] font-semibold bg-[#f0f0ee] text-[#888] px-2 py-0.5 rounded-full uppercase tracking-wide">
          {article.source}
        </span>
        <span
          className="text-[10px] font-semibold px-2 py-0.5 rounded-full text-white"
          style={{ backgroundColor: accentColor }}
        >
          {article.sub_category}
        </span>
        {ts && (
          <span className="ml-auto text-[10px] text-[#bbb] flex items-center gap-1">
            <Clock size={9} strokeWidth={2} />
            {ts}
          </span>
        )}
      </div>

      {/* Title */}
      <h3 className="text-[14px] font-semibold text-[#1a1a1a] leading-snug group-hover:text-black transition-colors line-clamp-2">
        {article.title}
      </h3>

      {/* Summary */}
      {article.summary && (
        <p className="text-[12px] text-[#888] leading-relaxed line-clamp-2">
          {article.summary}
        </p>
      )}

      {/* Footer */}
      <div className="flex items-center justify-between pt-1 mt-auto">
        <div
          className="h-0.5 flex-1 rounded-full mr-4"
          style={{ backgroundColor: `${accentColor}30` }}
        >
          <motion.div
            className="h-full rounded-full"
            style={{ backgroundColor: accentColor, width: '0%' }}
            whileInView={{ width: '40%' }}
            transition={{ duration: 0.6, delay: 0.2 }}
          />
        </div>
        <span className="flex items-center gap-1 text-[11px] font-medium text-[#aaa] group-hover:text-[#1a1a1a] transition-colors">
          Read
          <ExternalLink size={10} strokeWidth={2} />
        </span>
      </div>
    </motion.a>
  )
}
