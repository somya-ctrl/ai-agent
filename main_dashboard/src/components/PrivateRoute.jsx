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

const PrivateRoute = ({ children, industry }) => {
  const { token, user } = useAuth()

  if (!token || !user || !isTokenValid(token)) {
    return <Navigate to="/login" replace />
  }

  // Block access if user's industry doesn't match the route's industry
  if (industry && user.industry !== industry) {
    return <Navigate to="/login" replace />
  }

  return children
}

export default PrivateRoute
