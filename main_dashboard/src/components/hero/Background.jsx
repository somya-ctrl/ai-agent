import { motion } from 'motion/react'

export default function Background() {
  return (
    <div style={{ position: 'absolute', inset: 0, overflow: 'hidden' }}>
      {/* Gradient layer 1 */}
      <motion.div
        style={{
          position: 'absolute',
          inset: 0,
          opacity: 0.6,
          background:
            'radial-gradient(circle at 20% 50%, rgba(120,119,198,0.3), transparent 50%), ' +
            'radial-gradient(circle at 80% 80%, rgba(99,102,241,0.3), transparent 50%), ' +
            'radial-gradient(circle at 40% 20%, rgba(168,85,247,0.4), transparent 50%)',
        }}
        animate={{ scale: [1, 1.2, 1], rotate: [0, 90, 0] }}
        transition={{ duration: 20, repeat: Infinity, ease: 'linear' }}
      />

      {/* Gradient layer 2 */}
      <motion.div
        style={{
          position: 'absolute',
          inset: 0,
          opacity: 0.4,
          background:
            'radial-gradient(circle at 60% 70%, rgba(59,130,246,0.4), transparent 50%), ' +
            'radial-gradient(circle at 30% 30%, rgba(147,51,234,0.3), transparent 50%)',
        }}
        animate={{ scale: [1.2, 1, 1.2], rotate: [90, 0, 90] }}
        transition={{ duration: 15, repeat: Infinity, ease: 'linear' }}
      />

      {/* Animated grid */}
      <div
        style={{
          position: 'absolute',
          inset: 0,
          opacity: 0.2,
          backgroundImage:
            'linear-gradient(rgba(99,102,241,0.1) 1px, transparent 1px), ' +
            'linear-gradient(90deg, rgba(99,102,241,0.1) 1px, transparent 1px)',
          backgroundSize: '50px 50px',
        }}
      />

      {/* Floating orb top-left */}
      <motion.div
        style={{
          position: 'absolute',
          top: 80,
          left: 40,
          width: 128,
          height: 128,
          borderRadius: '50%',
          background: 'rgba(168,85,247,0.2)',
          filter: 'blur(48px)',
        }}
        animate={{ y: [0, 30, 0], x: [0, 20, 0] }}
        transition={{ duration: 8, repeat: Infinity, ease: 'easeInOut' }}
      />

      {/* Floating orb bottom-right */}
      <motion.div
        style={{
          position: 'absolute',
          bottom: 80,
          right: 40,
          width: 160,
          height: 160,
          borderRadius: '50%',
          background: 'rgba(59,130,246,0.2)',
          filter: 'blur(48px)',
        }}
        animate={{ y: [0, -40, 0], x: [0, -30, 0] }}
        transition={{ duration: 10, repeat: Infinity, ease: 'easeInOut' }}
      />
    </div>
  )
}
