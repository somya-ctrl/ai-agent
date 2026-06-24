import Background from './Background'
import HeroContent from './HeroContent'
import StatsBar from './StatsBar'
import Navbar from '../layout/Navbar'

export default function HeroSection() {
  return (
    <div
      style={{
        position: 'relative',
        minHeight: '100vh',
        width: '100%',
        overflow: 'hidden',
        background: '#000',
        display: 'flex',
        flexDirection: 'column',
      }}
    >
      <Background />
      <Navbar />
      <HeroContent />
      <StatsBar />
    </div>
  )
}
