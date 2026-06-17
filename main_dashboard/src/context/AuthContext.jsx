import { createContext, useContext, useState } from 'react'

const AuthContext = createContext(null)

export const AuthProvider = ({ children }) => {
  const [token, setToken] = useState(() => localStorage.getItem('agentai_token'))
  const [user, setUser] = useState(() => {
    const saved = localStorage.getItem('agentai_user')
    return saved ? JSON.parse(saved) : null
  })

  const login = (jwt, userData) => {
    localStorage.setItem('agentai_token', jwt)
    localStorage.setItem('agentai_user', JSON.stringify(userData))
    setToken(jwt)
    setUser(userData)
  }

  const logout = () => {
    localStorage.removeItem('agentai_token')
    localStorage.removeItem('agentai_user')
    setToken(null)
    setUser(null)
  }

  return (
    <AuthContext.Provider value={{ token, user, login, logout }}>
      {children}
    </AuthContext.Provider>
  )
}

export const useAuth = () => useContext(AuthContext)
