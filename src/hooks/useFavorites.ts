import { useState, useEffect, useCallback } from 'react'
import { supabase } from '@/lib/supabase'
import { useAuth } from '@/contexts/AuthContext'

export function useFavorites() {
  const { user } = useAuth()
  const [favorites, setFavorites] = useState<number[]>([])
  const [loading, setLoading] = useState(false)

  const fetchFavorites = useCallback(async () => {
    if (!user) return
    
    setLoading(true)
    try {
      const { data, error } = await supabase
        .from('favorites')
        .select('building_id')
        .eq('user_id', user.id)

      if (error) throw error
      setFavorites(data?.map(f => f.building_id) || [])
    } catch (err) {
      console.error('Error fetching favorites:', err)
    } finally {
      setLoading(false)
    }
  }, [user])

  useEffect(() => {
    fetchFavorites()
  }, [fetchFavorites])

  const toggleFavorite = async (buildingId: number) => {
    if (!user) return false

    const isFavorited = favorites.includes(buildingId)

    try {
      if (isFavorited) {
        await supabase
          .from('favorites')
          .delete()
          .eq('user_id', user.id)
          .eq('building_id', buildingId)
        setFavorites(prev => prev.filter(id => id !== buildingId))
      } else {
        await supabase
          .from('favorites')
          .insert({ user_id: user.id, building_id: buildingId })
        setFavorites(prev => [...prev, buildingId])
      }
      return true
    } catch (err) {
      console.error('Error toggling favorite:', err)
      return false
    }
  }

  const isFavorited = (buildingId: number) => favorites.includes(buildingId)

  return { favorites, loading, toggleFavorite, isFavorited, refetch: fetchFavorites }
}
