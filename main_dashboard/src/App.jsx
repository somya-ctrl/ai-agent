import { useEffect } from 'react'
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom'
import { AuthProvider, useAuth } from './context/AuthContext'
import PrivateRoute from './components/PrivateRoute'
import HomePage from './pages/HomePage'
import LoginPage from './pages/LoginPage'
import AdminDashboard from './pages/AdminDashboard'
import ClientListPage from './pages/ClientListPage'

export const dashboardUrls = {
  restaurant: 'https://dashboard.growwithaii.com/',
  insurance: 'https://tata-aig-dashboard.pages.dev',
}

function DashboardRedirect({ industry }) {
  const { token, user } = useAuth()

  useEffect(() => {
    const url = dashboardUrls[industry]
    if (url && token) {
      const clientId = user?.client_id || user?.clientId
      const dest = clientId
        ? `${url}?token=${encodeURIComponent(token)}&client_id=${clientId}`
        : `${url}?token=${encodeURIComponent(token)}`
      window.location.href = dest
    }
  }, [industry, token, user])

  return (
    <div className="min-h-screen flex items-center justify-center text-gray-400 text-sm">
      Redirecting to {industry} dashboard…
    </div>
  )
}

function App() {
  return (
    <AuthProvider>
      <Router>
        <Routes>
          <Route path="/" element={<HomePage />} />
          <Route path="/login" element={<LoginPage />} />

          {/* Admin: overview dashboard */}
          <Route
            path="/admin"
            element={
              <PrivateRoute adminOnly>
                <AdminDashboard />
              </PrivateRoute>
            }
          />

          {/* Admin: client list per industry */}
          <Route
            path="/clients/:industry"
            element={
              <PrivateRoute adminOnly>
                <ClientListPage />
              </PrivateRoute>
            }
          />

          {/* client_user: direct redirect scoped to their client_id */}
          <Route
            path="/dashboard/restaurant"
            element={
              <PrivateRoute industry="restaurant">
                <DashboardRedirect industry="restaurant" />
              </PrivateRoute>
            }
          />
          <Route
            path="/dashboard/insurance"
            element={
              <PrivateRoute industry="insurance">
                <DashboardRedirect industry="insurance" />
              </PrivateRoute>
            }
          />
        </Routes>
      </Router>
    </AuthProvider>
  )
}

export default App
