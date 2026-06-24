import { motion } from 'motion/react'

const stats = [
  { value: '24/7',  label: 'Always available' },
  { value: '2 min', label: 'Setup time' },
  { value: '3x',    label: 'More conversations handled' },
]

export default function StatsBar() {
  return (
    <motion.div
      initial={{ opacity: 0, y: 30 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.7, delay: 0.8 }}
      style={{
        position: 'absolute',
        bottom: 0,
        left: 0,
        right: 0,
        zIndex: 10,
        display: 'flex',
        alignItems: 'stretch',
        borderTop: '1px solid rgba(255,255,255,0.1)',
        background: 'rgba(255,255,255,0.04)',
        backdropFilter: 'blur(12px)',
      }}
    >
      {stats.map((stat, i) => (
        <div
          key={i}
          style={{
            flex: 1,
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'center',
            justifyContent: 'center',
            padding: '24px 0',
            borderRight: i < stats.length - 1 ? '1px solid rgba(255,255,255,0.1)' : 'none',
          }}
        >
          <span
            style={{
              fontSize: 'clamp(1.5rem, 3vw, 1.875rem)',
              fontWeight: 800,
              lineHeight: 1,
              background: 'linear-gradient(to right, #818cf8, #a78bfa)',
              WebkitBackgroundClip: 'text',
              WebkitTextFillColor: 'transparent',
            }}
          >
            {stat.value}
          </span>
          <span style={{ fontSize: 13, color: '#9ca3af', marginTop: 4, fontWeight: 500 }}>
            {stat.label}
          </span>
        </div>
      ))}
    </motion.div>
  )
}
