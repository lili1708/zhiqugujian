import { useState, useEffect, useCallback } from 'react'
import { supabase } from '@/lib/supabase'
import { useAuth } from '@/contexts/AuthContext'
import type { CheckIn, Building } from '@/types'

interface CheckInWithBuilding extends CheckIn {
  building?: Building
}

export function useMyCheckIns() {
  const { user } = useAuth()
  const [checkIns, setCheckIns] = useState<CheckInWithBuilding[]>([])
  const [loading, setLoading] = useState(false)
  const [stats, setStats] = useState({ total: 0, cities: 0, likes: 0 })

  const fetchMyCheckIns = useCallback(async () => {
    if (!user) return
    
    setLoading(true)
    try {
      const { data, error } = await supabase
        .from('check_ins')
        .select(`
          *,
          building:buildings(*)
        `)
        .eq('user_id', user.id)
        .order('created_at', { ascending: false })

      if (error) throw error

      const checkInsData = data || []
      setCheckIns(checkInsData)
      
      const uniqueCities = new Set(
        checkInsData
          .map((c: any) => c.building?.location)
          .filter(Boolean)
      )
      const totalLikes = checkInsData.reduce((sum: number, c: any) => sum + (c.likes_count || 0), 0)
      
      setStats({
        total: checkInsData.length,
        cities: uniqueCities.size,
        likes: totalLikes
      })
    } catch (err) {
      console.error('Error fetching check-ins:', err)
    } finally {
      setLoading(false)
    }
  }, [user])

  useEffect(() => {
    fetchMyCheckIns()
  }, [fetchMyCheckIns])

  const deleteCheckIn = async (checkInId: number) => {
    try {
      await supabase.from('check_ins').delete().eq('id', checkInId)
      setCheckIns(prev => prev.filter(c => c.id !== checkInId))
      setStats(prev => ({ ...prev, total: prev.total - 1 }))
      return true
    } catch (err) {
      console.error('Error deleting check-in:', err)
      return false
    }
  }

  return { checkIns, loading, stats, refetch: fetchMyCheckIns, deleteCheckIn }
}

export function useNearbyCheckIns() {
  const [checkIns, setCheckIns] = useState<CheckInWithBuilding[]>([])
  const [loading, setLoading] = useState(false)

  const fetchNearbyCheckIns = useCallback(async () => {
    setLoading(true)
    try {
      const { data, error } = await supabase
        .from('check_ins')
        .select(`
          *,
          building:buildings(*),
          profile:profiles(*)
        `)
        .order('created_at', { ascending: false })
        .limit(20)

      if (error) throw error
      setCheckIns(data || [])
    } catch (err) {
      console.error('Error fetching nearby check-ins:', err)
    } finally {
      setLoading(false)
    }
  }, [])

  useEffect(() => {
    fetchNearbyCheckIns()
  }, [fetchNearbyCheckIns])

  return { checkIns, loading, refetch: fetchNearbyCheckIns }
}

export function useCreateCheckIn() {
  const { user } = useAuth()
  const [loading, setLoading] = useState(false)

  const createCheckIn = async (
    buildingId: number,
    note?: string,
    imageUrl?: string,
    latitude?: number,
    longitude?: number
  ) => {
    if (!user) {
      throw new Error('请先登录')
    }

    setLoading(true)
    try {
      const { data, error } = await supabase
        .from('check_ins')
        .insert({
          user_id: user.id,
          building_id: buildingId,
          note: note || null,
          image_url: imageUrl || null,
          latitude: latitude || null,
          longitude: longitude || null
        })
        .select()
        .single()

      if (error) throw error

      await supabase.rpc('increment_building_checkins', { building_id: buildingId })

      return data
    } catch (err) {
      console.error('Error creating check-in:', err)
      throw err
    } finally {
      setLoading(false)
    }
  }

  return { createCheckIn, loading }
}

export function useBuildingCheckStatus(buildingId: number) {
  const { user } = useAuth()
  const [checkedIn, setCheckedIn] = useState(false)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    if (!buildingId) {
      setLoading(false)
      return
    }

    if (!user) {
      setLoading(false)
      setCheckedIn(false)
      return
    }

    async function checkStatus() {
      if (!user) return
      
      try {
        const { data, error } = await supabase
          .from('check_ins')
          .select('id')
          .eq('user_id', user.id)
          .eq('building_id', buildingId)
          .maybeSingle()

        if (error) throw error
        setCheckedIn(!!data)
      } catch (err) {
        console.error('Error checking status:', err)
      } finally {
        setLoading(false)
      }
    }

    checkStatus()
  }, [user, buildingId])

  return { checkedIn, loading }
}

export function useLikeCheckIn() {
  const { user } = useAuth()
  const [loading, setLoading] = useState(false)

  const mutate = useCallback(async (checkInId: number) => {
    if (!user) return
    
    setLoading(true)
    try {
      const { data: existing } = await supabase
        .from('likes')
        .select('id')
        .eq('user_id', user.id)
        .eq('check_in_id', checkInId)
        .maybeSingle()

      if (existing) {
        await supabase.from('likes').delete().eq('id', existing.id)
      } else {
        await supabase.from('likes').insert({ user_id: user.id, check_in_id: checkInId })
      }
    } catch (err) {
      console.error('Error toggling like:', err)
    } finally {
      setLoading(false)
    }
  }, [user])

  return { mutate, loading }
}

export function useAddComment() {
  const { user } = useAuth()
  const [loading, setLoading] = useState(false)

  const mutate = useCallback(async (checkInId: number, content: string) => {
    if (!user || !content.trim()) return
    
    setLoading(true)
    try {
      await supabase.from('comments').insert({
        user_id: user.id,
        check_in_id: checkInId,
        content: content.trim()
      })
    } catch (err) {
      console.error('Error adding comment:', err)
    } finally {
      setLoading(false)
    }
  }, [user])

  return { mutate, loading }
}
