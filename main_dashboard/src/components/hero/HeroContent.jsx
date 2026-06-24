import { motion } from 'motion/react'
import { useNavigate } from 'react-router-dom'

export default function HeroContent() {
  const navigate = useNavigate()

  return (
    <div
      style={{
        position: 'relative',
        zIndex: 10,
        flex: 1,
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        justifyContent: 'center',
        textAlign: 'center',
        padding: '16px 24px 144px',
      }}
    >
      {/* Badge */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6 }}
        style={{
          display: 'inline-flex',
          alignItems: 'center',
          padding: '8px 16px',
          borderRadius: 999,
          marginBottom: 32,
          border: '1px solid rgba(255,255,255,0.18)',
          background: 'rgba(255,255,255,0.08)',
          color: '#a5b4fc',
          fontSize: 12,
          fontWeight: 600,
          letterSpacing: '0.1em',
          backdropFilter: 'blur(8px)',
        }}
      >
        AI-POWERED VOICE &amp; MESSAGING AGENTS
      </motion.div>

      {/* Heading */}
      <motion.h1
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6, delay: 0.2 }}
        style={{
          fontSize: 'clamp(2.2rem, 5vw, 3.75rem)',
          fontWeight: 800,
          color: '#fff',
          lineHeight: 1.15,
          maxWidth: 720,
          marginBottom: 24,
        }}
      >
        Automate customer conversations{' '}
        <span
          style={{
            background: 'linear-gradient(to right, #818cf8, #a78bfa, #60a5fa)',
            WebkitBackgroundClip: 'text',
            WebkitTextFillColor: 'transparent',
          }}
        >
          across every industry
        </span>
      </motion.h1>

      {/* Subtext */}
      <motion.p
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6, delay: 0.4 }}
        style={{
          fontSize: 'clamp(1rem, 2vw, 1.125rem)',
          color: '#d1d5db',
          maxWidth: 520,
          marginBottom: 40,
          lineHeight: 1.7,
        }}
      >
        Deploy intelligent AI agents for inbound calls, WhatsApp, and bookings
        — without changing your existing phone number.
      </motion.p>

      {/* CTA Buttons */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6, delay: 0.6 }}
        style={{ display: 'flex', gap: 16, flexWrap: 'wrap', justifyContent: 'center' }}
      >
        <button
          onClick={() => navigate('/login')}
          style={{
            padding: '12px 28px',
            borderRadius: 12,
            border: 'none',
            background: 'linear-gradient(to right, #4f46e5, #7c3aed)',
            color: '#fff',
            fontSize: 16,
            fontWeight: 600,
            cursor: 'pointer',
            boxShadow: '0 4px 24px rgba(99,102,241,0.4)',
          }}
        >
          Get Started
        </button>
        <button
          onClick={() => navigate('/login')}
          style={{
            padding: '12px 28px',
            borderRadius: 12,
            border: '1px solid rgba(255,255,255,0.2)',
            background: 'rgba(255,255,255,0.05)',
            color: '#f1f5f9',
            fontSize: 16,
            fontWeight: 600,
            cursor: 'pointer',
            backdropFilter: 'blur(8px)',
          }}
        >
          See How It Works
        </button>
      </motion.div>
    </div>
  )
}
