import { Navigate } from 'react-router-dom'
import { useAuth } from '../context/AuthContext'

// Decodes JWT payload and checks expiry — no secret needed client-side
const isTokenValid = (token) => {
  try {
    const payload = JSON.parse(atob(token.split('.')[1]))
    return !payload.exp || Date.now() / 1000 < payload.exp
  } catch {
    return false
  }
}

const PrivateRoute = ({ children, industry, adminOnly }) => {
  const { token, user } = useAuth()

  if (!token || !user || !isTokenValid(token)) {
    return <Navigate to="/login" replace />
  }

  const isAdmin = user.role === 'admin' || user.industry === 'admin'

  if (adminOnly && !isAdmin) {
    return <Navigate to="/login" replace />
  }

  if (industry && user.industry !== industry && !isAdmin) {
    return <Navigate to="/login" replace />
  }

  return children
}

export default PrivateRoute
