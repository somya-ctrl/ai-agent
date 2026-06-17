import { BrowserRouter as Router, Routes, Route } from 'react-router-dom'
import { AuthProvider } from './context/AuthContext'
import PrivateRoute from './components/PrivateRoute'
import HomePage from './pages/HomePage'
import LoginPage from './pages/LoginPage'

function App() {
  return (
    <AuthProvider>
      <Router>
        <Routes>
          <Route path="/" element={<HomePage />} />
          <Route path="/login" element={<LoginPage />} />

          {/* Protected — only DB users with matching industry can access */}
          <Route
            path="/dashboard/restaurant"
            element={
              <PrivateRoute industry="restaurant">
                <div className="p-8 text-xl font-bold">Restaurant Dashboard</div>
              </PrivateRoute>
            }
          />
          <Route
            path="/dashboard/insurance"
            element={
              <PrivateRoute industry="insurance">
                <div className="p-8 text-xl font-bold">Insurance Dashboard</div>
              </PrivateRoute>
            }
          />
        </Routes>
      </Router>
    </AuthProvider>
  )
}

export default App
