import { useState, useCallback } from 'react'
import { Share2, CheckCircle } from 'lucide-react'

interface ShareButtonProps {
  title: string
  text?: string
  url?: string
}

export function useShare() {
  const [sharing, setSharing] = useState(false)

  const share = useCallback(async ({ title, text, url }: ShareButtonProps) => {
    if (!navigator.share) {
      // 复制链接
      if (url) {
        await navigator.clipboard.writeText(url)
        alert('链接已复制到剪贴板')
      }
      return false
    }

    try {
      await navigator.share({
        title,
        text,
        url: url || window.location.href
      })
      return true
    } catch (err) {
      if ((err as Error).name !== 'AbortError') {
        console.error('Share error:', err)
      }
      return false
    } finally {
      setSharing(false)
    }
  }, [])

  return { share, sharing }
}

export function ShareButton({ title, text, url }: ShareButtonProps) {
  const { share, sharing } = useShare()

  const handleShare = async () => {
    await share({ title, text, url })
  }

  return (
    <button
      onClick={handleShare}
      disabled={sharing}
      className="flex items-center gap-1 text-gray-500"
    >
      <Share2 className="w-4 h-4" />
    </button>
  )
}

// Success animation component
export function CheckInSuccess({ show }: { show: boolean }) {
  if (!show) return null

  return (
    <div className="fixed inset-0 bg-black/50 z-50 flex items-center justify-center">
      <div className="bg-white rounded-2xl p-8 text-center animate-scale-up">
        <div className="w-20 h-20 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-4">
          <CheckCircle className="w-10 h-10 text-green-500" />
        </div>
        <h3 className="text-xl font-bold text-green-600">打卡成功！</h3>
        <p className="text-gray-500 mt-2">记录你的文化足迹</p>
      </div>
    </div>
  )
}