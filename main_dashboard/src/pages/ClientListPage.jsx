import { useParams, useNavigate } from 'react-router-dom'
import { useAuth } from '../context/AuthContext'
import { dashboardUrls } from '../App'

const MOCK_CLIENTS = {
  restaurant: [
    { id: 'spice-garden',  name: 'Spice Garden', type: 'Indian Restaurant', location: 'London, UK' },
    { id: 'pizza-hub',     name: 'Pizza Hub',     type: 'Pizza Chain',       location: 'Manchester, UK' },
    { id: 'tasty-bites',   name: 'Tasty Bites',   type: 'Fast Food',         location: 'Birmingham, UK' },
    { id: 'curry-palace',  name: 'Curry Palace',  type: 'Indian Restaurant', location: 'Leeds, UK' },
    { id: 'burger-barn',   name: 'Burger Barn',   type: 'Burger Joint',      location: 'Bristol, UK' },
  ],
  insurance: [
    { id: 'shield-cover',  name: 'Shield Cover',  type: 'General Insurance', location: 'Mumbai, IN' },
    { id: 'safe-policies', name: 'Safe Policies', type: 'Life Insurance',    location: 'Delhi, IN' },
    { id: 'trust-insure',  name: 'Trust Insure',  type: 'Health Insurance',  location: 'Bangalore, IN' },
    { id: 'nova-protect',  name: 'Nova Protect',  type: 'Motor Insurance',   location: 'Pune, IN' },
  ],
}

const INDUSTRY_META = {
  restaurant: { icon: '🍽️', label: 'Restaurant' },
  insurance:  { icon: '🛡️', label: 'Insurance'  },
}

function ClientListPage() {
  const { industry } = useParams()
  const { token, user } = useAuth()
  const navigate = useNavigate()

  const clients = MOCK_CLIENTS[industry] || []
  const meta    = INDUSTRY_META[industry] || { icon: '🏢', label: industry }

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

        {/* Client cards */}
        <div className="flex flex-col gap-3">
          {clients.map((client) => (
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
          ))}
        </div>

        <p className="text-center text-xs text-gray-300 mt-8">
          Logged in as admin · <span className="text-gray-400">{user?.email}</span>
        </p>

      </div>
    </div>
  )
}

export default ClientListPage
