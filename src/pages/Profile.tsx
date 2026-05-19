import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Settings, ChevronRight, Heart, Bookmark, MapPin, Award, Camera, Edit3, Loader2, Bell } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { useAuth } from '@/contexts/AuthContext';
import { useProfile, useAchievements, useFavoritesCount, useBookmarksCount } from '@/hooks/useProfile';
import { BarChart, Bar, XAxis, Tooltip, ResponsiveContainer, PieChart, Pie, Cell } from 'recharts';

const CHART_COLORS = ['#e63946', '#f4a261', '#2a9d8f', '#264653', '#e9c46a'];

export default function Profile() {
  const { user } = useAuth()
  const navigate = useNavigate()
  const { profile, stats, updateProfile } = useProfile()
  const { achievements, isUnlocked } = useAchievements()
  const favoritesCount = useFavoritesCount()
  const bookmarksCount = useBookmarksCount()
  const [showEditModal, setShowEditModal] = useState(false)
  const [editForm, setEditForm] = useState({ username: '', bio: '' })
  const [saving, setSaving] = useState(false)

  const handleOpenEdit = () => {
    setEditForm({
      username: profile?.username || '',
      bio: profile?.bio || ''
    })
    setShowEditModal(true)
  }

  const handleSave = async () => {
    setSaving(true)
    const success = await updateProfile(editForm)
    setSaving(false)
    if (success) {
      setShowEditModal(false)
    }
  }

  const menuItems = [
    { id: 'favorites', name: '我的收藏', icon: Heart, count: favoritesCount },
    { id: 'bookmarks', name: '学习书签', icon: Bookmark, count: bookmarksCount },
    { id: 'footprint', name: '足迹地图', icon: MapPin, count: stats.cities },
    { id: 'achievements', name: '我的成就', icon: Award, count: achievements.filter(a => isUnlocked(a.id)).length },
    { id: 'notifications', name: '消息通知', icon: Bell, path: '/notifications', count: 0 }
  ]

  const defaultBadges = [
    { id: 1, name: '初探古建', icon: '🏛️', desc: '首次打卡古建', unlocked: stats.checkins >= 1 },
    { id: 2, name: '学习达人', icon: '📚', desc: '完成5门课程', unlocked: stats.courses >= 5 },
    { id: 3, name: '打卡狂人', icon: '📍', desc: '打卡10个古建', unlocked: stats.checkins >= 10 },
    { id: 4, name: '文化使者', icon: '🎭', desc: '分享10条动态', unlocked: stats.checkins >= 10 },
    { id: 5, name: '古建专家', icon: '👨‍🎓', desc: '完成所有课程', unlocked: stats.courses >= 5 },
    { id: 6, name: '走遍中国', icon: '🗺️', desc: '打卡50个古建', unlocked: stats.checkins >= 50 }
  ]

  const activityData = [
    { month: '1月', value: Math.min(stats.checkins, 5) },
    { month: '2月', value: Math.max(0, stats.checkins - 3) },
    { month: '3月', value: Math.max(0, stats.checkins - 5) },
    { month: '4月', value: stats.checkins },
  ]

  const categoryData = [
    { name: '已打卡', value: stats.checkins },
    { name: '待打卡', value: Math.max(0, 50 - stats.checkins) },
  ]

  if (!user) {
    return (
      <div className="min-h-screen pb-20 flex items-center justify-center" style={{ backgroundColor: '#fef6f6' }}>
        <div className="text-center px-4">
          <div className="w-24 h-24 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-4">
            <span className="text-4xl">👤</span>
          </div>
          <h2 className="text-xl font-bold text-[#1d3557] mb-2">登录后查看更多</h2>
          <p className="text-gray-500 mb-6">登录后可记录打卡、收藏古建、学习课程</p>
          <Button 
            onClick={() => navigate('/auth')}
            className="bg-[#e63946] hover:bg-[#c1121f] px-8"
          >
            立即登录
          </Button>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen pb-20" style={{ backgroundColor: '#fef6f6' }}>
      {/* Header */}
      <header className="bg-gradient-to-br from-[#e63946] to-[#c1121f] text-white px-4 pt-6 pb-12">
        <div className="flex items-center justify-between mb-4">
          <h1 className="text-xl font-bold">个人中心</h1>
          <button className="p-2 bg-white/10 rounded-full">
            <Settings className="w-5 h-5" />
          </button>
        </div>
        
        {/* User Info */}
        <div className="flex items-center gap-4">
          <div className="relative">
            <div className="w-20 h-20 bg-white rounded-full flex items-center justify-center text-3xl overflow-hidden">
              {profile?.avatar_url ? (
                <img src={profile.avatar_url} alt="avatar" className="w-full h-full object-cover" />
              ) : (
                '👤'
              )}
            </div>
            <button 
              className="absolute -bottom-1 -right-1 w-7 h-7 bg-white rounded-full flex items-center justify-center shadow-md"
              onClick={handleOpenEdit}
            >
              <Camera className="w-4 h-4 text-gray-600" />
            </button>
          </div>
          <div className="flex-1">
            <div className="flex items-center gap-2">
              <h2 className="text-xl font-bold">{profile?.username || '古建爱好者'}</h2>
              <button onClick={handleOpenEdit}>
                <Edit3 className="w-4 h-4 text-white/70" />
              </button>
            </div>
            <p className="text-white/70 text-sm mt-1">{profile?.bio || '探索古建，传承文化'}</p>
          </div>
        </div>
      </header>

      {/* Stats Card */}
      <section className="px-4 -mt-6">
        <div className="bg-white rounded-xl shadow-sm p-4">
          <div className="flex items-center justify-around">
            <div className="text-center">
              <div className="text-2xl font-bold text-[#1d3557]">{stats.checkins}</div>
              <div className="text-xs text-gray-500">打卡</div>
            </div>
            <div className="w-px h-10 bg-gray-100" />
            <div className="text-center">
              <div className="text-2xl font-bold text-[#1d3557]">{stats.courses}</div>
              <div className="text-xs text-gray-500">课程</div>
            </div>
            <div className="w-px h-10 bg-gray-100" />
            <div className="text-center">
              <div className="text-2xl font-bold text-[#1d3557]">{stats.cities}</div>
              <div className="text-xs text-gray-500">城市</div>
            </div>
            <div className="w-px h-10 bg-gray-100" />
            <div className="text-center">
              <div className="text-2xl font-bold text-[#1d3557]">{stats.likes}</div>
              <div className="text-xs text-gray-500">获赞</div>
            </div>
          </div>
        </div>
      </section>

      {/* Charts */}
      <section className="px-4 py-4">
        <div className="bg-white rounded-xl p-4">
          <h3 className="text-lg font-bold text-[#1d3557] mb-4">打卡趋势</h3>
          <ResponsiveContainer width="100%" height={120}>
            <BarChart data={activityData}>
              <XAxis dataKey="month" tick={{ fontSize: 10 }} axisLine={false} tickLine={false} />
              <Bar dataKey="value" fill="#e63946" radius={[4, 4, 0, 0]} />
            </BarChart>
          </ResponsiveContainer>
        </div>
      </section>

      {/* Progress Chart */}
      <section className="px-4 py-2">
        <div className="bg-white rounded-xl p-4">
          <h3 className="text-lg font-bold text-[#1d3557] mb-4">学习进度</h3>
          <ResponsiveContainer width="100%" height={100}>
            <PieChart>
              <Pie data={categoryData} cx="50%" cy="50%" innerRadius={30} outerRadius={40} dataKey="value">
                {categoryData.map((_, index) => (
                  <Cell key={`cell-${index}`} fill={CHART_COLORS[index % CHART_COLORS.length]} />
                ))}
              </Pie>
              <Tooltip />
            </PieChart>
          </ResponsiveContainer>
          <div className="flex justify-center gap-4 text-sm">
            <span className="flex items-center gap-1"><span className="w-2 h-2 rounded-full bg-[#e63946]" />已打卡 {stats.checkins}</span>
            <span className="flex items-center gap-1"><span className="w-2 h-2 rounded-full bg-gray-300" />待打卡</span>
          </div>
        </div>
      </section>

      {/* Menu */}
      <section className="px-4 py-4">
        <div className="bg-white rounded-xl overflow-hidden">
          {menuItems.map((item, index) => {
            const Icon = item.icon;
            return (
              <button
                key={item.id}
                onClick={() => item.path && navigate(item.path)}
                className={`w-full flex items-center justify-between p-4 ${
                  index !== menuItems.length - 1 ? 'border-b border-gray-100' : ''
                }`}
              >
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 bg-[#e63946]/10 rounded-xl flex items-center justify-center">
                    <Icon className="w-5 h-5 text-[#e63946]" />
                  </div>
                  <span className="font-medium text-[#1d3557]">{item.name}</span>
                </div>
                <div className="flex items-center gap-2">
                  <span className="text-sm text-gray-400">{item.count}</span>
                  <ChevronRight className="w-5 h-5 text-gray-300" />
                </div>
              </button>
            );
          })}
        </div>
      </section>

      {/* Badges */}
      <section className="px-4 py-2">
        <div className="flex items-center justify-between mb-3">
          <h2 className="text-lg font-bold text-[#1d3557]">我的徽章</h2>
          <button className="text-sm text-[#e63946]">查看全部</button>
        </div>
        <div className="grid grid-cols-3 gap-3">
          {defaultBadges.map((badge) => (
            <div
              key={badge.id}
              className={`text-center p-4 rounded-xl ${
                badge.unlocked ? 'bg-white' : 'bg-gray-100'
              }`}
            >
              <div className={`text-3xl mb-2 ${badge.unlocked ? '' : 'grayscale opacity-40'}`}>
                {badge.icon}
              </div>
              <div className={`text-sm font-medium ${badge.unlocked ? 'text-[#1d3557]' : 'text-gray-400'}`}>
                {badge.name}
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* Sign Out */}
      <section className="px-4 py-4">
        <Button 
          variant="outline" 
          className="w-full text-gray-500"
          onClick={() => navigate('/auth')}
        >
          切换账号
        </Button>
      </section>

      {/* Edit Profile Modal */}
      {showEditModal && (
        <div 
          className="fixed inset-0 bg-black/50 z-50 flex items-end"
          onClick={() => setShowEditModal(false)}
        >
          <div 
            className="bg-white w-full rounded-t-3xl p-6 animate-slide-up"
            onClick={e => e.stopPropagation()}
          >
            <div className="w-12 h-1 bg-gray-200 rounded-full mx-auto mb-4" />
            <h2 className="text-xl font-bold text-[#1d3557] mb-4">编辑资料</h2>
            
            <div className="mb-4">
              <label className="block text-sm text-gray-600 mb-2">昵称</label>
              <input
                type="text"
                value={editForm.username}
                onChange={(e) => setEditForm({ ...editForm, username: e.target.value })}
                placeholder="请输入昵称"
                className="w-full p-3 bg-gray-100 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-[#e63946]/20"
              />
            </div>

            <div className="mb-4">
              <label className="block text-sm text-gray-600 mb-2">个性签名</label>
              <textarea
                value={editForm.bio}
                onChange={(e) => setEditForm({ ...editForm, bio: e.target.value })}
                placeholder="介绍一下自己"
                className="w-full p-3 bg-gray-100 rounded-xl text-sm resize-none h-20 focus:outline-none focus:ring-2 focus:ring-[#e63946]/20"
              />
            </div>

            <button 
              className="w-full py-3 bg-[#e63946] text-white rounded-xl font-medium hover:bg-[#c1121f] transition-colors flex items-center justify-center"
              onClick={handleSave}
              disabled={saving}
            >
              {saving ? <Loader2 className="w-5 h-5 animate-spin" /> : '保存'}
            </button>
          </div>
        </div>
      )}
    </div>
  );
}
