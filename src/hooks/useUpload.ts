import { useState, useCallback } from 'react'
import { supabase } from '@/lib/supabase'
import { useAuth } from '@/contexts/AuthContext'

export function useUpload() {
  const { user } = useAuth()
  const [uploading, setUploading] = useState(false)
  const [progress, setProgress] = useState(0)

  const uploadImage = useCallback(async (file: File, bucket: string = 'checkins', folder?: string): Promise<string | null> => {
    if (!user) {
      throw new Error('请先登录')
    }

    setUploading(true)
    setProgress(0)

    try {
      const fileExt = file.name.split('.').pop()
      const fileName = `${Date.now()}-${Math.random().toString(36).substr(2, 9)}.${fileExt}`
      const filePath = folder ? `${folder}/${fileName}` : fileName

      const { error: uploadError } = await supabase.storage
        .from(bucket)
        .upload(filePath, file, {
          cacheControl: '3600',
          upsert: false
        })

      if (uploadError) throw uploadError

      setProgress(100)

      const { data: { publicUrl } } = supabase.storage
        .from(bucket)
        .getPublicUrl(filePath)

      return publicUrl
    } catch (err) {
      console.error('Upload error:', err)
      throw err
    } finally {
      setUploading(false)
      setProgress(0)
    }
  }, [user])

  const uploadMultiple = useCallback(async (files: File[], bucket: string = 'checkins', folder?: string): Promise<string[]> => {
    if (!user) {
      throw new Error('请先登录')
    }

    setUploading(true)
    const urls: string[] = []

    try {
      for (let i = 0; i < files.length; i++) {
        const url = await uploadImage(files[i], bucket, folder)
        if (url) urls.push(url)
        setProgress(Math.round(((i + 1) / files.length) * 100))
      }
      return urls
    } finally {
      setUploading(false)
      setProgress(0)
    }
  }, [user, uploadImage])

  const deleteImage = useCallback(async (url: string, bucket: string = 'checkins'): Promise<boolean> => {
    try {
      const path = url.split(`/storage/v1/object/public/${bucket}/`)[1]
      if (!path) return false

      const { error } = await supabase.storage
        .from(bucket)
        .remove([path])

      if (error) throw error
      return true
    } catch (err) {
      console.error('Delete error:', err)
      return false
    }
  }, [])

  return { uploadImage, uploadMultiple, deleteImage, uploading, progress }
}

export function useAvatarUpload() {
  const { user } = useAuth()
  const [uploading, setUploading] = useState(false)

  const uploadAvatar = useCallback(async (file: File): Promise<string | null> => {
    if (!user) {
      throw new Error('请先登录')
    }

    setUploading(true)

    try {
      const fileExt = file.name.split('.').pop()
      const fileName = `${user.id}/avatar.${fileExt}`

      const { error: uploadError } = await supabase.storage
        .from('avatars')
        .upload(fileName, file, {
          cacheControl: '3600',
          upsert: true
        })

      if (uploadError) throw uploadError

      const { data: { publicUrl } } = supabase.storage
        .from('avatars')
        .getPublicUrl(fileName)

      await supabase
        .from('profiles')
        .update({ avatar_url: publicUrl, updated_at: new Date().toISOString() })
        .eq('id', user.id)

      return publicUrl
    } catch (err) {
      console.error('Avatar upload error:', err)
      throw err
    } finally {
      setUploading(false)
    }
  }, [user])

  return { uploadAvatar, uploading }
}
