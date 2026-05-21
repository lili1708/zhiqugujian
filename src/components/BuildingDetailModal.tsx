import { X, MapPin, Star, Heart, Navigation } from 'lucide-react';
import type { Building } from '@/types';

interface BuildingDetailModalProps {
  building: Building | null;
  isOpen: boolean;
  onClose: () => void;
  isFavorited: boolean;
  onToggleFavorite: () => void;
}

export default function BuildingDetailModal({ 
  building, 
  isOpen, 
  onClose,
  isFavorited,
  onToggleFavorite
}: BuildingDetailModalProps) {
  if (!isOpen || !building) return null;

  const categoryMap: Record<string, string> = {
    palace: '宫殿',
    garden: '园林',
    temple: '寺庙',
    tower: '楼阁',
    folk: '民居'
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
      {/* 遮罩层 */}
      <div 
        className="absolute inset-0 bg-black/50 backdrop-blur-sm"
        onClick={onClose}
      />
      
      {/* 弹窗内容 */}
      <div className="relative bg-white rounded-2xl w-full max-w-md max-h-[85vh] overflow-y-auto shadow-2xl">
        {/* 关闭按钮 */}
        <button
          onClick={onClose}
          className="absolute top-3 right-3 z-10 w-8 h-8 bg-black/30 hover:bg-black/50 rounded-full flex items-center justify-center transition-colors"
        >
          <X className="w-4 h-4 text-white" />
        </button>

        {/* 建筑图片 */}
        <div className="relative h-56">
          <img
            src={building.image || '/building-1.jpg'}
            alt={building.name}
            className="w-full h-full object-cover"
          />
          <div className="absolute bottom-0 left-0 right-0 bg-gradient-to-t from-black/60 to-transparent p-4">
            <span className="inline-block px-2 py-0.5 bg-[#e63946] text-white text-xs rounded-full mb-2">
              {categoryMap[building.category] || building.category}
            </span>
            <h2 className="text-xl font-bold text-white">{building.name}</h2>
          </div>
        </div>

        {/* 建筑信息 */}
        <div className="p-4 space-y-4">
          {/* 评分和打卡 */}
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-4">
              <div className="flex items-center gap-1">
                <Star className="w-4 h-4 fill-amber-400 text-amber-400" />
                <span className="text-sm font-medium">{building.rating}</span>
              </div>
              <span className="text-sm text-gray-500">{building.checkin_count}人打卡</span>
            </div>
            <button
              onClick={onToggleFavorite}
              className="flex items-center gap-1 px-3 py-1.5 rounded-full border transition-colors"
            >
              <Heart
                className={`w-4 h-4 ${
                  isFavorited
                    ? 'fill-[#e63946] text-[#e63946]'
                    : 'text-gray-400'
                }`}
              />
              <span className="text-sm">{isFavorited ? '已收藏' : '收藏'}</span>
            </button>
          </div>

          {/* 位置信息 */}
          <div className="flex items-center gap-2 text-gray-600">
            <MapPin className="w-4 h-4 text-[#e63946]" />
            <span className="text-sm">{building.location}</span>
          </div>

          {/* 描述 */}
          {building.description && (
            <div className="bg-gray-50 rounded-xl p-3">
              <h3 className="text-sm font-bold text-[#1d3557] mb-2">建筑简介</h3>
              <p className="text-sm text-gray-600 leading-relaxed">
                {building.description}
              </p>
            </div>
          )}

          {/* 坐标信息 */}
          {building.latitude && building.longitude && (
            <div className="flex items-center gap-2 text-gray-500">
              <Navigation className="w-4 h-4" />
              <span className="text-xs">
                坐标: {building.latitude.toFixed(4)}, {building.longitude.toFixed(4)}
              </span>
            </div>
          )}

          {/* 操作按钮 */}
          <div className="flex gap-3 pt-2">
            <button
              onClick={onClose}
              className="flex-1 py-2.5 border border-gray-200 rounded-xl text-sm font-medium text-gray-600 hover:bg-gray-50 transition-colors"
            >
              关闭
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
