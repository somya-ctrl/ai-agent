import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { useAuth } from '../context/AuthContext'

const INDUSTRIES = [
  { id: 'restaurant', label: 'Restaurant', desc: 'Bookings, orders & voice agent', icon: '🍽️' },
  { id: 'insurance', label: 'Insurance', desc: 'Claims, policies & client calls', icon: '🛡️' },
]

function LoginPage() {
  const navigate = useNavigate()
  const { login } = useAuth()
  const [showPassword, setShowPassword] = useState(false)
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [error, setError] = useState('')
  const [loading, setLoading] = useState(false)
  const [showIndustryPicker, setShowIndustryPicker] = useState(false)

  const handleLogin = async (e) => {
    e.preventDefault()
    setError('')
    setLoading(true)

    try {
      const res = await fetch('https://agentai-auth-service.agarwalsomya224.workers.dev/api/auth/login', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email, password }),
      })

      const data = await res.json()

      if (!res.ok) {
        setError(data.message || 'Login failed')
        return
      }

      login(data.token, data.user)

      const isAdmin = data.user.role === 'admin' || data.user.industry === 'admin'

      if (isAdmin) {
        setShowIndustryPicker(true)
      } else if (data.user.industry === 'restaurant') {
        navigate('/dashboard/restaurant')
      } else if (data.user.industry === 'insurance') {
        navigate('/dashboard/insurance')
      } else {
        setError('Unknown industry. Please contact your admin.')
      }
    } catch {
      setError('Cannot connect to server. Please try again.')
    } finally {
      setLoading(false)
    }
  }

  /* ── Admin industry picker ── */
  if (showIndustryPicker) {
    return (
      <div className="min-h-screen bg-white flex items-center justify-center p-4">
        <div className="w-full max-w-md">
          <div className="text-center mb-8">
            <div className="text-3xl mb-3">👋</div>
            <h2 className="text-2xl font-bold text-gray-900 mb-1">Welcome, Admin</h2>
            <p className="text-gray-500 text-sm">Choose which dashboard to open</p>
          </div>
          <div className="flex flex-col gap-4">
            {INDUSTRIES.map((ind) => (
              <button
                key={ind.id}
                onClick={() => navigate(`/dashboard/${ind.id}`)}
                className="flex items-center gap-4 p-5 border-2 border-gray-100 hover:border-blue-500 rounded-2xl text-left transition-all duration-200 group"
              >
                <span className="text-3xl">{ind.icon}</span>
                <div>
                  <p className="font-bold text-gray-900 group-hover:text-blue-700">{ind.label}</p>
                  <p className="text-sm text-gray-400">{ind.desc}</p>
                </div>
                <span className="ml-auto text-gray-300 group-hover:text-blue-500 text-xl">→</span>
              </button>
            ))}
          </div>
        </div>
      </div>
    )
  }

  /* ── Login form ── */
  return (
    <div className="min-h-screen bg-white flex items-center justify-center p-3 sm:p-4">
      <div className="grid grid-cols-1 lg:grid-cols-2 w-full max-w-5xl border border-gray-100 rounded-2xl overflow-hidden shadow-sm">

        {/* Left Panel */}
        <div className="bg-blue-900 p-6 sm:p-8 lg:p-10 flex flex-col justify-between gap-8 lg:gap-0">
          <div>
            <div className="flex items-center gap-2 text-blue-50 text-base sm:text-lg font-semibold mb-4 sm:mb-6">
              <span>🤖</span>
              <span>AgentAI</span>
            </div>

            <span className="inline-block bg-white/10 border border-white/25 text-blue-200 text-xs px-4 py-1.5 rounded-full mb-4 sm:mb-6">
              AI-powered voice & messaging agents
            </span>

            <h2 className="text-xl sm:text-2xl font-bold text-blue-50 mb-3 leading-snug">
              Automate customer conversations across every industry
            </h2>
            <p className="text-blue-200 text-sm leading-relaxed mb-6 lg:mb-8">
              Deploy intelligent AI agents for inbound calls, WhatsApp, and bookings — without changing your existing phone number.
            </p>
          </div>

          <div className="hidden sm:block">
            {[
              { icon: '📞', text: 'Voice agent on your existing SIP number' },
              { icon: '💬', text: '24/7 WhatsApp automation' },
              { icon: '📊', text: 'Live dashboard for bookings & calls' },
              { icon: '🔒', text: 'JWT secured, role-based access' },
            ].map((f) => (
              <div key={f.text} className="flex items-center gap-3 py-2.5 lg:py-3 border-t border-white/15">
                <span className="text-base">{f.icon}</span>
                <span className="text-sm text-blue-50">{f.text}</span>
              </div>
            ))}
          </div>

          <p className="text-xs text-blue-300">© 2026 AgentAI. All rights reserved.</p>
        </div>

        {/* Right Panel */}
        <div className="bg-white p-6 sm:p-8 lg:p-10 flex flex-col justify-center">
          <h1 className="text-xl sm:text-2xl font-bold text-gray-900 mb-2">Welcome back</h1>
          <p className="text-sm text-gray-500 mb-6 lg:mb-8 leading-relaxed">
            Login with your credentials. You'll be redirected to your dashboard automatically based on your role.
          </p>

          <form onSubmit={handleLogin}>
            <div className="mb-4">
              <label className="block text-xs font-semibold text-gray-600 mb-1.5">
                Email address
              </label>
              <div className="relative">
                <input
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="you@company.com"
                  required
                  className="w-full h-11 border border-gray-200 rounded-lg px-3 pr-10 text-sm focus:outline-none focus:ring-2 focus:ring-blue-100 focus:border-blue-500 transition-colors"
                />
                <span className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 text-base">
                  ✉️
                </span>
              </div>
            </div>

            <div className="mb-2">
              <label className="block text-xs font-semibold text-gray-600 mb-1.5">
                Password
              </label>
              <div className="relative">
                <input
                  type={showPassword ? 'text' : 'password'}
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="••••••••"
                  required
                  className="w-full h-11 border border-gray-200 rounded-lg px-3 pr-10 text-sm focus:outline-none focus:ring-2 focus:ring-blue-100 focus:border-blue-500 transition-colors"
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 text-sm"
                >
                  {showPassword ? '🙈' : '👁️'}
                </button>
              </div>
            </div>

            <div className="text-right mb-6">
              <a href="#" className="text-xs text-gray-500 hover:text-blue-700 transition-colors">
                Forgot password?
              </a>
            </div>

            {error && (
              <p className="text-red-500 text-xs mb-3 text-center">{error}</p>
            )}

            <button
              type="submit"
              disabled={loading}
              className="w-full h-11 bg-blue-700 hover:bg-blue-800 disabled:bg-blue-400 text-white font-semibold text-sm rounded-lg transition-colors duration-200"
            >
              {loading ? 'Logging in...' : 'Login →'}
            </button>
          </form>

          <div className="flex items-center gap-3 my-6">
            <div className="flex-1 h-px bg-gray-100" />
            <span className="text-xs text-gray-400">Role-based access</span>
            <div className="flex-1 h-px bg-gray-100" />
          </div>

          <div className="flex items-start gap-2 bg-blue-50 rounded-lg p-3">
            <span className="text-sm mt-0.5">ℹ️</span>
            <p className="text-xs text-blue-900 leading-relaxed">
              Restaurant and insurance accounts go straight to their dashboard. Admin accounts can view any dashboard.
            </p>
          </div>
        </div>

      </div>
    </div>
  )
}

export default LoginPage
