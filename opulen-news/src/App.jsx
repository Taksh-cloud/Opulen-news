import { useEffect } from 'react'
import useNewsStore from './store/useNewsStore'
import Sidebar from './components/Sidebar'
import Header from './components/Header'
import CategoryTabs from './components/CategoryTabs'
import StatsCards from './components/StatsCards'
import VolumeChart from './components/VolumeChart'
import ArticleList from './components/ArticleList'
import RightPanel from './components/RightPanel'

export default function App() {
  const loadLiveData = useNewsStore((s) => s.loadLiveData)
  useEffect(() => { loadLiveData() }, [loadLiveData])

  return (
    <div className="flex h-screen overflow-hidden bg-[#EFEFED] font-sans">
      <Sidebar />

      <div className="flex flex-1 min-w-0 overflow-hidden">
        {/* Main content */}
        <div className="flex flex-col flex-1 min-w-0 overflow-hidden">
          <Header />
          <div className="flex-1 overflow-y-auto px-6 pb-6 space-y-4">
            <CategoryTabs />
            <StatsCards />
            <VolumeChart />
            <ArticleList />
          </div>
        </div>

        {/* Right panel */}
        <RightPanel />
      </div>
    </div>
  )
}
