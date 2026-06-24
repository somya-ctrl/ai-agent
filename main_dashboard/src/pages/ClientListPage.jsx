import { useState, useEffect } from 'react'
import { useParams, useNavigate } from 'react-router-dom'
import { useAuth } from '../context/AuthContext'
import { dashboardUrls } from '../App'

const AUTH_SERVICE = 'https://agentai-auth-service.agarwalsomya224.workers.dev'

const INDUSTRY_META = {
  restaurant: { icon: '🍽️', label: 'Restaurant' },
  insurance:  { icon: '🛡️', label: 'Insurance'  },
}

const inputCls = `
  w-full border rounded-xl px-4 py-2.5 text-sm transition-colors
  bg-white/5 border-white/10 text-white placeholder-white/25
  focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500
`

// ── Add User Modal ──────────────────────────────────────────────
function AddUserModal({ industry, clients, token, onClose, onSuccess }) {
  const [form, setForm]       = useState({ email: '', password: '', entity_id: '' })
  const [loading, setLoading] = useState(false)
  const [error, setError]     = useState(null)

  const set = (k) => (e) => setForm((f) => ({ ...f, [k]: e.target.value }))

  const handleSubmit = async (e) => {
    e.preventDefault()
    setLoading(true)
    setError(null)
    try {
      const res = await fetch(`${AUTH_SERVICE}/api/users`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json', Authorization: `Bearer ${token}` },
        body: JSON.stringify({ email: form.email.trim(), password: form.password, industry, entity_id: form.entity_id || null }),
      })
      const data = await res.json()
      if (!res.ok) throw new Error(data.message || 'Failed to create user')
      onSuccess({ ...data.user, password: form.password })
    } catch (err) {
      setError(err.message)
    } finally {
      setLoading(false)
    }
  }

  return (
    <div style={{ position: 'fixed', inset: 0, zIndex: 50, display: 'flex', alignItems: 'center', justifyContent: 'center', background: 'rgba(0,0,0,0.7)', backdropFilter: 'blur(6px)', padding: 16 }}>
      <div style={{ background: '#0a0a14', border: '1px solid rgba(255,255,255,0.1)', borderRadius: 20, boxShadow: '0 24px 64px rgba(0,0,0,0.6)', width: '100%', maxWidth: 420, padding: 24 }}>
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 20 }}>
          <h2 style={{ fontSize: 17, fontWeight: 700, color: '#fff' }}>Add New User</h2>
          <button onClick={onClose} style={{ background: 'none', border: 'none', color: '#6b7280', cursor: 'pointer', fontSize: 20, lineHeight: 1 }}>✕</button>
        </div>

        <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: 14 }}>
          <div>
            <label style={{ display: 'block', fontSize: 11, fontWeight: 600, color: '#6b7280', marginBottom: 5, textTransform: 'uppercase', letterSpacing: '0.06em' }}>Email</label>
            <input type="email" required value={form.email} onChange={set('email')} placeholder="client@example.com" className={inputCls} />
          </div>
          <div>
            <label style={{ display: 'block', fontSize: 11, fontWeight: 600, color: '#6b7280', marginBottom: 5, textTransform: 'uppercase', letterSpacing: '0.06em' }}>Password</label>
            <input type="text" required value={form.password} onChange={set('password')} placeholder="Set a password for this user" className={inputCls} />
          </div>
          <div>
            <label style={{ display: 'block', fontSize: 11, fontWeight: 600, color: '#6b7280', marginBottom: 5, textTransform: 'uppercase', letterSpacing: '0.06em' }}>Assign to Client (optional)</label>
            <select value={form.entity_id} onChange={set('entity_id')} className={inputCls} style={{ background: '#0a0a14' }}>
              <option value="">— No client assigned —</option>
              {clients.map((c) => <option key={c.id} value={c.id}>{c.name}</option>)}
            </select>
          </div>

          {error && <p style={{ fontSize: 12, color: '#f87171', background: 'rgba(239,68,68,0.1)', border: '1px solid rgba(239,68,68,0.2)', borderRadius: 10, padding: '8px 14px' }}>{error}</p>}

          <button type="submit" disabled={loading}
            style={{ width: '100%', padding: '10px 0', borderRadius: 12, border: 'none', cursor: loading ? 'not-allowed' : 'pointer', background: loading ? 'rgba(99,102,241,0.4)' : 'linear-gradient(to right, #4f46e5, #7c3aed)', color: '#fff', fontSize: 14, fontWeight: 700, boxShadow: '0 4px 16px rgba(99,102,241,0.3)' }}>
            {loading ? 'Creating…' : 'Create User'}
          </button>
        </form>
      </div>
    </div>
  )
}

