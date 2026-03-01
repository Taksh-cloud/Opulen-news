import { create } from 'zustand'
import { mockArticles } from '../data/mockData'

const useNewsStore = create((set) => ({
  activeCategory: 'All',
  activeSubCategory: null,
  articles: mockArticles,
  isLive: false,

  setCategory: (category) =>
    set({ activeCategory: category, activeSubCategory: null }),

  setSubCategory: (sub) =>
    set((state) => ({
      activeSubCategory: state.activeSubCategory === sub ? null : sub,
    })),

  loadLiveData: async () => {
    try {
      const res = await fetch('/mockData.json')
      if (!res.ok) return
      const data = await res.json()
      if (Array.isArray(data) && data.length > 0) {
        set({ articles: data, isLive: true })
      }
    } catch {
      // silently keep mock data
    }
  },
}))

export default useNewsStore
