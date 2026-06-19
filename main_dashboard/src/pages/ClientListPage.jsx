import { useState, useEffect } from 'react'
import { useParams, useNavigate } from 'react-router-dom'
import { useAuth } from '../context/AuthContext'
import { dashboardUrls } from '../App'

const AUTH_SERVICE = 'https://agentai-auth-service.agarwalsomya224.workers.dev'

const INDUSTRY_META = {
  restaurant: { icon: '🍽️', label: 'Restaurant' },
  insurance:  { icon: '🛡️', label: 'Insurance'  },
}

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
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({
          email:     form.email.trim(),
          password:  form.password,
          industry,
          entity_id: form.entity_id || null,
        }),
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
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 backdrop-blur-sm p-4">
      <div className="bg-white rounded-2xl shadow-xl w-full max-w-md p-6">
        <div className="flex items-center justify-between mb-5">
          <h2 className="text-lg font-bold text-gray-900">Add New User</h2>
          <button onClick={onClose} className="text-gray-400 hover:text-gray-600 text-xl leading-none">✕</button>
        </div>

        <form onSubmit={handleSubmit} className="flex flex-col gap-4">
          <div>
            <label className="block text-xs font-medium text-gray-500 mb-1">Email</label>
            <input
              type="email"
              required
              value={form.email}
              onChange={set('email')}
              placeholder="client@example.com"
              className="w-full border border-gray-200 rounded-xl px-4 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
          </div>

          <div>
            <label className="block text-xs font-medium text-gray-500 mb-1">Password</label>
            <input
              type="text"
              required
              value={form.password}
              onChange={set('password')}
              placeholder="Set a password for this user"
              className="w-full border border-gray-200 rounded-xl px-4 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
          </div>

          <div>
            <label className="block text-xs font-medium text-gray-500 mb-1">Assign to Client (optional)</label>
            <select
              value={form.entity_id}
              onChange={set('entity_id')}
              className="w-full border border-gray-200 rounded-xl px-4 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 bg-white"
            >
              <option value="">— No client assigned —</option>
              {clients.map((c) => (
                <option key={c.id} value={c.id}>{c.name}</option>
              ))}
            </select>
          </div>

          {error && (
            <p className="text-xs text-red-500 bg-red-50 rounded-xl px-4 py-2">{error}</p>
          )}

          <button
            type="submit"
            disabled={loading}
            className="w-full bg-blue-600 hover:bg-blue-700 disabled:opacity-60 text-white font-semibold rounded-xl py-2.5 text-sm transition-colors"
          >
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

  const copy = () => {
    navigator.clipboard.writeText(text)
    setCopied(true)
    setTimeout(() => setCopied(false), 2000)
  }

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 backdrop-blur-sm p-4">
      <div className="bg-white rounded-2xl shadow-xl w-full max-w-md p-6">
        <div className="flex items-center gap-2 mb-4">
          <span className="text-2xl">✅</span>
          <h2 className="text-lg font-bold text-gray-900">User Created!</h2>
        </div>

        <p className="text-sm text-gray-500 mb-4">Share these credentials with the client:</p>

        <div className="bg-gray-50 border border-gray-100 rounded-xl p-4 font-mono text-sm space-y-2">
          <div className="flex justify-between">
            <span className="text-gray-400">Email</span>
            <span className="text-gray-900 font-semibold">{user.email}</span>
          </div>
          <div className="flex justify-between">
            <span className="text-gray-400">Password</span>
            <span className="text-gray-900 font-semibold">{user.password}</span>
          </div>
          <div className="flex justify-between">
            <span className="text-gray-400">Industry</span>
            <span className="text-gray-900 font-semibold">{user.industry}</span>
          </div>
          {user.entity_id && (
            <div className="flex justify-between">
              <span className="text-gray-400">Client ID</span>
              <span className="text-gray-900 font-semibold">{user.entity_id}</span>
            </div>
          )}
        </div>

        <div className="flex gap-3 mt-5">
          <button
            onClick={copy}
            className="flex-1 border border-blue-200 text-blue-600 hover:bg-blue-50 font-semibold rounded-xl py-2.5 text-sm transition-colors"
          >
            {copied ? 'Copied!' : 'Copy Credentials'}
          </button>
          <button
            onClick={onClose}
            className="flex-1 bg-blue-600 hover:bg-blue-700 text-white font-semibold rounded-xl py-2.5 text-sm transition-colors"
          >
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

    fetch(`${AUTH_SERVICE}/api/clients/${industry}`, {
      headers: { Authorization: `Bearer ${token}` },
    })
      .then((r) => {
        if (!r.ok) throw new Error(`Server error: ${r.status}`)
        return r.json()
      })
      .then((data) => { setClients(data.clients || []); setLoading(false) })
      .catch((err) => { setError(err.message); setLoading(false) })
  }, [industry, token])

  const handleSelect = (client) => {
    const baseUrl = dashboardUrls[industry]
    if (baseUrl && token) {
      window.location.href = `${baseUrl}?token=${encodeURIComponent(token)}&client_id=${client.id}`
    }
  }

  return (
    <div className="min-h-screen bg-gray-50 p-4 sm:p-8">
      <div className="max-w-2xl mx-auto">

        {/* Header */}
        <div className="mb-8">
          <button
            onClick={() => navigate('/login')}
            className="text-sm text-gray-400 hover:text-gray-600 mb-4 inline-flex items-center gap-1 transition-colors"
          >
            ← Back
          </button>
          <div className="flex items-center justify-between mb-1">
            <div className="flex items-center gap-3">
              <span className="text-2xl">{meta.icon}</span>
              <h1 className="text-2xl font-bold text-gray-900">{meta.label} Clients</h1>
            </div>
            <button
              onClick={() => setShowAddUser(true)}
              className="flex items-center gap-2 bg-blue-600 hover:bg-blue-700 text-white text-sm font-semibold px-4 py-2 rounded-xl transition-colors"
            >
              + Add User
            </button>
          </div>
          <p className="text-sm text-gray-500">Select a client to open their dashboard</p>
        </div>

        {/* Loading skeletons */}
        {loading && (
          <div className="flex flex-col gap-3">
            {[1, 2, 3].map((i) => (
              <div key={i} className="h-20 bg-white border border-gray-100 rounded-2xl animate-pulse" />
            ))}
          </div>
        )}

        {/* Error */}
        {error && (
          <div className="p-4 bg-red-50 border border-red-100 rounded-2xl text-sm text-red-600">
            Failed to load clients: {error}
          </div>
        )}

        {/* Client cards */}
        {!loading && !error && (
          <div className="flex flex-col gap-3">
            {clients.length === 0 ? (
              <p className="text-center text-sm text-gray-400 py-8">No clients found for this industry.</p>
            ) : (
              clients.map((client) => (
                <button
                  key={client.id}
                  onClick={() => handleSelect(client)}
                  className="flex items-center gap-4 p-5 bg-white border border-gray-100 hover:border-blue-400 rounded-2xl text-left shadow-sm hover:shadow-md transition-all duration-200 group"
                >
                  <div className="w-10 h-10 rounded-xl bg-blue-50 flex items-center justify-center text-lg font-bold text-blue-600 flex-shrink-0">
                    {client.name[0]}
                  </div>
                  <div className="flex-1 min-w-0">
                    <p className="font-semibold text-gray-900 group-hover:text-blue-700">{client.name}</p>
                    <p className="text-xs text-gray-400">{client.type} · {client.location}</p>
                  </div>
                  <span className="text-gray-300 group-hover:text-blue-500 text-xl flex-shrink-0">→</span>
                </button>
              ))
            )}
          </div>
        )}

        <p className="text-center text-xs text-gray-300 mt-8">
          Logged in as admin · <span className="text-gray-400">{user?.email}</span>
        </p>
      </div>

      {/* Modals */}
      {showAddUser && (
        <AddUserModal
          industry={industry}
          clients={clients}
          token={token}
          onClose={() => setShowAddUser(false)}
          onSuccess={(u) => { setShowAddUser(false); setNewUser(u) }}
        />
      )}

      {newUser && (
        <CredentialsModal
          user={newUser}
          onClose={() => setNewUser(null)}
        />
      )}
    </div>
  )
}

export default ClientListPage
