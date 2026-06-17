import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { useAuth } from '../context/AuthContext'

const industries = [
  { id: 'restaurant', name: 'Restaurant', desc: 'Bookings, orders & voice agent' },
  { id: 'insurance', name: 'Insurance', desc: 'Claims, policies & client calls' },
]

function CheckboxIcon({ className = '' }) {
  return (
    <div className={`w-4 h-4 border-2 border-current rounded-sm flex-shrink-0 ${className}`} />
  )
}

function LoginPage() {
  const navigate = useNavigate()
  const { login } = useAuth()
  const [selectedIndustry, setSelectedIndustry] = useState('restaurant')
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [error, setError] = useState('')
  const [loading, setLoading] = useState(false)

  const selected = industries.find((i) => i.id === selectedIndustry)

  const handleChange = () => {
    setSelectedIndustry((prev) => (prev === 'restaurant' ? 'insurance' : 'restaurant'))
    setError('')
  }

  const handleLogin = async (e) => {
    e.preventDefault()
    setError('')
    setLoading(true)

    try {
      const res = await fetch('https://agentai-auth-service.agarwalsomya224.workers.dev/api/auth/login', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email, password, industry: selectedIndustry }),
      })

      const data = await res.json()

      if (!res.ok) {
        setError(data.message || 'Login failed')
        return
      }

      login(data.token, data.user)
      navigate(`/dashboard/${selectedIndustry}`)
    } catch {
      setError('Cannot connect to server. Make sure the backend is running.')
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="min-h-screen flex">

      {/* ── Left Panel ── */}
      <div className="w-1/2 bg-blue-700 flex flex-col p-10 min-h-screen">

        {/* Brand */}
        <div className="flex items-center gap-2 text-white font-semibold text-lg">
          <CheckboxIcon className="border-white" />
          <span>AgentAI</span>
        </div>

        {/* Heading */}
        <div className="flex-1 flex flex-col justify-center py-10">
          <h1 className="text-3xl font-bold text-white leading-snug mb-4">
            Your AI agent is ready to<br />take calls
          </h1>
          <p className="text-blue-200 text-sm leading-relaxed mb-10">
            Select your industry to load the right dashboard and configuration after login.
          </p>

          {/* Industry Cards */}
          <div className="flex flex-col gap-3">
            {industries.map((ind) => (
              <button
                key={ind.id}
                onClick={() => setSelectedIndustry(ind.id)}
                className={`flex items-center justify-between rounded-xl px-5 py-4 text-left transition-colors duration-200 ${
                  selectedIndustry === ind.id
                    ? 'bg-blue-500'
                    : 'bg-blue-900 hover:bg-blue-800'
                }`}
              >
                <div className="flex items-center gap-3">
                  <CheckboxIcon className="border-blue-300" />
                  <div>
                    <p className="text-white font-bold text-sm">{ind.name}</p>
                    <p className="text-blue-200 text-xs mt-0.5">{ind.desc}</p>
                  </div>
                </div>
                <CheckboxIcon className="border-blue-300" />
              </button>
            ))}
          </div>
        </div>

        {/* Footer */}
        <p className="text-blue-400 text-xs">Powered by Twilio · VAPI · SIP</p>
      </div>

      {/* ── Right Panel ── */}
      <div className="w-1/2 flex flex-col justify-center px-16 py-12 bg-white">

        <h2 className="text-4xl font-bold text-gray-900 mb-2">Welcome back</h2>
        <p className="text-gray-400 text-sm mb-8">Login to access your AI agent dashboard.</p>

        {/* Industry badge */}
        <div className="flex items-center justify-between bg-gray-50 border border-gray-200 rounded-xl px-4 py-3 mb-7">
          <div className="flex items-center gap-3">
            <CheckboxIcon className="border-gray-400" />
            <span className="text-gray-800 font-semibold text-sm">{selected.name} dashboard</span>
          </div>
          <button
            type="button"
            onClick={handleChange}
            className="text-blue-600 text-sm font-medium hover:underline"
          >
            Change
          </button>
        </div>

        <form onSubmit={handleLogin} className="flex flex-col gap-5">

          {/* Email */}
          <div>
            <label className="block text-sm font-semibold text-gray-700 mb-1.5">
              Email address
            </label>
            <div className="relative">
              <input
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="you@company.com"
                required
                className="w-full border border-gray-200 rounded-xl px-4 py-3 pr-10 text-sm text-gray-800 placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              />
              <CheckboxIcon className="border-gray-300 absolute right-3 top-1/2 -translate-y-1/2" />
            </div>
          </div>

          {/* Password */}
          <div>
            <label className="block text-sm font-semibold text-gray-700 mb-1.5">
              Password
            </label>
            <div className="relative">
              <input
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="••••••••"
                required
                className="w-full border border-gray-200 rounded-xl px-4 py-3 pr-10 text-sm text-gray-800 placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              />
              <CheckboxIcon className="border-gray-300 absolute right-3 top-1/2 -translate-y-1/2" />
            </div>
          </div>

          {/* Forgot password */}
          <div className="text-right -mt-2">
            <a href="#" className="text-blue-600 text-sm hover:underline">
              Forgot password?
            </a>
          </div>

          {/* Error message */}
          {error && (
            <p className="text-red-500 text-xs text-center -mt-1">{error}</p>
          )}

          {/* Submit */}
          <button
            type="submit"
            disabled={loading}
            className="w-full bg-gray-900 hover:bg-gray-800 disabled:bg-gray-400 text-white font-semibold py-4 rounded-xl text-sm transition-colors duration-200"
          >
            {loading ? 'Logging in...' : 'Login to dashboard →'}
          </button>
        </form>

        {/* JWT divider */}
        <div className="flex items-center gap-3 my-6">
          <div className="flex-1 h-px bg-gray-200" />
          <span className="text-gray-400 text-xs font-medium">JWT secured</span>
          <div className="flex-1 h-px bg-gray-200" />
        </div>

        {/* JWT note */}
        <div className="flex items-start gap-2.5 mb-6">
          <CheckboxIcon className="border-gray-300 mt-0.5" />
          <p className="text-gray-400 text-xs leading-relaxed">
            Tokens validated via API gateway on every request
          </p>
        </div>

        {/* Sign up */}
        <p className="text-gray-400 text-sm text-center">
          Don&apos;t have an account?{' '}
          <a href="#" className="text-blue-600 hover:underline font-medium">
            Contact your admin
          </a>
        </p>

      </div>
    </div>
  )
}

export default LoginPage
