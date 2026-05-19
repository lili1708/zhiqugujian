import { useState, useEffect, useCallback } from 'react'
import { supabase } from '@/lib/supabase'
import { useAuth } from '@/contexts/AuthContext'
import type { Profile, Achievement } from '@/types'

interface UserStats {
  checkins: number
  courses: number
  cities: number
  likes: number
}

interface RecentActivity {
  id: number
  type: 'checkin' | 'learn' | 'like'
  content: string
  time: string
}

export function useProfile() {
  const { user } = useAuth()
  const [profile, setProfile] = useState<Profile | null>(null)
  const [loading, setLoading] = useState(true)
  const [stats, setStats] = useState<UserStats>({ checkins: 0, courses: 0, cities: 0, likes: 0 })
  const [recentActivity, setRecentActivity] = useState<RecentActivity[]>([])

  const fetchProfile = useCallback(async () => {
    if (!user) {
      setLoading(false)
      return
    }

    setLoading(true)
    try {
      const { data: profileData, error: profileError } = await supabase
        .from('profiles')
        .select('*')
        .eq('id', user.id)
        .single()

      if (profileError && profileError.code !== 'PGRST116') throw profileError
      setProfile(profileData)

      const { data: checkinsData } = await supabase
        .from('check_ins')
        .select('building:buildings(location)')
        .eq('user_id', user.id)

      const { data: coursesData } = await supabase
        .from('course_progress')
        .select('*')
        .eq('user_id', user.id)
        .eq('completed', true)

      const { data: likesData } = await supabase
        .from('check_ins')
        .select('likes_count')
        .eq('user_id', user.id)

      const cities = new Set(
        (checkinsData || [])
          .map((c: any) => c.building?.location)
          .filter(Boolean)
      ).size

      const totalLikes = (likesData || []).reduce((sum, c) => sum + (c.likes_count || 0), 0)

      setStats({
        checkins: (checkinsData || []).length,
        courses: (coursesData || []).length,
        cities,
        likes: totalLikes
      })

      const activities: RecentActivity[] = []
      
      const latestCheckin = (checkinsData || [])[0] as any
      if (latestCheckin?.building?.name) {
        activities.push({
          id: Date.now(),
          type: 'checkin',
          content: `打卡了 ${latestCheckin.building.name}`,
          time: '最近'
        })
      }

      setRecentActivity(activities)
    } catch (err) {
      console.error('Error fetching profile:', err)
    } finally {
      setLoading(false)
    }
  }, [user])

  useEffect(() => {
    fetchProfile()
  }, [fetchProfile])

  const updateProfile = async (updates: { username?: string; bio?: string; avatar_url?: string }) => {
    if (!user) return false

    try {
      const { error } = await supabase
        .from('profiles')
        .update({ ...updates, updated_at: new Date().toISOString() })
        .eq('id', user.id)

      if (error) throw error
      await fetchProfile()
      return true
    } catch (err) {
      console.error('Error updating profile:', err)
      return false
    }
  }

  return { profile, loading, stats, recentActivity, updateProfile, refetch: fetchProfile }
}

export function useAchievements() {
  const { user } = useAuth()
  const [achievements, setAchievements] = useState<Achievement[]>([])
  const [unlockedIds, setUnlockedIds] = useState<number[]>([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    async function fetchAchievements() {
      try {
        const { data: allData } = await supabase
          .from('achievements')
          .select('*')
          .order('requirement')

        setAchievements(allData || [])

        if (user) {
          const { data: unlockedData } = await supabase
            .from('user_achievements')
            .select('achievement_id')
            .eq('user_id', user.id)

          setUnlockedIds(unlockedData?.map(u => u.achievement_id) || [])
        }
      } catch (err) {
        console.error('Error fetching achievements:', err)
      } finally {
        setLoading(false)
      }
    }

    fetchAchievements()
  }, [user])

  const isUnlocked = (achievementId: number) => unlockedIds.includes(achievementId)

  return { achievements, loading, isUnlocked }
}

export function useFavoritesCount() {
  const { user } = useAuth()
  const [count, setCount] = useState(0)

  useEffect(() => {
    if (!user) return

    supabase
      .from('favorites')
      .select('id', { count: 'exact' })
      .eq('user_id', user.id)
      .then(({ count }) => {
        setCount(count || 0)
      })
  }, [user])

  return count
}

export function useBookmarksCount() {
  const { user } = useAuth()
  const [count, setCount] = useState(0)

  useEffect(() => {
    if (!user) return

    supabase
      .from('course_progress')
      .select('id', { count: 'exact' })
      .eq('user_id', user.id)
      .gt('progress', 0)
      .then(({ count }) => {
        setCount(count || 0)
      })
  }, [user])

  return count
}
