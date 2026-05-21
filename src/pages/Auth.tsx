import { useState } from 'react'
import { useNavigate, Link } from 'react-router-dom'
import { Mail, Lock, User, Loader2, Github, Play } from 'lucide-react'
import { useAuth } from '@/contexts/AuthContext'

export default function Auth() {
  const [isLogin, setIsLogin] = useState(true)
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [username, setUsername] = useState('')
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')
  
  const { signIn, signUp, signInWithGithub, signInAnonymous } = useAuth()
  const navigate = useNavigate()

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setError('')
    setLoading(true)

    try {
      if (isLogin) {
        const { error } = await signIn(email, password)
        if (error) {
          setError(error.message)
        } else {
          navigate('/profile')
        }
      } else {
        const { error } = await signUp(email, password, username)
        if (error) {
          setError(error.message)
        } else {
          setError('注册成功！请检查邮箱完成验证，或直接登录。')
          setIsLogin(true)
        }
      }
    } catch (err) {
      setError('操作失败，请重试')
    } finally {
      setLoading(false)
    }
  }

  const handleGithubLogin = async () => {
    await signInWithGithub()
  }

  const handleDemoLogin = async () => {
    setLoading(true)
    try {
      await signInAnonymous()
      navigate('/profile')
    } catch (err) {
      setError('体验登录失败')
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="min-h-screen flex flex-col" style={{ backgroundColor: '#fef6f6' }}>
      {/* Header */}
      <header className="bg-white px-4 py-4">
        <Link to="/" className="text-xl font-bold text-[#1d3557]">古建智趣</Link>
      </header>

      {/* Content */}
      <div className="flex-1 flex items-center justify-center px-4">
        <div className="w-full max-w-sm">
          {/* Logo */}
          <div className="text-center mb-8">
            <div className="w-16 h-16 bg-[#e63946]/10 rounded-full flex items-center justify-center mx-auto mb-4">
              <span className="text-3xl">🏛️</span>
            </div>
            <h1 className="text-2xl font-bold text-[#1d3557]">
              {isLogin ? '登录' : '注册'}
            </h1>
            <p className="text-gray-500 mt-2">
              {isLogin ? '欢迎回来，继续你的文化之旅' : '加入我们，探索古建筑之美'}
            </p>
          </div>

          {/* Form */}
          <form onSubmit={handleSubmit} className="space-y-4">
            {!isLogin && (
              <div className="relative">
                <User className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
                <input
                  type="text"
                  placeholder="用户名"
                  value={username}
                  onChange={(e) => setUsername(e.target.value)}
                  className="w-full pl-10 pr-4 py-3 bg-white border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-[#e63946]/20"
                  required={!isLogin}
                />
              </div>
            )}

            <div className="relative">
              <Mail className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
              <input
                type="email"
                placeholder="邮箱"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="w-full pl-10 pr-4 py-3 bg-white border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-[#e63946]/20"
                required
              />
            </div>

            <div className="relative">
              <Lock className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
              <input
                type="password"
                placeholder="密码"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="w-full pl-10 pr-4 py-3 bg-white border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-[#e63946]/20"
                required
                minLength={6}
              />
            </div>

            {error && (
              <div className="text-red-500 text-sm text-center">{error}</div>
            )}

            <button
              type="submit"
              disabled={loading}
              className="w-full py-3 bg-[#e63946] text-white rounded-xl font-medium hover:bg-[#c1121f] transition-colors disabled:opacity-50 flex items-center justify-center"
            >
              {loading ? (
                <Loader2 className="w-5 h-5 animate-spin" />
              ) : (
                isLogin ? '登录' : '注册'
              )}
            </button>
          </form>

          {/* Divider */}
          <div className="relative my-6">
            <div className="absolute inset-0 flex items-center">
              <div className="w-full border-t border-gray-200" />
            </div>
            <div className="relative flex justify-center text-sm">
              <span className="px-4 bg-gray-50 text-gray-500">或</span>
            </div>
          </div>

          {/* Social Login */}
          <button
            onClick={handleGithubLogin}
            className="w-full py-3 bg-gray-800 text-white rounded-xl font-medium hover:bg-gray-900 transition-colors flex items-center justify-center gap-2"
          >
            <Github className="w-5 h-5" />
            使用 GitHub 登录
          </button>

          {/* Demo Login */}
          <button
            onClick={handleDemoLogin}
            className="w-full py-3 mt-3 bg-green-500 text-white rounded-xl font-medium hover:bg-green-600 transition-colors flex items-center justify-center gap-2"
          >
            <Play className="w-5 h-5" />
            体验试用
          </button>

          {/* Toggle */}
          <div className="text-center mt-6 text-gray-500">
            {isLogin ? '还没有账号？' : '已有账号？'}
            <button
              type="button"
              onClick={() => { setIsLogin(!isLogin); setError('') }}
              className="text-[#e63946] ml-1 font-medium"
            >
              {isLogin ? '立即注册' : '立即登录'}
            </button>
          </div>
        </div>
      </div>
    </div>
  )
}
