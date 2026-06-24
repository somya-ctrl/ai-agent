import { useNavigate } from 'react-router-dom'
import HeroSection from '../components/hero/HeroSection'

const FEATURES = [
  { icon: '📞', title: 'Voice AI Agent',     desc: 'Handles inbound calls using your existing SIP number via Twilio or VAPI.',    color: 'rgba(52,211,153,0.15)'  },
  { icon: '💬', title: 'WhatsApp Agent',     desc: 'Responds to customers on WhatsApp automatically, around the clock.',          color: 'rgba(52,211,153,0.12)'  },
  { icon: '📅', title: 'Booking Management', desc: 'Live reservation calendar with real-time updates from your AI agent.',         color: 'rgba(168,85,247,0.15)'  },
  { icon: '📊', title: 'Live Dashboard',     desc: 'Monitor orders, bookings, and agent activity in real time.',                   color: 'rgba(99,102,241,0.15)'  },
  { icon: '🔒', title: 'Secure JWT Auth',    desc: 'Role-based access with JWT tokens and API gateway validation.',                color: 'rgba(251,191,36,0.12)'  },
  { icon: '🔌', title: 'SIP Integration',    desc: 'No new number needed. Connect your existing SIP trunk in minutes.',            color: 'rgba(239,68,68,0.12)'   },
]

const STEPS = [
  { num: '01', title: 'Login and select your industry',   desc: 'Sign in with your credentials and choose Restaurant or Insurance to load your tailored dashboard.' },
  { num: '02', title: 'Connect your existing SIP number', desc: "Point your current phone number's SIP trunk to our platform. No porting, no downtime, no new number required." },
  { num: '03', title: 'Your AI agent goes live',          desc: 'Inbound calls and WhatsApp messages are handled automatically. Monitor everything from your live dashboard.' },
]

function Label({ children }) {
  return (
    <p style={{ fontSize: 11, fontWeight: 700, letterSpacing: '0.12em', textTransform: 'uppercase', color: '#a5b4fc', marginBottom: 10 }}>
      {children}
    </p>
  )
}

function Heading({ children }) {
  return (
    <h2 style={{ fontSize: 'clamp(1.75rem, 3.5vw, 2.25rem)', fontWeight: 800, color: '#fff', marginBottom: 12, lineHeight: 1.2 }}>
      {children}
    </h2>
  )
}

function Sub({ children }) {
  return (
    <p style={{ fontSize: 16, color: '#9ca3af', maxWidth: 520, lineHeight: 1.7, marginBottom: 48 }}>
      {children}
    </p>
  )
}

const glassCard = {
  background: 'rgba(255,255,255,0.04)',
  border: '1px solid rgba(255,255,255,0.1)',
  borderRadius: 20,
  padding: 32,
  cursor: 'pointer',
  transition: 'all 0.2s',
}

