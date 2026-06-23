import { useState, useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import { useAuth } from '../context/AuthContext'
import { dashboardUrls } from '../App'
import {
  ResponsiveContainer, LineChart, Line,
  XAxis, YAxis, CartesianGrid, Tooltip, Legend,
} from 'recharts'

const AUTH_SERVICE = 'https://agentai-auth-service.agarwalsomya224.workers.dev'

const INDUSTRY_ICONS  = { restaurant: '🍽️', insurance: '🛡️' }
const INDUSTRY_LABELS = { restaurant: 'Restaurant', insurance: 'Insurance' }

const STATUS_PILL = {
  paid:    'bg-emerald-500/20 text-emerald-400 border border-emerald-500/30',
  pending: 'bg-amber-500/20  text-amber-400  border border-amber-500/30',
  overdue: 'bg-red-500/20    text-red-400    border border-red-500/30',
}

const inputCls = 'w-full bg-slate-700/50 border border-slate-600 rounded-xl px-4 py-2.5 text-sm text-white placeholder-slate-500 focus:outline-none focus:ring-2 focus:ring-teal-500 focus:border-transparent'

// ── Credentials Modal ─────────────────────────────────────────────
function CredentialsModal({ creds, onClose }) {
  const [copied, setCopied] = useState(false)
  const text = `Client: ${creds.clientName}\nEmail: ${creds.email}\nPassword: ${creds.password}\nIndustry: ${creds.industry}`
  const copy = () => { navigator.clipboard.writeText(text); setCopied(true); setTimeout(() => setCopied(false), 2000) }

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-sm p-4">
      <div className="bg-[#112136] border border-slate-700 rounded-2xl shadow-2xl w-full max-w-md p-6">
        <div className="flex items-center gap-2 mb-4">
          <span className="text-2xl">✅</span>
          <h2 className="text-lg font-bold text-white">Client Created!</h2>
        </div>
        <p className="text-sm text-slate-400 mb-4">Share these login credentials with the client for their dashboard access:</p>

        <div className="bg-slate-800/80 border border-slate-700 rounded-xl p-4 font-mono text-sm space-y-2.5">
          {[
            { label: 'Client',   value: creds.clientName },
            { label: 'Email',    value: creds.email },
            { label: 'Password', value: creds.password },
            { label: 'Industry', value: creds.industry },
          ].map(({ label, value }) => (
            <div key={label} className="flex justify-between gap-4">
              <span className="text-slate-500 flex-shrink-0">{label}</span>
              <span className="text-white font-semibold text-right">{value}</span>
            </div>
          ))}
        </div>

        <div className="flex gap-3 mt-5">
          <button onClick={copy}
            className="flex-1 border border-teal-500/40 text-teal-400 hover:bg-teal-500/10 font-semibold rounded-xl py-2.5 text-sm transition-colors">
            {copied ? '✓ Copied!' : 'Copy Credentials'}
          </button>
          <button onClick={onClose}
            className="flex-1 bg-teal-600 hover:bg-teal-500 text-white font-semibold rounded-xl py-2.5 text-sm transition-colors">
            Done
          </button>
        </div>
      </div>
    </div>
  )
}

