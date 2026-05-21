import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Search, MapPin, Heart, Star, ChevronRight, Loader2, Filter, SortAsc } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { useBuildings, useFeaturedBuildings } from '@/hooks/useBuildings';
import { useFavorites } from '@/hooks/useFavorites';
import { useAuth } from '@/contexts/AuthContext';
import BuildingDetailModal from '@/components/BuildingDetailModal';
import type { Building } from '@/types';

const categories = [
  { id: 'all', name: '全部' },
  { id: 'palace', name: '宫殿' },
  { id: 'garden', name: '园林' },
  { id: 'temple', name: '寺庙' },
  { id: 'tower', name: '楼阁' },
  { id: 'folk', name: '民居' }
];

const sortOptions = [
  { id: 'popular', name: '最热门' },
  { id: 'rating', name: '评分最高' },
  { id: 'newest', name: '最新' }
];

export default function Home() {
  const [activeCategory, setActiveCategory] = useState('all');
  const [searchQuery, setSearchQuery] = useState('');
  const [showFilters, setShowFilters] = useState(false);
  const [sortBy, setSortBy] = useState('popular');
  const [selectedBuilding, setSelectedBuilding] = useState<Building | null>(null);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const navigate = useNavigate();
  const { user } = useAuth()
  const { buildings, loading } = useBuildings(
    activeCategory === 'all' ? undefined : activeCategory,
    searchQuery || undefined
  );
  const { buildings: featuredBuildings, loading: featuredLoading } = useFeaturedBuildings();
  const { isFavorited, toggleFavorite } = useFavorites();

  const handleOpenDetail = (building: Building) => {
    setSelectedBuilding(building);
    setIsModalOpen(true);
  };

  const handleCloseDetail = () => {
    setIsModalOpen(false);
    setSelectedBuilding(null);
  };

  const handleToggleFavorite = async (buildingId: number) => {
    if (!user) {
      alert('请先登录后再收藏')
      return
    }
    await toggleFavorite(buildingId)
  }

  return (
    <div className="min-h-screen pb-20" style={{ backgroundColor: '#fef6f6' }}>
      {/* Header */}
      <header className="bg-white sticky top-0 z-40">
        <div className="px-4 py-3">
          <div className="flex items-center justify-between mb-3">
            <div>
              <h1 className="text-xl font-bold text-[#1d3557]">古建智趣</h1>
              <p className="text-xs text-gray-500">发现身边的文化瑰宝</p>
            </div>
            <div className="w-10 h-10 bg-[#e63946]/10 rounded-full flex items-center justify-center">
              <span className="text-[#e63946] font-bold">古</span>
            </div>
          </div>
          
          {/* Search Bar */}
          <div className="relative flex gap-2">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
            <input
              type="text"
              placeholder="搜索古建名称或城市..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full pl-10 pr-4 py-2.5 bg-gray-100 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-[#e63946]/20 transition-all"
            />
            <button
              onClick={() => setShowFilters(!showFilters)}
              className="p-2.5 bg-gray-100 rounded-xl"
            >
              <Filter className="w-4 h-4 text-gray-400" />
            </button>
          </div>

          {/* Filters Panel */}
          {showFilters && (
            <div className="mt-2 p-3 bg-gray-100 rounded-xl">
              <div className="flex items-center gap-2 mb-2">
                <SortAsc className="w-4 h-4 text-gray-500" />
                <span className="text-sm text-gray-500">排序</span>
              </div>
              <div className="flex gap-2">
                {sortOptions.map((option) => (
                  <button
                    key={option.id}
                    onClick={() => setSortBy(option.id)}
                    className={`px-3 py-1 rounded-full text-sm ${
                      sortBy === option.id ? 'bg-[#e63946] text-white' : 'bg-white text-gray-600'
                    }`}
                  >
                    {option.name}
                  </button>
                ))}
              </div>
            </div>
          )}
        </div>

        {/* Categories */}
        <div className="flex gap-2 px-4 pb-3 overflow-x-auto scrollbar-hide">
          {categories.map((category) => (
            <button
              key={category.id}
              onClick={() => setActiveCategory(category.id)}
              className={`px-4 py-1.5 rounded-full text-sm whitespace-nowrap transition-all duration-300 ${
                activeCategory === category.id
                  ? 'bg-[#e63946] text-white'
                  : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
              }`}
            >
              {category.name}
            </button>
          ))}
        </div>
      </header>

      {/* Featured Section */}
      {!searchQuery && activeCategory === 'all' && (
        <section className="px-4 py-4">
          <div className="flex items-center justify-between mb-3">
            <h2 className="text-lg font-bold text-[#1d3557]">热门推荐</h2>
            <button 
              onClick={() => setActiveCategory('all')}
              className="text-sm text-[#e63946] flex items-center gap-1"
            >
              更多 <ChevronRight className="w-4 h-4" />
            </button>
          </div>
          
          {featuredLoading ? (
            <div className="flex justify-center py-8">
              <Loader2 className="w-6 h-6 animate-spin text-[#e63946]" />
            </div>
          ) : (
            <div className="flex gap-3 overflow-x-auto scrollbar-hide pb-2">
              {featuredBuildings.map((building: Building) => (
                <div
                  key={building.id}
                  className="flex-shrink-0 w-64 bg-white rounded-xl overflow-hidden shadow-sm cursor-pointer"
                  onClick={() => handleOpenDetail(building)}
                >
                  <div className="relative h-36">
                    <img
                      src={building.image || '/building-1.jpg'}
                      alt={building.name}
                      className="w-full h-full object-cover"
                    />
                    <div className="absolute top-2 right-2">
                      <button
                        onClick={(e) => {
                          e.stopPropagation();
                          handleToggleFavorite(building.id);
                        }}
                        className="w-8 h-8 bg-white/90 rounded-full flex items-center justify-center"
                      >
                        <Heart
                          className={`w-4 h-4 transition-colors ${
                            isFavorited(building.id)
                              ? 'fill-[#e63946] text-[#e63946]'
                              : 'text-gray-400'
                          }`}
                        />
                      </button>
                    </div>
                  </div>
                  <div className="p-3">
                    <h3 className="font-bold text-[#1d3557] text-sm">{building.name}</h3>
                    <div className="flex items-center gap-1 text-xs text-gray-500 mt-1">
                      <MapPin className="w-3 h-3" />
                      {building.location}
                    </div>
                    <div className="flex items-center gap-2 mt-2">
                      <div className="flex items-center gap-0.5">
                        <Star className="w-3 h-3 fill-amber-400 text-amber-400" />
                        <span className="text-xs font-medium">{building.rating}</span>
                      </div>
                      <span className="text-xs text-gray-400">{building.checkin_count}人打卡</span>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </section>
      )}

      {/* Building List */}
      <section className="px-4 py-2">
        <h2 className="text-lg font-bold text-[#1d3557] mb-3">
          {searchQuery ? '搜索结果' : '全部古建'}
        </h2>
        
        {loading ? (
          <div className="flex justify-center py-8">
            <Loader2 className="w-6 h-6 animate-spin text-[#e63946]" />
          </div>
        ) : (
          <div className="space-y-3">
            {buildings.map((building: Building) => (
              <div
                key={building.id}
                className="bg-white rounded-xl overflow-hidden shadow-sm flex cursor-pointer"
                onClick={() => handleOpenDetail(building)}
              >
                <div className="relative w-28 h-28 flex-shrink-0">
                  <img
                    src={building.image || '/building-1.jpg'}
                    alt={building.name}
                    className="w-full h-full object-cover"
                  />
                </div>
                <div className="flex-1 p-3 flex flex-col justify-between">
                  <div>
                    <div className="flex items-start justify-between">
                      <h3 className="font-bold text-[#1d3557] text-sm">{building.name}</h3>
                      <button
                        onClick={(e) => {
                          e.stopPropagation();
                          handleToggleFavorite(building.id);
                        }}
                      >
                        <Heart
                          className={`w-4 h-4 transition-colors ${
                            isFavorited(building.id)
                              ? 'fill-[#e63946] text-[#e63946]'
                              : 'text-gray-300'
                          }`}
                        />
                      </button>
                    </div>
                    <p className="text-xs text-gray-500 mt-1 line-clamp-1">{building.description}</p>
                    <div className="flex items-center gap-1 text-xs text-gray-400 mt-1">
                      <MapPin className="w-3 h-3" />
                      {building.location}
                    </div>
                  </div>
                  <div className="flex items-center justify-between mt-2">
                    <div className="flex items-center gap-2">
                      <div className="flex items-center gap-0.5">
                        <Star className="w-3 h-3 fill-amber-400 text-amber-400" />
                        <span className="text-xs font-medium">{building.rating}</span>
                      </div>
                      <span className="text-xs text-gray-400">{building.checkin_count}人打卡</span>
                    </div>
                    <Button
                      size="sm"
                      className="h-7 px-3 bg-[#e63946] hover:bg-[#c1121f] text-xs rounded-full"
                      onClick={(e) => {
                        e.stopPropagation();
                        navigate('/checkin');
                      }}
                    >
                      打卡
                    </Button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}

        {!loading && buildings.length === 0 && (
          <div className="text-center py-12">
            <div className="w-16 h-16 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-3">
              <Search className="w-8 h-8 text-gray-400" />
            </div>
            <p className="text-gray-500">未找到相关古建</p>
          </div>
        )}
      </section>

      {/* 建筑详情弹窗 */}
      <BuildingDetailModal
        building={selectedBuilding}
        isOpen={isModalOpen}
        onClose={handleCloseDetail}
        isFavorited={selectedBuilding ? isFavorited(selectedBuilding.id) : false}
        onToggleFavorite={() => selectedBuilding && handleToggleFavorite(selectedBuilding.id)}
      />
    </div>
  );
}
