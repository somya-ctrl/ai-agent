import { useState, useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import { useAuth } from '../context/AuthContext'
import { dashboardUrls } from '../App'

const AUTH_SERVICE = 'https://agentai-auth-service.agarwalsomya224.workers.dev'

const INDUSTRY_ICONS  = { restaurant: '🍽️', insurance: '🛡️' }
const INDUSTRY_LABELS = { restaurant: 'Restaurant', insurance: 'Insurance' }

const STATUS_PILL = {
  paid:    'bg-emerald-100 text-emerald-700',
  pending: 'bg-amber-100  text-amber-700',
  overdue: 'bg-red-100    text-red-700',
}

// ── Add Client Modal ──────────────────────────────────────────────
function AddClientModal({ token, onClose, onSuccess }) {
  const [form, setForm] = useState({
    name: '', industry: 'restaurant', type: '', location: '',
    monthly_rate: '', payment_status: 'pending',
  })
  const [loading, setLoading] = useState(false)
  const [error, setError]     = useState(null)

  const set = (k) => (e) => setForm((f) => ({ ...f, [k]: e.target.value }))

  const handleSubmit = async (e) => {
    e.preventDefault()
    setLoading(true)
    setError(null)
    try {
      const res = await fetch(`${AUTH_SERVICE}/api/clients`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json', Authorization: `Bearer ${token}` },
        body: JSON.stringify({ ...form, monthly_rate: Number(form.monthly_rate) || 0 }),
      })
      const data = await res.json()
      if (!res.ok) throw new Error(data.message || 'Failed to create client')
      onSuccess(data.client)
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
          <h2 className="text-lg font-bold text-gray-900">Add New Client</h2>
          <button onClick={onClose} className="text-gray-400 hover:text-gray-600 text-xl leading-none">✕</button>
        </div>

        <form onSubmit={handleSubmit} className="flex flex-col gap-4">
          <div>
            <label className="block text-xs font-medium text-gray-500 mb-1">Client Name *</label>
            <input
              type="text" required value={form.name} onChange={set('name')}
              placeholder="e.g. The Grand Hotel"
              className="w-full border border-gray-200 rounded-xl px-4 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
          </div>

          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="block text-xs font-medium text-gray-500 mb-1">Industry *</label>
              <select value={form.industry} onChange={set('industry')}
                className="w-full border border-gray-200 rounded-xl px-4 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 bg-white">
                <option value="restaurant">🍽️ Restaurant</option>
                <option value="insurance">🛡️ Insurance</option>
              </select>
            </div>
            <div>
              <label className="block text-xs font-medium text-gray-500 mb-1">Type</label>
              <input
                type="text" value={form.type} onChange={set('type')}
                placeholder="e.g. Fine Dining"
                className="w-full border border-gray-200 rounded-xl px-4 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
            </div>
          </div>

          <div>
            <label className="block text-xs font-medium text-gray-500 mb-1">Location</label>
            <input
              type="text" value={form.location} onChange={set('location')}
              placeholder="e.g. Mumbai, India"
              className="w-full border border-gray-200 rounded-xl px-4 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
          </div>

          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="block text-xs font-medium text-gray-500 mb-1">Monthly Rate (₹)</label>
              <input
                type="number" min="0" value={form.monthly_rate} onChange={set('monthly_rate')}
                placeholder="0"
                className="w-full border border-gray-200 rounded-xl px-4 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
            </div>
            <div>
              <label className="block text-xs font-medium text-gray-500 mb-1">Payment Status</label>
              <select value={form.payment_status} onChange={set('payment_status')}
                className="w-full border border-gray-200 rounded-xl px-4 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 bg-white">
                <option value="pending">Pending</option>
                <option value="paid">Paid</option>
                <option value="overdue">Overdue</option>
              </select>
            </div>
          </div>

          {error && (
            <p className="text-xs text-red-500 bg-red-50 rounded-xl px-4 py-2">{error}</p>
          )}

          <button
            type="submit" disabled={loading}
            className="w-full bg-blue-600 hover:bg-blue-700 disabled:opacity-60 text-white font-semibold rounded-xl py-2.5 text-sm transition-colors"
          >
            {loading ? 'Creating…' : 'Create Client'}
          </button>
        </form>
      </div>
    </div>
  )
}

// ── Add User Modal ────────────────────────────────────────────────
function AddUserModal({ clients, preselectedClientId, token, onClose, onSuccess }) {
  const [form, setForm] = useState({
    email: '', password: '', entity_id: preselectedClientId || '',
  })
  const [loading, setLoading] = useState(false)
  const [error, setError]     = useState(null)

  const set = (k) => (e) => setForm((f) => ({ ...f, [k]: e.target.value }))

  const handleSubmit = async (e) => {
    e.preventDefault()
    setLoading(true)
    setError(null)
    const assignedClient = clients.find((cl) => cl.id === form.entity_id)
    try {
      const res = await fetch(`${AUTH_SERVICE}/api/users`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json', Authorization: `Bearer ${token}` },
        body: JSON.stringify({
          email:     form.email.trim(),
          password:  form.password,
          industry:  assignedClient?.industry || 'restaurant',
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
          <h2 className="text-lg font-bold text-gray-900">Add User Credentials</h2>
          <button onClick={onClose} className="text-gray-400 hover:text-gray-600 text-xl leading-none">✕</button>
        </div>

        <form onSubmit={handleSubmit} className="flex flex-col gap-4">
          <div>
            <label className="block text-xs font-medium text-gray-500 mb-1">Email</label>
            <input
              type="email" required value={form.email} onChange={set('email')}
              placeholder="client@example.com"
              className="w-full border border-gray-200 rounded-xl px-4 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
          </div>

          <div>
            <label className="block text-xs font-medium text-gray-500 mb-1">Password</label>
            <input
              type="text" required value={form.password} onChange={set('password')}
              placeholder="Set a password for this user"
              className="w-full border border-gray-200 rounded-xl px-4 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
          </div>

          <div>
            <label className="block text-xs font-medium text-gray-500 mb-1">Assign to Client (optional)</label>
            <select
              value={form.entity_id} onChange={set('entity_id')}
              className="w-full border border-gray-200 rounded-xl px-4 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 bg-white"
            >
              <option value="">— No client assigned —</option>
              {clients.map((cl) => (
                <option key={cl.id} value={cl.id}>
                  {cl.name} ({INDUSTRY_LABELS[cl.industry] || cl.industry})
                </option>
              ))}
            </select>
          </div>

          {error && (
            <p className="text-xs text-red-500 bg-red-50 rounded-xl px-4 py-2">{error}</p>
          )}

          <button
            type="submit" disabled={loading}
            className="w-full bg-blue-600 hover:bg-blue-700 disabled:opacity-60 text-white font-semibold rounded-xl py-2.5 text-sm transition-colors"
          >
            {loading ? 'Creating…' : 'Create User'}
          </button>
        </form>
      </div>
    </div>
  )
}

// ── Credentials Modal ─────────────────────────────────────────────
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
          <div className="flex justify-between gap-4">
            <span className="text-gray-400 flex-shrink-0">Email</span>
            <span className="text-gray-900 font-semibold truncate">{user.email}</span>
          </div>
          <div className="flex justify-between gap-4">
            <span className="text-gray-400 flex-shrink-0">Password</span>
            <span className="text-gray-900 font-semibold">{user.password}</span>
          </div>
          <div className="flex justify-between gap-4">
            <span className="text-gray-400 flex-shrink-0">Industry</span>
            <span className="text-gray-900 font-semibold capitalize">{user.industry}</span>
          </div>
          {user.entity_id && (
            <div className="flex justify-between gap-4">
              <span className="text-gray-400 flex-shrink-0">Client ID</span>
              <span className="text-gray-900 font-semibold text-xs">{user.entity_id}</span>
            </div>
          )}
        </div>

        <div className="flex gap-3 mt-5">
          <button
            onClick={copy}
            className="flex-1 border border-blue-200 text-blue-600 hover:bg-blue-50 font-semibold rounded-xl py-2.5 text-sm transition-colors"
          >
            {copied ? '✓ Copied!' : 'Copy Credentials'}
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

// ── Stat Card ─────────────────────────────────────────────────────
function StatCard({ label, value, sub, icon, color }) {
  return (
    <div className="bg-white rounded-2xl border border-gray-100 p-5 shadow-sm">
      <div className="flex items-center justify-between mb-3">
        <span className="text-sm font-medium text-gray-500">{label}</span>
        <span className="text-2xl">{icon}</span>
      </div>
      <p className={`text-3xl font-bold ${color}`}>{value}</p>
      <p className="text-xs text-gray-400 mt-1">{sub}</p>
    </div>
  )
}

// ── Main Page ─────────────────────────────────────────────────────
function AdminDashboard() {
  const navigate = useNavigate()
  const { token, user, logout } = useAuth()

  const [clients, setClients]               = useState([])
  const [stats, setStats]                   = useState({ total: 0, revenue: 0, pending: 0 })
  const [loading, setLoading]               = useState(true)
  const [error, setError]                   = useState(null)
  const [industryFilter, setIndustryFilter] = useState('all')
  const [search, setSearch]                 = useState('')

  const [showAddClient, setShowAddClient]         = useState(false)
  const [showAddUser, setShowAddUser]             = useState(false)
  const [addUserForClient, setAddUserForClient]   = useState(null)
  const [newUser, setNewUser]                     = useState(null)

  const loadClients = () => {
    setLoading(true)
    setError(null)
    fetch(`${AUTH_SERVICE}/api/admin/clients`, {
      headers: { Authorization: `Bearer ${token}` },
    })
      .then((r) => { if (!r.ok) throw new Error(`Server error: ${r.status}`); return r.json() })
      .then((data) => {
        setClients(data.clients || [])
        setStats(data.stats || { total: 0, revenue: 0, pending: 0 })
      })
      .catch((err) => setError(err.message))
      .finally(() => setLoading(false))
  }

  useEffect(() => { loadClients() }, [token])

  const filtered = clients.filter((cl) => {
    const matchIndustry = industryFilter === 'all' || cl.industry === industryFilter
    const q = search.toLowerCase()
    const matchSearch = !q
      || cl.name.toLowerCase().includes(q)
      || (cl.location || '').toLowerCase().includes(q)
      || (cl.type || '').toLowerCase().includes(q)
    return matchIndustry && matchSearch
  })

  const handleViewDashboard = (client) => {
    const baseUrl = dashboardUrls[client.industry]
    if (baseUrl && token) {
      window.location.href = `${baseUrl}?token=${encodeURIComponent(token)}&client_id=${client.id}`
    }
  }

  const handleLogout = () => { logout(); navigate('/login') }

  const fmtINR = (n) => `₹${Number(n || 0).toLocaleString('en-IN')}`

  return (
    <div className="min-h-screen bg-gray-50">

      {/* ── Top Nav ── */}
      <header className="bg-white border-b border-gray-100 sticky top-0 z-10">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 h-14 flex items-center justify-between">
          <div className="flex items-center gap-2.5">
            <span className="text-xl">🤖</span>
            <span className="font-bold text-gray-900 text-lg">AgentAI</span>
            <span className="ml-1 text-xs bg-blue-100 text-blue-700 px-2 py-0.5 rounded-full font-semibold">Admin</span>
          </div>

          <div className="flex items-center gap-3">
            <span className="text-sm text-gray-400 hidden sm:block">{user?.email}</span>
            <button
              onClick={handleLogout}
              className="text-sm text-gray-500 hover:text-red-600 border border-gray-200 hover:border-red-200 px-3 py-1.5 rounded-lg transition-colors"
            >
              Logout
            </button>
          </div>
        </div>
      </header>

      <main className="max-w-7xl mx-auto px-4 sm:px-6 py-6 sm:py-8">

        {/* ── Page Title ── */}
        <div className="mb-6">
          <h1 className="text-2xl font-bold text-gray-900">Admin Dashboard</h1>
          <p className="text-sm text-gray-500 mt-0.5">Overview of all clients, revenue and payment status</p>
        </div>

        {/* ── Stats Row ── */}
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 mb-8">
          <StatCard
            label="Total Clients"
            value={loading ? '—' : stats.total}
            sub="Active clients on platform"
            icon="🏢"
            color="text-gray-900"
          />
          <StatCard
            label="Monthly Revenue"
            value={loading ? '—' : fmtINR(stats.revenue)}
            sub="Confirmed payments this month"
            icon="💰"
            color="text-emerald-600"
          />
          <StatCard
            label="Pending Payments"
            value={loading ? '—' : fmtINR(stats.pending)}
            sub="Awaiting payment collection"
            icon="⏳"
            color="text-amber-500"
          />
        </div>

        {/* ── Client Table Card ── */}
        <div className="bg-white rounded-2xl border border-gray-100 shadow-sm overflow-hidden">

          {/* Card Header */}
          <div className="p-4 sm:p-5 border-b border-gray-50">
            <div className="flex flex-col sm:flex-row sm:items-center gap-3">
              <h2 className="text-base font-bold text-gray-900 flex-1">Client List</h2>

              <input
                type="text"
                placeholder="Search by name, location…"
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                className="border border-gray-200 rounded-xl px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 w-full sm:w-52"
              />

              <button
                onClick={() => { setAddUserForClient(null); setShowAddUser(true) }}
                className="flex items-center justify-center gap-1.5 border border-blue-200 text-blue-600 hover:bg-blue-50 text-sm font-semibold px-4 py-2 rounded-xl transition-colors whitespace-nowrap"
              >
                + Add User
              </button>

              <button
                onClick={() => setShowAddClient(true)}
                className="flex items-center justify-center gap-1.5 bg-blue-600 hover:bg-blue-700 text-white text-sm font-semibold px-4 py-2 rounded-xl transition-colors whitespace-nowrap"
              >
                + Add Client
              </button>
            </div>

            {/* Industry Tabs */}
            <div className="flex gap-1 mt-3 flex-wrap">
              {['all', 'restaurant', 'insurance'].map((ind) => (
                <button
                  key={ind}
                  onClick={() => setIndustryFilter(ind)}
                  className={`px-3.5 py-1.5 rounded-lg text-sm font-medium transition-colors ${
                    industryFilter === ind
                      ? 'bg-blue-600 text-white'
                      : 'text-gray-500 hover:bg-gray-100'
                  }`}
                >
                  {ind === 'all' ? '📋 All' : `${INDUSTRY_ICONS[ind]} ${INDUSTRY_LABELS[ind]}`}
                </button>
              ))}
              {industryFilter !== 'all' && (
                <button
                  onClick={() => navigate(`/clients/${industryFilter}`)}
                  className="ml-auto text-xs text-blue-500 hover:underline flex items-center gap-1"
                >
                  Open {INDUSTRY_LABELS[industryFilter]} list →
                </button>
              )}
            </div>
          </div>

          {/* Body */}
          {loading ? (
            <div className="p-6 flex flex-col gap-3">
              {[1, 2, 3, 4].map((i) => (
                <div key={i} className="h-12 bg-gray-50 rounded-xl animate-pulse" />
              ))}
            </div>
          ) : error ? (
            <div className="m-4 p-4 bg-red-50 border border-red-100 rounded-xl text-sm text-red-600">
              Failed to load clients: {error}
            </div>
          ) : filtered.length === 0 ? (
            <div className="py-12 text-center text-sm text-gray-400">
              {search || industryFilter !== 'all' ? 'No clients match your filter.' : 'No clients found. Add one to get started.'}
            </div>
          ) : (
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead>
                  <tr className="border-b border-gray-50 bg-gray-50/50">
                    <th className="px-5 py-3 text-left text-xs font-semibold text-gray-400 uppercase tracking-wide">Client</th>
                    <th className="px-5 py-3 text-left text-xs font-semibold text-gray-400 uppercase tracking-wide">Industry</th>
                    <th className="px-5 py-3 text-left text-xs font-semibold text-gray-400 uppercase tracking-wide hidden md:table-cell">Type</th>
                    <th className="px-5 py-3 text-left text-xs font-semibold text-gray-400 uppercase tracking-wide hidden lg:table-cell">Location</th>
                    <th className="px-5 py-3 text-right text-xs font-semibold text-gray-400 uppercase tracking-wide">Monthly Rate</th>
                    <th className="px-5 py-3 text-left text-xs font-semibold text-gray-400 uppercase tracking-wide">Payment</th>
                    <th className="px-5 py-3 text-right text-xs font-semibold text-gray-400 uppercase tracking-wide">Actions</th>
                  </tr>
                </thead>
                <tbody>
                  {filtered.map((client) => (
                    <tr
                      key={client.id}
                      className="border-b border-gray-50 last:border-0 hover:bg-gray-50/60 transition-colors"
                    >
                      {/* Name */}
                      <td className="px-5 py-4">
                        <div className="flex items-center gap-3">
                          <div className="w-8 h-8 rounded-lg bg-blue-50 flex items-center justify-center text-sm font-bold text-blue-600 flex-shrink-0">
                            {client.name[0].toUpperCase()}
                          </div>
                          <span className="font-medium text-gray-900 text-sm">{client.name}</span>
                        </div>
                      </td>

                      {/* Industry */}
                      <td className="px-5 py-4">
                        <span className="text-sm text-gray-600 flex items-center gap-1.5">
                          {INDUSTRY_ICONS[client.industry]}
                          <span className="hidden sm:inline">{INDUSTRY_LABELS[client.industry] || client.industry}</span>
                        </span>
                      </td>

                      {/* Type */}
                      <td className="px-5 py-4 text-sm text-gray-500 hidden md:table-cell">
                        {client.type || <span className="text-gray-300">—</span>}
                      </td>

                      {/* Location */}
                      <td className="px-5 py-4 text-sm text-gray-500 hidden lg:table-cell">
                        {client.location || <span className="text-gray-300">—</span>}
                      </td>

                      {/* Rate */}
                      <td className="px-5 py-4 text-right text-sm font-semibold text-gray-800">
                        {Number(client.monthly_rate) > 0
                          ? fmtINR(client.monthly_rate)
                          : <span className="text-gray-300 font-normal">—</span>}
                      </td>

                      {/* Payment */}
                      <td className="px-5 py-4">
                        <span className={`text-xs font-semibold px-2.5 py-1 rounded-full capitalize ${STATUS_PILL[client.payment_status] || 'bg-gray-100 text-gray-500'}`}>
                          {client.payment_status || 'unknown'}
                        </span>
                      </td>

                      {/* Actions */}
                      <td className="px-5 py-4">
                        <div className="flex items-center justify-end gap-3">
                          <button
                            onClick={() => handleViewDashboard(client)}
                            className="text-xs font-medium text-blue-600 hover:text-blue-800 hover:underline whitespace-nowrap"
                          >
                            Dashboard
                          </button>
                          <span className="text-gray-200 select-none">|</span>
                          <button
                            onClick={() => { setAddUserForClient(client); setShowAddUser(true) }}
                            className="text-xs font-medium text-gray-500 hover:text-gray-700 hover:underline whitespace-nowrap"
                          >
                            Add User
                          </button>
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}

          {/* Footer count */}
          {!loading && !error && filtered.length > 0 && (
            <div className="px-5 py-3 border-t border-gray-50 text-xs text-gray-400">
              Showing {filtered.length} of {clients.length} client{clients.length !== 1 ? 's' : ''}
            </div>
          )}
        </div>
      </main>

      {/* ── Modals ── */}
      {showAddClient && (
        <AddClientModal
          token={token}
          onClose={() => setShowAddClient(false)}
          onSuccess={() => { setShowAddClient(false); loadClients() }}
        />
      )}

      {showAddUser && (
        <AddUserModal
          clients={clients}
          preselectedClientId={addUserForClient?.id}
          token={token}
          onClose={() => { setShowAddUser(false); setAddUserForClient(null) }}
          onSuccess={(u) => { setShowAddUser(false); setAddUserForClient(null); setNewUser(u) }}
        />
      )}

      {newUser && (
        <CredentialsModal user={newUser} onClose={() => setNewUser(null)} />
      )}
    </div>
  )
}

export default AdminDashboard
