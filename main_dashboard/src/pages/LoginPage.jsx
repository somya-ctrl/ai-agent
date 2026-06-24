import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { useAuth } from '../context/AuthContext'

const inputCls = `
  w-full h-11 rounded-lg px-3 pr-10 text-sm transition-colors
  bg-white/5 border border-white/10 text-white placeholder-white/25
  focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500
`

function LoginPage() {
  const navigate = useNavigate()
  const { login } = useAuth()
  const [showPassword, setShowPassword] = useState(false)
  const [email, setEmail]       = useState('')
  const [password, setPassword] = useState('')
  const [error, setError]       = useState('')
  const [loading, setLoading]   = useState(false)

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

      if (!res.ok) { setError(data.message || 'Login failed'); return }

      login(data.token, data.user)

      const isAdmin = data.user.role === 'admin' || data.user.industry === 'admin'
      if (isAdmin)                              navigate('/admin')
      else if (data.user.industry === 'restaurant') navigate('/dashboard/restaurant')
      else if (data.user.industry === 'insurance')  navigate('/dashboard/insurance')
      else setError('Unknown industry. Please contact your admin.')
    } catch {
      setError('Cannot connect to server. Please try again.')
    } finally {
      setLoading(false)
    }
  }

  return (
    <div style={{ minHeight: '100vh', background: '#0f0e17', display: 'flex', alignItems: 'center', justifyContent: 'center', padding: 16, position: 'relative', overflow: 'hidden' }}>

      {/* Background glow blobs */}
      <div style={{ position: 'absolute', top: '10%', left: '15%', width: 300, height: 300, borderRadius: '50%', background: 'radial-gradient(circle, rgba(99,102,241,0.15), transparent 70%)', pointerEvents: 'none' }} />
      <div style={{ position: 'absolute', bottom: '10%', right: '15%', width: 250, height: 250, borderRadius: '50%', background: 'radial-gradient(circle, rgba(168,85,247,0.12), transparent 70%)', pointerEvents: 'none' }} />

      <div style={{ position: 'relative', zIndex: 1, display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))', width: '100%', maxWidth: 900, border: '1px solid rgba(255,255,255,0.08)', borderRadius: 20, overflow: 'hidden' }}>

        {/* Left Panel */}
        <div style={{ background: 'linear-gradient(160deg, #0f0c29, #1a1040, #0d0d1a)', padding: '40px 36px', display: 'flex', flexDirection: 'column', justifyContent: 'space-between', gap: 32 }}>
          <div>
            <div style={{ display: 'flex', alignItems: 'center', gap: 8, marginBottom: 24 }}>
              <span style={{ fontSize: 22 }}>🤖</span>
              <span style={{ fontSize: 18, fontWeight: 700, color: '#fff', letterSpacing: '-0.5px' }}>AgentAI</span>
            </div>

            <span style={{ display: 'inline-block', background: 'rgba(255,255,255,0.07)', border: '1px solid rgba(255,255,255,0.15)', color: '#a5b4fc', fontSize: 11, fontWeight: 600, letterSpacing: '0.08em', padding: '6px 14px', borderRadius: 999, marginBottom: 20 }}>
              AI-POWERED VOICE &amp; MESSAGING AGENTS
            </span>

            <h2 style={{ fontSize: 'clamp(1.3rem, 2.5vw, 1.6rem)', fontWeight: 800, color: '#fff', marginBottom: 12, lineHeight: 1.3 }}>
              Automate customer conversations{' '}
              <span style={{ background: 'linear-gradient(to right, #818cf8, #a78bfa)', WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent' }}>
                across every industry
              </span>
            </h2>
            <p style={{ fontSize: 14, color: '#6b7280', lineHeight: 1.7, marginBottom: 8 }}>
              Deploy intelligent AI agents for inbound calls, WhatsApp, and bookings — without changing your existing phone number.
            </p>
          </div>

          <div>
            {[
              { icon: '📞', text: 'Voice agent on your existing SIP number' },
              { icon: '💬', text: '24/7 WhatsApp automation' },
              { icon: '📊', text: 'Live dashboard for bookings & calls' },
              { icon: '🔒', text: 'JWT secured, role-based access' },
            ].map((f) => (
              <div key={f.text} style={{ display: 'flex', alignItems: 'center', gap: 12, padding: '11px 0', borderTop: '1px solid rgba(255,255,255,0.07)' }}>
                <span style={{ fontSize: 15 }}>{f.icon}</span>
                <span style={{ fontSize: 13, color: '#9ca3af' }}>{f.text}</span>
              </div>
            ))}
          </div>

          <p style={{ fontSize: 11, color: '#374151' }}>© 2026 AgentAI. All rights reserved.</p>
        </div>

        {/* Right Panel */}
        <div style={{ background: '#0a0a14', padding: '40px 36px', display: 'flex', flexDirection: 'column', justifyContent: 'center' }}>
          <h1 style={{ fontSize: 'clamp(1.3rem, 2.5vw, 1.6rem)', fontWeight: 800, color: '#fff', marginBottom: 8 }}>Welcome back</h1>
          <p style={{ fontSize: 14, color: '#6b7280', marginBottom: 28, lineHeight: 1.6 }}>
            Login with your credentials. You'll be redirected to your dashboard automatically based on your role.
          </p>

          <form onSubmit={handleLogin}>
            <div style={{ marginBottom: 16 }}>
              <label style={{ display: 'block', fontSize: 11, fontWeight: 600, color: '#6b7280', marginBottom: 6, textTransform: 'uppercase', letterSpacing: '0.06em' }}>
                Email address
              </label>
              <div style={{ position: 'relative' }}>
                <input
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="you@company.com"
                  required
                  className={inputCls}
                />
                <span style={{ position: 'absolute', right: 12, top: '50%', transform: 'translateY(-50%)', fontSize: 14, opacity: 0.4 }}>✉️</span>
              </div>
            </div>

            <div style={{ marginBottom: 8 }}>
              <label style={{ display: 'block', fontSize: 11, fontWeight: 600, color: '#6b7280', marginBottom: 6, textTransform: 'uppercase', letterSpacing: '0.06em' }}>
                Password
              </label>
              <div style={{ position: 'relative' }}>
                <input
                  type={showPassword ? 'text' : 'password'}
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="••••••••"
                  required
                  className={inputCls}
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  style={{ position: 'absolute', right: 12, top: '50%', transform: 'translateY(-50%)', background: 'none', border: 'none', cursor: 'pointer', fontSize: 14, opacity: 0.5 }}
                >
                  {showPassword ? '🙈' : '👁️'}
                </button>
              </div>
            </div>

            <div style={{ textAlign: 'right', marginBottom: 24 }}>
              <a href="#" style={{ fontSize: 12, color: '#4b5563', textDecoration: 'none' }}
                onMouseEnter={e => e.currentTarget.style.color = '#a5b4fc'}
                onMouseLeave={e => e.currentTarget.style.color = '#4b5563'}>
                Forgot password?
              </a>
            </div>

            {error && (
              <p style={{ fontSize: 12, color: '#f87171', background: 'rgba(239,68,68,0.1)', border: '1px solid rgba(239,68,68,0.2)', borderRadius: 10, padding: '8px 14px', marginBottom: 12, textAlign: 'center' }}>
                {error}
              </p>
            )}

            <button
              type="submit"
              disabled={loading}
              style={{
                width: '100%', height: 44, borderRadius: 10, border: 'none', cursor: loading ? 'not-allowed' : 'pointer',
                background: loading ? 'rgba(99,102,241,0.4)' : 'linear-gradient(to right, #4f46e5, #7c3aed)',
                color: '#fff', fontSize: 15, fontWeight: 700,
                boxShadow: loading ? 'none' : '0 4px 20px rgba(99,102,241,0.4)',
                transition: 'opacity 0.2s',
              }}
            >
              {loading ? 'Logging in…' : 'Login →'}
            </button>
          </form>

          <div style={{ display: 'flex', alignItems: 'center', gap: 12, margin: '24px 0' }}>
            <div style={{ flex: 1, height: 1, background: 'rgba(255,255,255,0.07)' }} />
            <span style={{ fontSize: 11, color: '#374151' }}>Role-based access</span>
            <div style={{ flex: 1, height: 1, background: 'rgba(255,255,255,0.07)' }} />
          </div>

          <div style={{ display: 'flex', alignItems: 'flex-start', gap: 10, background: 'rgba(99,102,241,0.08)', border: '1px solid rgba(99,102,241,0.2)', borderRadius: 12, padding: '12px 14px' }}>
            <span style={{ fontSize: 14, marginTop: 1 }}>ℹ️</span>
            <p style={{ fontSize: 12, color: '#818cf8', lineHeight: 1.6, margin: 0 }}>
              Restaurant and insurance accounts go straight to their dashboard. Admin accounts can view any dashboard.
            </p>
          </div>
        </div>

      </div>
    </div>
  )
}

export default LoginPage
