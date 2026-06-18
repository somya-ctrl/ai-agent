import { useEffect } from 'react'
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom'
import { AuthProvider, useAuth } from './context/AuthContext'
import PrivateRoute from './components/PrivateRoute'
import HomePage from './pages/HomePage'
import LoginPage from './pages/LoginPage'

export const dashboardUrls = {
  restaurant: 'https://dashboard.growwithaii.com/',
  insurance: 'https://tata-aig-dashboard.pages.dev',
}

function DashboardRedirect({ industry }) {
  const { token } = useAuth()

  useEffect(() => {
    const url = dashboardUrls[industry]
    if (url && token) {
      window.location.href = `${url}?token=${encodeURIComponent(token)}`
    }
  }, [industry, token])

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

          {/* Protected — only DB users with matching industry (or admin) can access */}
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
