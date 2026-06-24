import { motion } from 'motion/react'
import { useNavigate } from 'react-router-dom'

export default function Navbar() {
  const navigate = useNavigate()

  return (
    <nav
      style={{
        position: 'relative',
        zIndex: 10,
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'space-between',
        padding: '20px 64px',
      }}
    >
      <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
        <span style={{ fontSize: 28 }}>🤖</span>
        <span style={{ fontSize: 20, fontWeight: 700, color: '#fff', letterSpacing: '-0.5px' }}>
          AgentAI
        </span>
      </div>

      <motion.button
        initial={{ opacity: 0, x: 10 }}
        animate={{ opacity: 1, x: 0 }}
        transition={{ duration: 0.5 }}
        onClick={() => navigate('/login')}
        style={{
          padding: '8px 20px',
          borderRadius: 8,
          border: 'none',
          background: 'linear-gradient(to right, #4f46e5, #7c3aed)',
          color: '#fff',
          fontSize: 14,
          fontWeight: 600,
          cursor: 'pointer',
          boxShadow: '0 4px 16px rgba(99,102,241,0.35)',
        }}
      >
        Login
      </motion.button>
    </nav>
  )
}