// ── Credentials Modal ───────────────────────────────────────────
function CredentialsModal({ user, onClose }) {
  const [copied, setCopied] = useState(false)
  const text = `Login Credentials\nEmail: ${user.email}\nPassword: ${user.password}\nIndustry: ${user.industry}`
  const copy = () => { navigator.clipboard.writeText(text); setCopied(true); setTimeout(() => setCopied(false), 2000) }

  return (
    <div style={{ position: 'fixed', inset: 0, zIndex: 50, display: 'flex', alignItems: 'center', justifyContent: 'center', background: 'rgba(0,0,0,0.7)', backdropFilter: 'blur(6px)', padding: 16 }}>
      <div style={{ background: '#0a0a14', border: '1px solid rgba(255,255,255,0.1)', borderRadius: 20, boxShadow: '0 24px 64px rgba(0,0,0,0.6)', width: '100%', maxWidth: 420, padding: 24 }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: 10, marginBottom: 14 }}>
          <span style={{ fontSize: 24 }}>✅</span>
          <h2 style={{ fontSize: 17, fontWeight: 700, color: '#fff' }}>User Created!</h2>
        </div>
        <p style={{ fontSize: 13, color: '#6b7280', marginBottom: 16 }}>Share these credentials with the client:</p>

        <div style={{ background: 'rgba(255,255,255,0.03)', border: '1px solid rgba(255,255,255,0.08)', borderRadius: 12, padding: '16px 20px', fontFamily: 'monospace', fontSize: 13, display: 'flex', flexDirection: 'column', gap: 10, marginBottom: 20 }}>
          {[['Email', user.email], ['Password', user.password], ['Industry', user.industry], ...(user.entity_id ? [['Client ID', user.entity_id]] : [])].map(([label, val]) => (
            <div key={label} style={{ display: 'flex', justifyContent: 'space-between', gap: 16 }}>
              <span style={{ color: '#4b5563' }}>{label}</span>
              <span style={{ color: '#e2e8f0', fontWeight: 600 }}>{val}</span>
            </div>
          ))}
        </div>

        <div style={{ display: 'flex', gap: 12 }}>
          <button onClick={copy}
            style={{ flex: 1, padding: '10px 0', borderRadius: 12, border: '1px solid rgba(99,102,241,0.4)', background: 'transparent', color: '#818cf8', fontSize: 13, fontWeight: 600, cursor: 'pointer' }}>
            {copied ? '✓ Copied!' : 'Copy Credentials'}
          </button>
          <button onClick={onClose}
            style={{ flex: 1, padding: '10px 0', borderRadius: 12, border: 'none', background: 'linear-gradient(to right, #4f46e5, #7c3aed)', color: '#fff', fontSize: 13, fontWeight: 600, cursor: 'pointer' }}>
            Done
          </button>
        </div>
      </div>
    </div>
  )
}