// ── Add Client Modal ──────────────────────────────────────────────
function AddClientModal({ token, onClose, onSuccess }) {
  const [form, setForm] = useState({
    name: '', industry: 'restaurant', type: '', location: '',
    monthly_rate: '', payment_status: 'pending',
    email: '', password: '',
  })
  const [loading, setLoading] = useState(false)
  const [error, setError]     = useState(null)

  const set = (k) => (e) => setForm((f) => ({ ...f, [k]: e.target.value }))

  const handleSubmit = async (e) => {
    e.preventDefault()
    setLoading(true)
    setError(null)
    try {
      // Step 1 — create the client
      const clientRes = await fetch(`${AUTH_SERVICE}/api/clients`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json', Authorization: `Bearer ${token}` },
        body: JSON.stringify({ ...form, monthly_rate: Number(form.monthly_rate) || 0 }),
      })
      const clientData = await clientRes.json()
      if (!clientRes.ok) throw new Error(clientData.message || 'Failed to create client')

      // Step 2 — create the dashboard user linked to this client
      const userRes = await fetch(`${AUTH_SERVICE}/api/users`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json', Authorization: `Bearer ${token}` },
        body: JSON.stringify({
          email:     form.email.trim(),
          password:  form.password,
          industry:  form.industry,
          entity_id: clientData.client.id,
        }),
      })
      const userData = await userRes.json()
      if (!userRes.ok) throw new Error(userData.message || 'Client created but failed to create user')

      onSuccess({
        clientName: form.name.trim(),
        email:      form.email.trim(),
        password:   form.password,
        industry:   form.industry,
      })
    } catch (err) {
      setError(err.message)
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-sm p-4">
      <div className="bg-[#112136] border border-slate-700 rounded-2xl shadow-2xl w-full max-w-md p-6 max-h-[90vh] overflow-y-auto">
        <div className="flex items-center justify-between mb-5">
          <h2 className="text-lg font-bold text-white">Add New Client</h2>
          <button onClick={onClose} className="text-slate-400 hover:text-white text-xl leading-none transition-colors">✕</button>
        </div>

        <form onSubmit={handleSubmit} className="flex flex-col gap-4">

          {/* ── Client Info ── */}
          <p className="text-xs font-semibold text-teal-400 uppercase tracking-wider">Client Details</p>

          <div>
            <label className="block text-xs font-medium text-slate-400 mb-1">Client Name *</label>
            <input type="text" required value={form.name} onChange={set('name')}
              placeholder="e.g. The Grand Hotel" className={inputCls} />
          </div>

          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="block text-xs font-medium text-slate-400 mb-1">Industry *</label>
              <select value={form.industry} onChange={set('industry')} className={inputCls + ' bg-slate-700/50'}>
                <option value="restaurant">🍽️ Restaurant</option>
                <option value="insurance">🛡️ Insurance</option>
              </select>
            </div>
            <div>
              <label className="block text-xs font-medium text-slate-400 mb-1">Type</label>
              <input type="text" value={form.type} onChange={set('type')}
                placeholder="e.g. Fine Dining" className={inputCls} />
            </div>
          </div>

          <div>
            <label className="block text-xs font-medium text-slate-400 mb-1">Location</label>
            <input type="text" value={form.location} onChange={set('location')}
              placeholder="e.g. Mumbai, India" className={inputCls} />
          </div>

          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="block text-xs font-medium text-slate-400 mb-1">Monthly Rate (₹)</label>
              <input type="number" min="0" value={form.monthly_rate} onChange={set('monthly_rate')}
                placeholder="0" className={inputCls} />
            </div>
            <div>
              <label className="block text-xs font-medium text-slate-400 mb-1">Payment Status</label>
              <select value={form.payment_status} onChange={set('payment_status')} className={inputCls + ' bg-slate-700/50'}>
                <option value="pending">Pending</option>
                <option value="paid">Paid</option>
                <option value="overdue">Overdue</option>
              </select>
            </div>
          </div>

          {/* ── Dashboard Credentials ── */}
          <div className="border-t border-slate-700 pt-4 mt-1">
            <p className="text-xs font-semibold text-teal-400 uppercase tracking-wider mb-3">Dashboard Login Credentials</p>

            <div className="flex flex-col gap-3">
              <div>
                <label className="block text-xs font-medium text-slate-400 mb-1">Email *</label>
                <input type="email" required value={form.email} onChange={set('email')}
                  placeholder="client@example.com" className={inputCls} />
              </div>
              <div>
                <label className="block text-xs font-medium text-slate-400 mb-1">Password *</label>
                <input type="text" required value={form.password} onChange={set('password')}
                  placeholder="Set a password for this client" className={inputCls} />
              </div>
            </div>
          </div>

          {error && (
            <p className="text-xs text-red-400 bg-red-500/10 border border-red-500/20 rounded-xl px-4 py-2">{error}</p>
          )}

          <button type="submit" disabled={loading}
            className="w-full bg-teal-600 hover:bg-teal-500 disabled:opacity-50 text-white font-semibold rounded-xl py-2.5 text-sm transition-colors mt-1">
            {loading ? 'Creating client & user…' : 'Create Client + Credentials'}
          </button>
        </form>
      </div>
    </div>
  )
}

// ── Stat Card ─────────────────────────────────────────────────────
function StatCard({ label, value, sub, icon, valueColor }) {
  return (
    <div className="bg-[#112136] border border-slate-700/60 rounded-2xl p-5">
      <div className="flex items-center justify-between mb-3">
        <span className="text-xs font-semibold text-slate-400 uppercase tracking-wide">{label}</span>
        <span className="text-xl">{icon}</span>
      </div>
      <p className={`text-3xl font-bold ${valueColor}`}>{value}</p>
      <p className="text-xs text-slate-500 mt-1">{sub}</p>
    </div>
  )
}

