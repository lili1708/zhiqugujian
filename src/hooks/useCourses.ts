import { useState, useEffect, useCallback } from 'react'
import { supabase } from '@/lib/supabase'
import { useAuth } from '@/contexts/AuthContext'
import type { Course } from '@/types'

interface CourseProgress {
  course_id: number
  progress: number
  completed: boolean
}

const FALLBACK_COURSES: Course[] = [
  { id: 1, title: '斗拱的奥秘', description: '探索中国古代建筑特有的结构构件', cover_image: '/feature-learn.jpg', category: 'structure', duration: 15 },
  { id: 2, title: '榫卯传奇', description: '不用钉子的中国传统木艺', cover_image: '/feature-learn.jpg', category: 'technique', duration: 20 },
  { id: 3, title: '屋顶之美', description: '中国古建筑屋顶的形式与等级', cover_image: '/feature-learn.jpg', category: 'design', duration: 12 },
  { id: 4, title: '彩画艺术', description: '古建筑彩绘的种类与含义', cover_image: '/feature-learn.jpg', category: 'decoration', duration: 18 },
  { id: 5, title: '门窗装饰', description: '门窗纹样的文化内涵', cover_image: '/feature-learn.jpg', category: 'decoration', duration: 10 }
]

export function useCourses(category?: string) {
  const [courses, setCourses] = useState<Course[]>([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    async function fetchCourses() {
      try {
        let query = supabase.from('courses').select('*').order('id')
        if (category && category !== 'all') {
          query = query.eq('category', category)
        }
        
        const { data, error } = await query

        if (error) throw error

        if (data && data.length > 0) {
          setCourses(data)
        } else {
          let filtered = FALLBACK_COURSES
          if (category && category !== 'all') {
            filtered = filtered.filter(c => c.category === category)
          }
          setCourses(filtered)
        }
      } catch {
        let filtered = FALLBACK_COURSES
        if (category && category !== 'all') {
          filtered = filtered.filter(c => c.category === category)
        }
        setCourses(filtered)
      } finally {
        setLoading(false)
      }
    }

    fetchCourses()
  }, [category])

  return { courses, loading }
}

export function useCourseProgress() {
  const { user } = useAuth()
  const [progressMap, setProgressMap] = useState<Map<number, CourseProgress>>(new Map())
  const [loading, setLoading] = useState(true)

  const fetchProgress = useCallback(async () => {
    if (!user) {
      setLoading(false)
      return
    }

    try {
      const { data, error } = await supabase
        .from('course_progress')
        .select('*')
        .eq('user_id', user.id)

      if (error) throw error

      const map = new Map<number, CourseProgress>()
      ;(data || []).forEach(p => {
        map.set(p.course_id, p)
      })
      setProgressMap(map)
    } catch (err) {
      console.error('Error fetching course progress:', err)
    } finally {
      setLoading(false)
    }
  }, [user])

  useEffect(() => {
    fetchProgress()
  }, [fetchProgress])

  const getProgress = (courseId: number): CourseProgress | undefined => {
    return progressMap.get(courseId)
  }

  const updateProgress = async (courseId: number, newProgress: number) => {
    if (!user) return false

    const completed = newProgress >= 100
    const existing = progressMap.get(courseId)

    try {
      if (existing) {
        await supabase
          .from('course_progress')
          .update({
            progress: newProgress,
            completed,
            completed_at: completed ? new Date().toISOString() : null
          })
          .eq('user_id', user.id)
          .eq('course_id', courseId)
      } else {
        await supabase
          .from('course_progress')
          .insert({
            user_id: user.id,
            course_id: courseId,
            progress: newProgress,
            completed,
            completed_at: completed ? new Date().toISOString() : null
          })
      }

      setProgressMap(prev => {
        const newMap = new Map(prev)
        newMap.set(courseId, { course_id: courseId, progress: newProgress, completed })
        return newMap
      })

      return true
    } catch (err) {
      console.error('Error updating progress:', err)
      return false
    }
  }

  const completedCount = Array.from(progressMap.values()).filter(p => p.completed).length

  return { progressMap, loading, getProgress, updateProgress, completedCount, refetch: fetchProgress }
}

export function useCourseCategories() {
  const [categories, setCategories] = useState<{id: string; name: string; count: number}[]>([
    { id: 'structure', name: '建筑结构', count: 0 },
    { id: 'history', name: '历史沿革', count: 0 },
    { id: 'culture', name: '文化内涵', count: 0 },
    { id: 'craft', name: '工艺技术', count: 0 }
  ])

  useEffect(() => {
    async function fetchCategories() {
      try {
        const { data } = await supabase
          .from('courses')
          .select('category')

        if (data) {
          const counts: Record<string, number> = {}
          data.forEach(c => {
            counts[c.category] = (counts[c.category] || 0) + 1
          })
          setCategories(prev => prev.map(cat => ({
            ...cat,
            count: counts[cat.id] || 0
          })))
        }
      } catch (err) {
        console.error('Error fetching categories:', err)
      }
    }

    fetchCategories()
  }, [])

  return categories
}