// ── Main Page ───────────────────────────────────────────────────
function ClientListPage() {
  const { industry } = useParams()
  const { token, user } = useAuth()
  const navigate = useNavigate()

  const [clients, setClients]         = useState([])
  const [loading, setLoading]         = useState(true)
  const [error, setError]             = useState(null)
  const [showAddUser, setShowAddUser] = useState(false)
  const [newUser, setNewUser]         = useState(null)

  const meta = INDUSTRY_META[industry] || { icon: '🏢', label: industry }

  useEffect(() => {
    setLoading(true)
    setError(null)
    fetch(`${AUTH_SERVICE}/api/clients/${industry}`, { headers: { Authorization: `Bearer ${token}` } })
      .then((r) => { if (!r.ok) throw new Error(`Server error: ${r.status}`); return r.json() })
      .then((data) => { setClients(data.clients || []); setLoading(false) })
      .catch((err) => { setError(err.message); setLoading(false) })
  }, [industry, token])

  const handleSelect = (client) => {
    const baseUrl = dashboardUrls[industry]
    if (baseUrl && token)
      window.location.href = `${baseUrl}?token=${encodeURIComponent(token)}&client_id=${client.id}`
  }

  return (
    <div style={{ minHeight: '100vh', background: '#0f0e17', padding: '32px 16px', position: 'relative', overflow: 'hidden' }}>

      {/* bg glow */}
      <div style={{ position: 'absolute', top: 0, left: '30%', width: 400, height: 300, background: 'radial-gradient(ellipse, rgba(99,102,241,0.1), transparent 70%)', pointerEvents: 'none' }} />

      <div style={{ position: 'relative', zIndex: 1, maxWidth: 600, margin: '0 auto' }}>

        {/* Header */}
        <div style={{ marginBottom: 32 }}>
          <button
            onClick={() => navigate('/login')}
            style={{ background: 'none', border: 'none', color: '#4b5563', cursor: 'pointer', fontSize: 13, marginBottom: 16, display: 'inline-flex', alignItems: 'center', gap: 4, padding: 0 }}
            onMouseEnter={e => e.currentTarget.style.color = '#a5b4fc'}
            onMouseLeave={e => e.currentTarget.style.color = '#4b5563'}
          >
            ← Back
          </button>

          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 6 }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
              <span style={{ fontSize: 28 }}>{meta.icon}</span>
              <h1 style={{ fontSize: 'clamp(1.3rem, 3vw, 1.6rem)', fontWeight: 800, color: '#fff' }}>{meta.label} Clients</h1>
            </div>
            <button
              onClick={() => setShowAddUser(true)}
              style={{ display: 'flex', alignItems: 'center', gap: 6, padding: '8px 18px', borderRadius: 10, border: 'none', background: 'linear-gradient(to right, #4f46e5, #7c3aed)', color: '#fff', fontSize: 13, fontWeight: 700, cursor: 'pointer', boxShadow: '0 4px 14px rgba(99,102,241,0.35)' }}
            >
              + Add User
            </button>
          </div>
          <p style={{ fontSize: 13, color: '#4b5563' }}>Select a client to open their dashboard</p>
        </div>

        {/* Skeletons */}
        {loading && (
          <div style={{ display: 'flex', flexDirection: 'column', gap: 12 }}>
            {[1, 2, 3].map((i) => (
              <div key={i} style={{ height: 76, background: 'rgba(255,255,255,0.04)', border: '1px solid rgba(255,255,255,0.06)', borderRadius: 16, animation: 'pulse 1.5s infinite' }} />
            ))}
          </div>
        )}

        {/* Error */}
        {error && (
          <div style={{ padding: 16, background: 'rgba(239,68,68,0.08)', border: '1px solid rgba(239,68,68,0.2)', borderRadius: 14, fontSize: 13, color: '#f87171' }}>
            Failed to load clients: {error}
          </div>
        )}

        {/* Client cards */}
        {!loading && !error && (
          <div style={{ display: 'flex', flexDirection: 'column', gap: 10 }}>
            {clients.length === 0 ? (
              <p style={{ textAlign: 'center', fontSize: 13, color: '#374151', padding: '40px 0' }}>No clients found for this industry.</p>
            ) : (
              clients.map((client) => (
                <button
                  key={client.id}
                  onClick={() => handleSelect(client)}
                  style={{
                    display: 'flex', alignItems: 'center', gap: 16, padding: '16px 20px',
                    background: 'rgba(255,255,255,0.04)', border: '1px solid rgba(255,255,255,0.08)',
                    borderRadius: 16, textAlign: 'left', cursor: 'pointer', width: '100%', transition: 'all 0.18s',
                  }}
                  onMouseEnter={e => { e.currentTarget.style.background = 'rgba(99,102,241,0.08)'; e.currentTarget.style.borderColor = 'rgba(99,102,241,0.35)'; e.currentTarget.style.transform = 'translateY(-1px)' }}
                  onMouseLeave={e => { e.currentTarget.style.background = 'rgba(255,255,255,0.04)'; e.currentTarget.style.borderColor = 'rgba(255,255,255,0.08)'; e.currentTarget.style.transform = 'translateY(0)' }}
                >
                  <div style={{ width: 42, height: 42, borderRadius: 12, background: 'rgba(99,102,241,0.15)', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 17, fontWeight: 800, color: '#818cf8', flexShrink: 0 }}>
                    {client.name[0]}
                  </div>
                  <div style={{ flex: 1, minWidth: 0 }}>
                    <p style={{ fontWeight: 600, color: '#f1f5f9', fontSize: 14, marginBottom: 2 }}>{client.name}</p>
                    <p style={{ fontSize: 12, color: '#4b5563' }}>{client.type} · {client.location}</p>
                  </div>
                  <span style={{ color: '#374151', fontSize: 18, flexShrink: 0 }}>→</span>
                </button>
              ))
            )}
          </div>
        )}

        <p style={{ textAlign: 'center', fontSize: 11, color: '#1f2937', marginTop: 32 }}>
          Logged in as admin · <span style={{ color: '#374151' }}>{user?.email}</span>
        </p>
      </div>

      {showAddUser && (
        <AddUserModal industry={industry} clients={clients} token={token}
          onClose={() => setShowAddUser(false)}
          onSuccess={(u) => { setShowAddUser(false); setNewUser(u) }}
        />
      )}

      {newUser && <CredentialsModal user={newUser} onClose={() => setNewUser(null)} />}
    </div>
  )
}

export default ClientListPage