// ── Main Page ─────────────────────────────────────────────────────
function AdminDashboard() {
  const navigate = useNavigate()
  const { token, user, logout } = useAuth()

  const [clients, setClients]   = useState([])
  const [stats, setStats]       = useState({ total: 0, revenue: 0, pending: 0 })
  const [loading, setLoading]   = useState(true)
  const [error, setError]       = useState(null)
  const [industryFilter, setIndustryFilter] = useState('all')
  const [search, setSearch]     = useState('')
  const [showAddClient, setShowAddClient]   = useState(false)
  const [newCreds, setNewCreds]             = useState(null)

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
    if (baseUrl && token)
      window.location.href = `${baseUrl}?token=${encodeURIComponent(token)}&client_id=${client.id}`
  }

  const handleLogout = () => { logout(); navigate('/login') }
  const fmtINR = (n) => `₹${Number(n || 0).toLocaleString('en-IN')}`

  // Line chart data derived from clients
  const statuses = ['pending', 'paid', 'overdue']
  const lineData = statuses.map((s) => ({
    status: s.charAt(0).toUpperCase() + s.slice(1),
    restaurant: clients.filter(c => c.industry === 'restaurant' && c.payment_status === s).length,
    insurance:  clients.filter(c => c.industry === 'insurance'  && c.payment_status === s).length,
  }))
  const totalRestaurant = clients.filter(c => c.industry === 'restaurant').length
  const totalInsurance  = clients.filter(c => c.industry === 'insurance').length

  return (
    <div className="min-h-screen" style={{ background: '#0d1b2e' }}>

      {/* ── Top Nav ── */}
      <header className="bg-[#0a1628] border-b border-slate-700/60 sticky top-0 z-10">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 h-14 flex items-center justify-between">
          <div className="flex items-center gap-2.5">
            <span className="text-xl">🤖</span>
            <span className="font-bold text-white text-lg">AgentAI</span>
            <span className="ml-1 text-xs bg-teal-500/20 text-teal-400 border border-teal-500/30 px-2 py-0.5 rounded-full font-semibold">Admin</span>
          </div>
          <div className="flex items-center gap-3">
            <span className="text-sm text-slate-400 hidden sm:block">{user?.email}</span>
            <button onClick={handleLogout}
              className="text-sm text-slate-400 hover:text-red-400 border border-slate-700 hover:border-red-500/40 px-3 py-1.5 rounded-lg transition-colors">
              Logout
            </button>
          </div>
        </div>
      </header>

      <main className="max-w-7xl mx-auto px-4 sm:px-6 py-6 sm:py-8">

        {/* ── Page Title ── */}
        <div className="mb-6">
          <h1 className="text-2xl font-bold text-white">Admin Dashboard</h1>
          <p className="text-sm text-slate-400 mt-0.5">Overview of all clients, revenue and payment status</p>
        </div>

        {/* ── Stats Row ── */}
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 mb-6">
          <StatCard label="Total Clients"     value={loading ? '—' : stats.total}            sub="Active clients on platform"       icon="🏢" valueColor="text-white" />
          <StatCard label="Monthly Revenue"   value={loading ? '—' : fmtINR(stats.revenue)}  sub="Confirmed payments this month"    icon="💰" valueColor="text-teal-400" />
          <StatCard label="Pending Payments"  value={loading ? '—' : fmtINR(stats.pending)}  sub="Awaiting payment collection"      icon="⏳" valueColor="text-amber-400" />
        </div>

        {/* ── Line Chart ── */}
        {!loading && (
          <div className="bg-[#112136] border border-slate-700/60 rounded-2xl p-5 mb-6">
            <div className="flex items-center justify-between mb-4">
              <div>
                <h2 className="text-base font-bold text-white">Dashboards by Industry</h2>
                <p className="text-xs text-slate-400 mt-0.5">Client dashboard count per industry across payment status</p>
              </div>
              <div className="flex items-center gap-4 text-xs font-medium text-slate-400">
                <span className="flex items-center gap-1.5">
                  <span className="w-5 h-0.5 bg-teal-400 inline-block rounded-full" />
                  🍽️ Restaurant ({totalRestaurant})
                </span>
                <span className="flex items-center gap-1.5">
                  <span className="w-5 h-0.5 bg-indigo-400 inline-block rounded-full" />
                  🛡️ Insurance ({totalInsurance})
                </span>
              </div>
            </div>

            <ResponsiveContainer width="100%" height={220}>
              <LineChart data={lineData} margin={{ top: 8, right: 20, left: -10, bottom: 0 }}>
                <CartesianGrid strokeDasharray="3 3" stroke="#1e3a5f" />
                <XAxis dataKey="status" tick={{ fontSize: 12, fill: '#94a3b8', fontWeight: 500 }} tickLine={false} axisLine={false} />
                <YAxis tick={{ fontSize: 11, fill: '#64748b' }} tickLine={false} axisLine={false} allowDecimals={false} />
                <Tooltip
                  contentStyle={{ background: '#0a1628', border: '1px solid #1e3a5f', borderRadius: 12, fontSize: 12, color: '#fff' }}
                  labelStyle={{ color: '#94a3b8', marginBottom: 4 }}
                  formatter={(value, name) => [`${value} dashboard${value !== 1 ? 's' : ''}`, name === 'restaurant' ? '🍽️ Restaurant' : '🛡️ Insurance']}
                />
                <Legend formatter={(name) => <span style={{ color: '#94a3b8', fontSize: 12 }}>{name === 'restaurant' ? '🍽️ Restaurant' : '🛡️ Insurance'}</span>} wrapperStyle={{ paddingTop: 12 }} />
                <Line type="monotone" dataKey="restaurant" stroke="#2dd4bf" strokeWidth={2.5} dot={{ r: 5, fill: '#2dd4bf', strokeWidth: 0 }} activeDot={{ r: 7, strokeWidth: 0 }} />
                <Line type="monotone" dataKey="insurance"  stroke="#818cf8" strokeWidth={2.5} dot={{ r: 5, fill: '#818cf8', strokeWidth: 0 }} activeDot={{ r: 7, strokeWidth: 0 }} />
              </LineChart>
            </ResponsiveContainer>
          </div>
        )}

        {/* ── Client Table ── */}
        <div className="bg-[#112136] border border-slate-700/60 rounded-2xl overflow-hidden">

          {/* Header */}
          <div className="p-4 sm:p-5 border-b border-slate-700/60">
            <div className="flex flex-col sm:flex-row sm:items-center gap-3">
              <h2 className="text-base font-bold text-white flex-1">Client List</h2>

              <input
                type="text"
                placeholder="Search by name, location…"
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                className="bg-slate-700/50 border border-slate-600 rounded-xl px-3 py-2 text-sm text-white placeholder-slate-500 focus:outline-none focus:ring-2 focus:ring-teal-500 w-full sm:w-52"
              />

              <button
                onClick={() => setShowAddClient(true)}
                className="flex items-center justify-center gap-1.5 bg-teal-600 hover:bg-teal-500 text-white text-sm font-semibold px-4 py-2 rounded-xl transition-colors whitespace-nowrap"
              >
                + Add Client
              </button>
            </div>

            {/* Industry Tabs */}
            <div className="flex gap-1 mt-3 flex-wrap">
              {['all', 'restaurant', 'insurance'].map((ind) => (
                <button key={ind} onClick={() => setIndustryFilter(ind)}
                  className={`px-3.5 py-1.5 rounded-lg text-sm font-medium transition-colors ${
                    industryFilter === ind
                      ? 'bg-teal-600 text-white'
                      : 'text-slate-400 hover:bg-slate-700/50 hover:text-white'
                  }`}>
                  {ind === 'all' ? '📋 All' : `${INDUSTRY_ICONS[ind]} ${INDUSTRY_LABELS[ind]}`}
                </button>
              ))}
              {industryFilter !== 'all' && (
                <button onClick={() => navigate(`/clients/${industryFilter}`)}
                  className="ml-auto text-xs text-teal-400 hover:underline flex items-center gap-1">
                  Open {INDUSTRY_LABELS[industryFilter]} list →
                </button>
              )}
            </div>
          </div>

          {/* Body */}
          {loading ? (
            <div className="p-6 flex flex-col gap-3">
              {[1, 2, 3, 4].map((i) => (
                <div key={i} className="h-12 bg-slate-700/40 rounded-xl animate-pulse" />
              ))}
            </div>
          ) : error ? (
            <div className="m-4 p-4 bg-red-500/10 border border-red-500/20 rounded-xl text-sm text-red-400">
              Failed to load clients: {error}
            </div>
          ) : filtered.length === 0 ? (
            <div className="py-12 text-center text-sm text-slate-500">
              {search || industryFilter !== 'all' ? 'No clients match your filter.' : 'No clients found. Add one to get started.'}
            </div>
          ) : (
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead>
                  <tr className="border-b border-slate-700/60" style={{ background: 'rgba(10,22,40,0.5)' }}>
                    <th className="px-5 py-3 text-left text-xs font-semibold text-slate-500 uppercase tracking-wide">Client</th>
                    <th className="px-5 py-3 text-left text-xs font-semibold text-slate-500 uppercase tracking-wide">Industry</th>
                    <th className="px-5 py-3 text-left text-xs font-semibold text-slate-500 uppercase tracking-wide hidden md:table-cell">Type</th>
                    <th className="px-5 py-3 text-left text-xs font-semibold text-slate-500 uppercase tracking-wide hidden lg:table-cell">Location</th>
                    <th className="px-5 py-3 text-right text-xs font-semibold text-slate-500 uppercase tracking-wide">Monthly Rate</th>
                    <th className="px-5 py-3 text-left text-xs font-semibold text-slate-500 uppercase tracking-wide">Payment</th>
                    <th className="px-5 py-3 text-right text-xs font-semibold text-slate-500 uppercase tracking-wide">Actions</th>
                  </tr>
                </thead>
                <tbody>
                  {filtered.map((client) => (
                    <tr key={client.id}
                      className="border-b border-slate-700/40 last:border-0 hover:bg-slate-700/20 transition-colors">
                      <td className="px-5 py-4">
                        <div className="flex items-center gap-3">
                          <div className="w-8 h-8 rounded-lg bg-teal-500/20 flex items-center justify-center text-sm font-bold text-teal-400 flex-shrink-0">
                            {client.name[0].toUpperCase()}
                          </div>
                          <span className="font-medium text-white text-sm">{client.name}</span>
                        </div>
                      </td>
                      <td className="px-5 py-4">
                        <span className="text-sm text-slate-300 flex items-center gap-1.5">
                          {INDUSTRY_ICONS[client.industry]}
                          <span className="hidden sm:inline">{INDUSTRY_LABELS[client.industry] || client.industry}</span>
                        </span>
                      </td>
                      <td className="px-5 py-4 text-sm text-slate-400 hidden md:table-cell">
                        {client.type || <span className="text-slate-600">—</span>}
                      </td>
                      <td className="px-5 py-4 text-sm text-slate-400 hidden lg:table-cell">
                        {client.location || <span className="text-slate-600">—</span>}
                      </td>
                      <td className="px-5 py-4 text-right text-sm font-semibold text-white">
                        {Number(client.monthly_rate) > 0
                          ? fmtINR(client.monthly_rate)
                          : <span className="text-slate-600 font-normal">—</span>}
                      </td>
                      <td className="px-5 py-4">
                        <span className={`text-xs font-semibold px-2.5 py-1 rounded-full capitalize ${STATUS_PILL[client.payment_status] || 'bg-slate-700 text-slate-400'}`}>
                          {client.payment_status || 'unknown'}
                        </span>
                      </td>
                      <td className="px-5 py-4 text-right">
                        <button onClick={() => handleViewDashboard(client)}
                          className="text-xs font-medium text-teal-400 hover:text-teal-300 hover:underline whitespace-nowrap transition-colors">
                          Dashboard →
                        </button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}

          {!loading && !error && filtered.length > 0 && (
            <div className="px-5 py-3 border-t border-slate-700/40 text-xs text-slate-500">
              Showing {filtered.length} of {clients.length} client{clients.length !== 1 ? 's' : ''}
            </div>
          )}
        </div>
      </main>

      {showAddClient && (
        <AddClientModal
          token={token}
          onClose={() => setShowAddClient(false)}
          onSuccess={(creds) => { setShowAddClient(false); loadClients(); setNewCreds(creds) }}
        />
      )}

      {newCreds && (
        <CredentialsModal creds={newCreds} onClose={() => setNewCreds(null)} />
      )}
    </div>
  )
}

export default AdminDashboard
