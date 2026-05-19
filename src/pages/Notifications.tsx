import { useState } from 'react'
import { Bell, Heart, MessageCircle, Award, ChevronRight, Settings, Loader2 } from 'lucide-react'
import { useAuth } from '@/contexts/AuthContext'

interface Notification {
  id: number
  type: 'like' | 'comment' | 'follow' | 'achievement' | 'system'
  title: string
  content: string
  read: boolean
  created_at: string
}

// 模拟通知数据
const mockNotifications: Notification[] = [
  {
    id: 1,
    type: 'like',
    title: '收到点赞',
    content: '你的天坛祈年殿打卡收到了 12 个赞',
    read: false,
    created_at: new Date(Date.now() - 3600000).toISOString()
  },
  {
    id: 2,
    type: 'achievement',
    title: '成就解锁',
    content: '恭喜获得"初探古建"成就！',
    read: false,
    created_at: new Date(Date.now() - 7200000).toISOString()
  },
  {
    id: 3,
    type: 'system',
    title: '欢迎体验',
    content: '欢迎使用智取古建，开启你的文化探索之旅',
    read: true,
    created_at: new Date(Date.now() - 86400000).toISOString()
  }
]

function formatTimeAgo(dateStr: string) {
  const now = new Date()
  const date = new Date(dateStr)
  const diff = Math.floor((now.getTime() - date.getTime()) / 1000)
  
  if (diff < 60) return '刚刚'
  if (diff < 3600) return `${Math.floor(diff / 60)}分钟前`
  if (diff < 86400) return `${Math.floor(diff / 3600)}小时前`
  return `${Math.floor(diff / 86400)}天前`
}

export default function Notifications() {
  const { user } = useAuth()
  const [notifications, setNotifications] = useState<Notification[]>(mockNotifications)
  const [loading] = useState(false)

  const unreadCount = notifications.filter(n => !n.read).length

  const handleMarkAsRead = (id: number) => {
    setNotifications(prev => 
      prev.map(n => n.id === id ? { ...n, read: true } : n)
    )
  }

  const handleMarkAllAsRead = () => {
    setNotifications(prev => prev.map(n => ({ ...n, read: true })))
  }

  const getNotificationIcon = (type: string) => {
    switch (type) {
      case 'like':
        return <Heart className="w-5 h-5 text-[#e63946]" />
      case 'comment':
        return <MessageCircle className="w-5 h-5 text-blue-500" />
      case 'achievement':
        return <Award className="w-5 h-5 text-amber-500" />
      case 'system':
        return <Bell className="w-5 h-5 text-gray-500" />
      default:
        return <Bell className="w-5 h-5 text-gray-500" />
    }
  }

  if (!user) {
    return (
      <div className="min-h-screen pb-20 flex items-center justify-center" style={{ backgroundColor: '#fef6f6' }}>
        <div className="text-center p-4">
          <Bell className="w-16 h-16 text-gray-300 mx-auto mb-4" />
          <p className="text-gray-500">登录后查看消息</p>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen pb-20" style={{ backgroundColor: '#fef6f6' }}>
      {/* Header */}
      <header className="bg-white px-4 py-4 sticky top-0 z-40">
        <div className="flex items-center justify-between">
          <h1 className="text-xl font-bold text-[#1d3557]">消息通知</h1>
          {unreadCount > 0 && (
            <button
              onClick={handleMarkAllAsRead}
              className="text-sm text-[#e63946]"
            >
              全部已读
            </button>
          )}
        </div>
        {unreadCount > 0 && (
          <p className="text-sm text-gray-500 mt-1">
            {unreadCount} 条未读消息
          </p>
        )}
      </header>

      {/* Notification List */}
      <div className="p-4">
        {loading ? (
          <div className="flex justify-center py-8">
            <Loader2 className="w-6 h-6 animate-spin text-[#e63946]" />
          </div>
        ) : notifications.length > 0 ? (
          <div className="space-y-3">
            {notifications.map((notification) => (
              <div
                key={notification.id}
                onClick={() => handleMarkAsRead(notification.id)}
                className={`bg-white rounded-xl p-4 shadow-sm ${
                  !notification.read ? 'border-l-4 border-[#e63946]' : ''
                }`}
              >
                <div className="flex items-start gap-3">
                  <div className="w-10 h-10 bg-gray-100 rounded-full flex items-center justify-center flex-shrink-0">
                    {getNotificationIcon(notification.type)}
                  </div>
                  <div className="flex-1">
                    <div className="flex items-center justify-between">
                      <h3 className="font-medium text-[#1d3557]">{notification.title}</h3>
                      <span className="text-xs text-gray-400">
                        {formatTimeAgo(notification.created_at)}
                      </span>
                    </div>
                    <p className="text-sm text-gray-500 mt-1">{notification.content}</p>
                    {!notification.read && (
                      <div className="w-2 h-2 bg-[#e63946] rounded-full mt-2" />
                    )}
                  </div>
                  <ChevronRight className="w-4 h-4 text-gray-300" />
                </div>
              </div>
            ))}
          </div>
        ) : (
          <div className="text-center py-12">
            <Bell className="w-16 h-16 text-gray-300 mx-auto mb-4" />
            <p className="text-gray-500">暂无消息</p>
          </div>
        )}
      </div>

      {/* Settings */}
      <div className="p-4 pt-0">
        <button className="w-full bg-white rounded-xl p-4 flex items-center gap-3">
          <Settings className="w-5 h-5 text-gray-500" />
          <span className="text-gray-700">通知设置</span>
          <ChevronRight className="w-4 h-4 text-gray-300 ml-auto" />
        </button>
      </div>
    </div>
  )
}