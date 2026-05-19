import { useState, useEffect, useCallback } from 'react'
import { supabase } from '@/lib/supabase'
import { useAuth } from '@/contexts/AuthContext'

interface Comment {
  id: number
  user_id: string
  check_in_id: number
  content: string
  created_at: string
  profile?: {
    username: string
    avatar_url: string
  }
}

export function useLikes(checkInId: number) {
  const { user } = useAuth()
  const [liked, setLiked] = useState(false)
  const [likesCount, setLikesCount] = useState(0)
  const [loading, setLoading] = useState(true)

  const fetchLikes = useCallback(async () => {
    setLoading(true)
    try {
      const [{ count }, { data: userLike }] = await Promise.all([
        supabase
          .from('likes')
          .select('id', { count: 'exact' })
          .eq('check_in_id', checkInId),
        user ? supabase
          .from('likes')
          .select('id')
          .eq('check_in_id', checkInId)
          .eq('user_id', user.id)
          .maybeSingle() : Promise.resolve({ data: null })
      ])

      setLikesCount(count || 0)
      setLiked(!!userLike)
    } catch (err) {
      console.error('Error fetching likes:', err)
    } finally {
      setLoading(false)
    }
  }, [checkInId, user])

  useEffect(() => {
    fetchLikes()
  }, [fetchLikes])

  const toggleLike = async () => {
    if (!user) {
      alert('请先登录后再点赞')
      return false
    }

    try {
      if (liked) {
        await supabase
          .from('likes')
          .delete()
          .eq('check_in_id', checkInId)
          .eq('user_id', user.id)
        
        await supabase.rpc('decrement_checkin_likes', { check_in_id: checkInId })
        
        setLiked(false)
        setLikesCount(prev => Math.max(0, prev - 1))
      } else {
        await supabase
          .from('likes')
          .insert({ user_id: user.id, check_in_id: checkInId })
        
        await supabase.rpc('increment_checkin_likes', { check_in_id: checkInId })
        
        setLiked(true)
        setLikesCount(prev => prev + 1)
      }
      return true
    } catch (err) {
      console.error('Error toggling like:', err)
      return false
    }
  }

  return { liked, likesCount, loading, toggleLike, refetch: fetchLikes }
}

export function useComments(checkInId: number) {
  const { user } = useAuth()
  const [comments, setComments] = useState<Comment[]>([])
  const [loading, setLoading] = useState(true)

  const fetchComments = useCallback(async () => {
    setLoading(true)
    try {
      const { data, error } = await supabase
        .from('comments')
        .select(`
          *,
          profile:profiles(username, avatar_url)
        `)
        .eq('check_in_id', checkInId)
        .order('created_at', { ascending: false })

      if (error) throw error
      setComments(data || [])
    } catch (err) {
      console.error('Error fetching comments:', err)
    } finally {
      setLoading(false)
    }
  }, [checkInId])

  useEffect(() => {
    fetchComments()
  }, [fetchComments])

  const addComment = async (content: string) => {
    if (!user) {
      alert('请先登录后再评论')
      return false
    }

    if (!content.trim()) {
      return false
    }

    try {
      const { data, error } = await supabase
        .from('comments')
        .insert({
          user_id: user.id,
          check_in_id: checkInId,
          content: content.trim()
        })
        .select(`
          *,
          profile:profiles(username, avatar_url)
        `)
        .single()

      if (error) throw error

      setComments(prev => [data, ...prev])
      
      await supabase.rpc('increment_checkin_comments', { check_in_id: checkInId })
      
      return true
    } catch (err) {
      console.error('Error adding comment:', err)
      return false
    }
  }

  const deleteComment = async (commentId: number) => {
    try {
      await supabase
        .from('comments')
        .delete()
        .eq('id', commentId)

      setComments(prev => prev.filter(c => c.id !== commentId))
      
      await supabase.rpc('decrement_checkin_comments', { check_in_id: checkInId })
      
      return true
    } catch (err) {
      console.error('Error deleting comment:', err)
      return false
    }
  }

  return { comments, loading, addComment, deleteComment, refetch: fetchComments }
}