function HomePage() {
  const navigate = useNavigate()

  return (
    <div style={{ background: '#000', minHeight: '100vh' }}>

      {/* Animated Hero */}
      <HeroSection />

      {/* Industries */}
      <section style={{ padding: '80px 32px', background: '#000' }}>
        <div style={{ maxWidth: 900, margin: '0 auto' }}>
          <Label>Industries</Label>
          <Heading>Choose your industry</Heading>
          <Sub>Login to access your tailored dashboard and AI agent configuration.</Sub>

          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))', gap: 24 }}>

            <div
              onClick={() => navigate('/login')}
              style={glassCard}
              onMouseEnter={e => { e.currentTarget.style.background = 'rgba(168,85,247,0.08)'; e.currentTarget.style.borderColor = 'rgba(168,85,247,0.4)'; e.currentTarget.style.transform = 'translateY(-2px)' }}
              onMouseLeave={e => { e.currentTarget.style.background = glassCard.background; e.currentTarget.style.borderColor = 'rgba(255,255,255,0.1)'; e.currentTarget.style.transform = 'translateY(0)' }}
            >
              <div style={{ width: 56, height: 56, borderRadius: 14, background: 'rgba(168,85,247,0.2)', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 28, marginBottom: 20 }}>🍽️</div>
              <h3 style={{ fontSize: 20, fontWeight: 700, color: '#fff', marginBottom: 8 }}>Restaurant</h3>
              <p style={{ fontSize: 14, color: '#9ca3af', lineHeight: 1.6, marginBottom: 16 }}>Manage bookings, live orders, and voice agent calls from one unified dashboard.</p>
              <span style={{ fontSize: 11, fontWeight: 700, color: '#c4b5fd', background: 'rgba(168,85,247,0.15)', padding: '4px 12px', borderRadius: 999 }}>Food &amp; Beverage</span>
            </div>

            <div
              onClick={() => navigate('/login')}
              style={glassCard}
              onMouseEnter={e => { e.currentTarget.style.background = 'rgba(99,102,241,0.08)'; e.currentTarget.style.borderColor = 'rgba(99,102,241,0.4)'; e.currentTarget.style.transform = 'translateY(-2px)' }}
              onMouseLeave={e => { e.currentTarget.style.background = glassCard.background; e.currentTarget.style.borderColor = 'rgba(255,255,255,0.1)'; e.currentTarget.style.transform = 'translateY(0)' }}
            >
              <div style={{ width: 56, height: 56, borderRadius: 14, background: 'rgba(99,102,241,0.2)', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 28, marginBottom: 20 }}>🛡️</div>
              <h3 style={{ fontSize: 20, fontWeight: 700, color: '#fff', marginBottom: 8 }}>Insurance</h3>
              <p style={{ fontSize: 14, color: '#9ca3af', lineHeight: 1.6, marginBottom: 16 }}>Handle policy queries, claims intake, and client calls with AI agents.</p>
              <span style={{ fontSize: 11, fontWeight: 700, color: '#a5b4fc', background: 'rgba(99,102,241,0.15)', padding: '4px 12px', borderRadius: 999 }}>Financial Services</span>
            </div>

          </div>
        </div>
      </section>

      {/* Features */}
      <section style={{ padding: '80px 32px', background: '#0a0a14', borderTop: '1px solid rgba(255,255,255,0.06)', borderBottom: '1px solid rgba(255,255,255,0.06)' }}>
        <div style={{ maxWidth: 900, margin: '0 auto' }}>
          <Label>Features</Label>
          <Heading>Everything your business needs</Heading>
          <Sub>One platform for voice agents, WhatsApp bots, booking management, and live dashboards.</Sub>

          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(250px, 1fr))', gap: 20 }}>
            {FEATURES.map((f) => (
              <div
                key={f.title}
                style={{ background: 'rgba(255,255,255,0.03)', border: '1px solid rgba(255,255,255,0.08)', borderRadius: 16, padding: 24, transition: 'all 0.2s' }}
                onMouseEnter={e => { e.currentTarget.style.background = 'rgba(255,255,255,0.06)'; e.currentTarget.style.borderColor = 'rgba(255,255,255,0.14)'; e.currentTarget.style.transform = 'translateY(-2px)' }}
                onMouseLeave={e => { e.currentTarget.style.background = 'rgba(255,255,255,0.03)'; e.currentTarget.style.borderColor = 'rgba(255,255,255,0.08)'; e.currentTarget.style.transform = 'translateY(0)' }}
              >
                <div style={{ width: 48, height: 48, borderRadius: 12, background: f.color, display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 22, marginBottom: 16 }}>{f.icon}</div>
                <h3 style={{ fontSize: 15, fontWeight: 700, color: '#f1f5f9', marginBottom: 8 }}>{f.title}</h3>
                <p style={{ fontSize: 13, color: '#6b7280', lineHeight: 1.65 }}>{f.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* How It Works */}
      <section style={{ padding: '80px 32px', background: '#000' }}>
        <div style={{ maxWidth: 640, margin: '0 auto' }}>
          <Label>How It Works</Label>
          <Heading>Up and running in three steps</Heading>
          <Sub>No infrastructure changes. No new phone numbers.</Sub>

          <div style={{ display: 'flex', flexDirection: 'column', gap: 16 }}>
            {STEPS.map((step) => (
              <div key={step.num} style={{ display: 'flex', gap: 20, alignItems: 'flex-start', background: 'rgba(255,255,255,0.04)', border: '1px solid rgba(255,255,255,0.08)', borderRadius: 16, padding: 24 }}>
                <div style={{ width: 48, height: 48, borderRadius: 12, flexShrink: 0, background: 'linear-gradient(135deg, #4f46e5, #7c3aed)', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 15, fontWeight: 800, color: '#fff', boxShadow: '0 4px 16px rgba(99,102,241,0.35)' }}>
                  {step.num}
                </div>
                <div>
                  <h3 style={{ fontSize: 15, fontWeight: 700, color: '#f1f5f9', marginBottom: 6 }}>{step.title}</h3>
                  <p style={{ fontSize: 13, color: '#6b7280', lineHeight: 1.65 }}>{step.desc}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA */}
      <section style={{ padding: '80px 32px', textAlign: 'center', background: 'linear-gradient(135deg, #0f0c29, #1a1040, #0f0c29)', borderTop: '1px solid rgba(255,255,255,0.06)', position: 'relative', overflow: 'hidden' }}>
        <div style={{ position: 'absolute', top: '50%', left: '50%', transform: 'translate(-50%,-50%)', width: 400, height: 200, background: 'radial-gradient(ellipse, rgba(99,102,241,0.25), transparent 70%)', pointerEvents: 'none' }} />
        <div style={{ position: 'relative', zIndex: 1 }}>
          <h2 style={{ fontSize: 'clamp(1.75rem, 3.5vw, 2.25rem)', fontWeight: 800, color: '#fff', marginBottom: 12 }}>Ready to deploy your AI agent?</h2>
          <p style={{ fontSize: 16, color: '#9ca3af', marginBottom: 36 }}>Login to access your dashboard and get started in minutes.</p>
          <button
            onClick={() => navigate('/login')}
            style={{ padding: '14px 36px', borderRadius: 12, border: 'none', background: 'linear-gradient(to right, #4f46e5, #7c3aed)', color: '#fff', fontSize: 16, fontWeight: 700, cursor: 'pointer', boxShadow: '0 4px 28px rgba(99,102,241,0.45)' }}
          >
            Login to Your Dashboard →
          </button>
        </div>
      </section>

      {/* Footer */}
      <footer style={{ padding: '24px 32px', borderTop: '1px solid rgba(255,255,255,0.08)', background: '#000', display: 'flex', flexWrap: 'wrap', alignItems: 'center', justifyContent: 'space-between', gap: 12 }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
          <span style={{ fontSize: 20 }}>🤖</span>
          <span style={{ fontSize: 14, fontWeight: 700, color: '#e2e8f0' }}>AgentAI</span>
          <span style={{ fontSize: 13, color: '#374151', marginLeft: 8 }}>© 2026 All rights reserved.</span>
        </div>
        <div style={{ display: 'flex', gap: 24 }}>
          {['Privacy', 'Terms', 'Support'].map((link) => (
            <a key={link} href="#" style={{ fontSize: 13, color: '#4b5563', textDecoration: 'none' }}
              onMouseEnter={e => e.currentTarget.style.color = '#a5b4fc'}
              onMouseLeave={e => e.currentTarget.style.color = '#4b5563'}>
              {link}
            </a>
          ))}
        </div>
      </footer>

    </div>
  )
}

export default HomePage
