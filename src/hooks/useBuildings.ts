import { useState, useEffect } from 'react'
import { supabase } from '@/lib/supabase'
import type { Building } from '@/types'

const FALLBACK_BUILDINGS: Building[] = [
  {
    id: 1,
    name: '故宫太和殿',
    location: '北京',
    category: 'palace',
    description: '紫禁城内最大的殿宇，中国现存最大的木结构大殿',
    image: '/building-1.jpg',
    rating: 4.9,
    checkin_count: 12580,
    latitude: 39.9163,
    longitude: 116.3972,
    created_at: new Date().toISOString()
  },
  {
    id: 2,
    name: '拙政园',
    location: '苏州',
    category: 'garden',
    description: '中国四大名园之一，江南园林的代表作品',
    image: '/building-2.jpg',
    rating: 4.8,
    checkin_count: 8920,
    latitude: 31.3683,
    longitude: 120.6115,
    created_at: new Date().toISOString()
  },
  {
    id: 3,
    name: '悬空寺',
    location: '山西',
    category: 'temple',
    description: '悬挂在悬崖峭壁上的千年古寺',
    image: '/building-3.jpg',
    rating: 4.9,
    checkin_count: 6540,
    latitude: 39.9632,
    longitude: 113.9458,
    created_at: new Date().toISOString()
  },
  {
    id: 4,
    name: '福建土楼',
    location: '福建',
    category: 'folk',
    description: '客家传统民居，世界文化遗产',
    image: '/building-4.jpg',
    rating: 4.7,
    checkin_count: 4320,
    latitude: 24.7698,
    longitude: 117.0338,
    created_at: new Date().toISOString()
  },
  {
    id: 5,
    name: '天坛祈年殿',
    location: '北京',
    category: 'temple',
    description: '明清皇帝祭天的场所，中国古代建筑的杰作',
    image: '/building-5.jpg',
    rating: 4.9,
    checkin_count: 11200,
    latitude: 39.8889,
    longitude: 116.4125,
    created_at: new Date().toISOString()
  },
  {
    id: 6,
    name: '大雁塔',
    location: '西安',
    category: 'tower',
    description: '唐代佛教建筑，西安的标志性建筑',
    image: '/building-6.jpg',
    rating: 4.8,
    checkin_count: 7890,
    latitude: 34.2194,
    longitude: 108.9591,
    created_at: new Date().toISOString()
  }
]

export function useBuildings(category?: string, search?: string) {
  const [buildings, setBuildings] = useState<Building[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    async function fetchBuildings() {
      try {
        setLoading(true)
        let query = supabase
          .from('buildings')
          .select('*')
          .order('checkin_count', { ascending: false })

        if (category && category !== 'all') {
          query = query.eq('category', category)
        }

        if (search) {
          query = query.or(`name.ilike.%${search}%,location.ilike.%${search}%`)
        }

        const { data, error: fetchError } = await query

        if (fetchError) throw fetchError

        if (data && data.length > 0) {
          setBuildings(data)
        } else {
          setBuildings(FALLBACK_BUILDINGS)
        }
      } catch (err) {
        console.warn('Failed to fetch buildings, using fallback:', err)
        let filtered = FALLBACK_BUILDINGS
        if (category && category !== 'all') {
          filtered = filtered.filter(b => b.category === category)
        }
        if (search) {
          filtered = filtered.filter(b => 
            b.name.toLowerCase().includes(search.toLowerCase()) ||
            b.location.toLowerCase().includes(search.toLowerCase())
          )
        }
        setBuildings(filtered)
        setError(null)
      } finally {
        setLoading(false)
      }
    }

    fetchBuildings()
  }, [category, search])

  return { buildings, loading, error }
}

export function useFeaturedBuildings() {
  const [buildings, setBuildings] = useState<Building[]>([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    async function fetchFeatured() {
      try {
        const { data, error } = await supabase
          .from('buildings')
          .select('*')
          .order('rating', { ascending: false })
          .order('checkin_count', { ascending: false })
          .limit(3)

        if (error) throw error
        if (data && data.length > 0) {
          setBuildings(data)
        } else {
          setBuildings(FALLBACK_BUILDINGS.slice(0, 3))
        }
      } catch {
        setBuildings(FALLBACK_BUILDINGS.slice(0, 3))
      } finally {
        setLoading(false)
      }
    }

    fetchFeatured()
  }, [])

  return { buildings, loading }
}
