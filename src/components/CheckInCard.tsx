import { useState } from 'react'
import { Heart, MessageCircle, Share2, Send, Loader2 } from 'lucide-react'
import { useLikes, useComments } from '@/hooks/useInteraction'
import { useAuth } from '@/contexts/AuthContext'

interface CheckInCardProps {
  checkIn: {
    id: number
    building?: { name: string; image: string | null }
    image_url: string | null
    note: string | null
    likes_count: number
    comments_count: number
    created_at: string
    profile?: { username: string | null; avatar_url: string | null }
  }
  showUser?: boolean
}

export default function CheckInCard({ checkIn, showUser = false }: CheckInCardProps) {
  const { user } = useAuth()
  const { liked, likesCount, toggleLike } = useLikes(checkIn.id)
  const { comments, addComment, loading: commentsLoading } = useComments(checkIn.id)
  const [showComments, setShowComments] = useState(false)
  const [commentText, setCommentText] = useState('')
  const [submitting, setSubmitting] = useState(false)

  const handleSubmitComment = async () => {
    if (!commentText.trim()) return
    
    setSubmitting(true)
    const success = await addComment(commentText)
    setSubmitting(false)
    
    if (success) {
      setCommentText('')
    }
  }

  const formatTimeAgo = (dateStr: string) => {
    const now = new Date()
    const date = new Date(dateStr)
    const diff = Math.floor((now.getTime() - date.getTime()) / 1000)
    
    if (diff < 3600) return `${Math.floor(diff / 60)}分钟前`
    if (diff < 86400) return `${Math.floor(diff / 3600)}小时前`
    if (diff < 604800) return `${Math.floor(diff / 86400)}天前`
    return new Date(dateStr).toLocaleDateString('zh-CN', { month: 'short', day: 'numeric' })
  }

  return (
    <div className="bg-white rounded-xl overflow-hidden shadow-sm">
      {/* User Info */}
      {showUser && (
        <div className="p-3 border-b border-gray-100">
          <div className="flex items-center gap-2">
            <div className="w-8 h-8 bg-gray-200 rounded-full flex items-center justify-center overflow-hidden">
              {checkIn.profile?.avatar_url ? (
                <img src={checkIn.profile.avatar_url} alt="avatar" className="w-full h-full object-cover" />
              ) : (
                <span className="text-sm">👤</span>
              )}
            </div>
            <div>
              <div className="font-medium text-sm">{checkIn.profile?.username || '用户'}</div>
              <div className="text-xs text-gray-400">{formatTimeAgo(checkIn.created_at)}</div>
            </div>
          </div>
        </div>
      )}

      {/* Building Name (for friends feed) */}
      {!showUser && (
        <div className="p-3 border-b border-gray-100">
          <div className="flex items-center justify-between">
            <h3 className="font-bold text-[#1d3557]">{checkIn.building?.name || '古建筑'}</h3>
            <span className="text-xs text-gray-400">{formatTimeAgo(checkIn.created_at)}</span>
          </div>
        </div>
      )}

      {/* Image */}
      <img
        src={checkIn.image_url || checkIn.building?.image || '/building-1.jpg'}
        alt={checkIn.building?.name}
        className="w-full h-48 object-cover"
      />

      {/* Actions */}
      <div className="p-3">
        <div className="flex items-center justify-between mb-2">
          <div className="flex items-center gap-4">
            <button 
              onClick={toggleLike}
              className="flex items-center gap-1 text-sm"
            >
              <Heart 
                className={`w-4 h-4 transition-colors ${liked ? 'fill-[#e63946] text-[#e63946]' : 'text-gray-500'}`} 
              />
              <span className={liked ? 'text-[#e63946]' : 'text-gray-500'}>
                {likesCount}
              </span>
            </button>
            <button 
              onClick={() => setShowComments(!showComments)}
              className="flex items-center gap-1 text-gray-500 text-sm"
            >
              <MessageCircle className="w-4 h-4" />
              {checkIn.comments_count}
            </button>
          </div>
          <button className="text-gray-500">
            <Share2 className="w-4 h-4" />
          </button>
        </div>

        {/* Note */}
        {checkIn.note && (
          <p className="text-sm text-gray-700 mb-2">{checkIn.note}</p>
        )}

        {/* Building name for friends feed */}
        {showUser && (
          <h4 className="font-bold text-[#1d3557] text-sm mb-2">{checkIn.building?.name || '古建筑'}</h4>
        )}

        {/* Comments Section */}
        {showComments && (
          <div className="mt-3 pt-3 border-t border-gray-100">
            {commentsLoading ? (
              <div className="flex justify-center py-2">
                <Loader2 className="w-4 h-4 animate-spin text-gray-400" />
              </div>
            ) : comments.length > 0 ? (
              <div className="space-y-2 mb-3 max-h-40 overflow-y-auto">
                {comments.map((comment) => (
                  <div key={comment.id} className="text-sm">
                    <span className="font-medium">{comment.profile?.username || '用户'}: </span>
                    <span className="text-gray-600">{comment.content}</span>
                  </div>
                ))}
              </div>
            ) : (
              <p className="text-sm text-gray-400 mb-3">暂无评论</p>
            )}

            {/* Comment Input */}
            {user && (
              <div className="flex gap-2">
                <input
                  type="text"
                  value={commentText}
                  onChange={(e) => setCommentText(e.target.value)}
                  placeholder="添加评论..."
                  className="flex-1 px-3 py-2 bg-gray-100 rounded-full text-sm focus:outline-none focus:ring-1 focus:ring-[#e63946]"
                  onKeyPress={(e) => e.key === 'Enter' && handleSubmitComment()}
                />
                <button
                  onClick={handleSubmitComment}
                  disabled={!commentText.trim() || submitting}
                  className="p-2 bg-[#e63946] text-white rounded-full disabled:opacity-50"
                >
                  {submitting ? (
                    <Loader2 className="w-4 h-4 animate-spin" />
                  ) : (
                    <Send className="w-4 h-4" />
                  )}
                </button>
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  )
}
