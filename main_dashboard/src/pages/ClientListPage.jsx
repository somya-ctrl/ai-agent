import { useState, useEffect } from 'react'
import { useParams, useNavigate } from 'react-router-dom'
import { useAuth } from '../context/AuthContext'
import { dashboardUrls } from '../App'

const AUTH_SERVICE = 'https://agentai-auth-service.agarwalsomya224.workers.dev'

const INDUSTRY_META = {
  restaurant: { icon: '🍽️', label: 'Restaurant' },
  insurance:  { icon: '🛡️', label: 'Insurance'  },
}

function ClientListPage() {
  const { industry } = useParams()
  const { token, user } = useAuth()
  const navigate = useNavigate()

  const [clients, setClients]   = useState([])
  const [loading, setLoading]   = useState(true)
  const [error, setError]       = useState(null)

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
      .then((data) => {
        setClients(data.clients || [])
        setLoading(false)
      })
      .catch((err) => {
        setError(err.message)
        setLoading(false)
      })
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
          <div className="flex items-center gap-3 mb-1">
            <span className="text-2xl">{meta.icon}</span>
            <h1 className="text-2xl font-bold text-gray-900">{meta.label} Clients</h1>
          </div>
          <p className="text-sm text-gray-500">Select a client to open their dashboard</p>
        </div>

        {/* States */}
        {loading && (
          <div className="flex flex-col gap-3">
            {[1, 2, 3].map((i) => (
              <div key={i} className="h-20 bg-white border border-gray-100 rounded-2xl animate-pulse" />
            ))}
          </div>
        )}

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
    </div>
  )
}

export default ClientListPage
