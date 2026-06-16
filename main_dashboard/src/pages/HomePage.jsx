import { useNavigate } from 'react-router-dom'

function HomePage() {
  const navigate = useNavigate()

  return (
    <div className="min-h-screen bg-white">

      {/* Navbar */}
      <nav className="flex items-center justify-between px-8 py-4 border-b border-gray-100 bg-white shadow-sm">
        <div className="flex items-center gap-2 text-xl font-semibold text-gray-900">
          <span>🤖</span>
          <span>AgentAI</span>
        </div>
        <button
          onClick={() => navigate('/login')}
          className="bg-blue-600 hover:bg-blue-700 text-white text-sm font-medium px-5 py-2 rounded-lg transition-colors duration-200"
        >
          Login
        </button>
      </nav>

      {/* Hero */}
      <section className="bg-gradient-to-b from-blue-50 to-white px-8 py-24 text-center">
        <span className="inline-block bg-blue-100 text-blue-700 text-xs font-semibold px-4 py-1.5 rounded-full mb-6 uppercase tracking-wide">
          AI-powered voice & messaging agents
        </span>
        <h1 className="text-5xl font-bold text-gray-900 leading-tight max-w-3xl mx-auto mb-6">
          Automate customer conversations across every industry
        </h1>
        <p className="text-gray-500 text-lg max-w-xl mx-auto mb-10 leading-relaxed">
          Deploy intelligent AI agents for inbound calls, WhatsApp, and bookings — without changing your existing phone number.
        </p>
        <div className="flex gap-4 justify-center flex-wrap">
          <button
            onClick={() => navigate('/login')}
            className="bg-blue-600 hover:bg-blue-700 text-white font-semibold px-8 py-3 rounded-xl text-base transition-colors duration-200 shadow-md"
          >
            Get Started
          </button>
          <button
            onClick={() => navigate('/login')}
            className="bg-white hover:bg-gray-50 text-gray-700 font-semibold px-8 py-3 rounded-xl text-base border border-gray-200 transition-colors duration-200"
          >
            See How It Works
          </button>
        </div>
      </section>

      {/* Stats */}
      <section className="bg-blue-600 py-10 px-8">
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-6 max-w-3xl mx-auto text-center">
          {[
            { num: '24/7', label: 'Always Available' },
            { num: '2 min', label: 'Setup Time' },
            { num: '2', label: 'Industries Supported' },
          ].map((stat) => (
            <div key={stat.label}>
              <div className="text-4xl font-bold text-white">{stat.num}</div>
              <div className="text-blue-200 text-sm mt-1 font-medium">{stat.label}</div>
            </div>
          ))}
        </div>
      </section>

      {/* Industries */}
      <section className="px-8 py-16 bg-gray-50">
        <div className="max-w-4xl mx-auto">
          <p className="text-xs text-blue-600 uppercase tracking-widest font-semibold mb-2">Industries</p>
          <h2 className="text-3xl font-bold text-gray-900 mb-3">Choose your industry</h2>
          <p className="text-gray-500 text-base mb-10 leading-relaxed">
            Login to access your tailored dashboard and AI agent configuration.
          </p>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">

            {/* Restaurant */}
            <div
              onClick={() => navigate('/login')}
              className="bg-white border-2 border-orange-100 hover:border-orange-400 rounded-2xl p-8 cursor-pointer transition-all duration-200 hover:shadow-lg group"
            >
              <div className="w-14 h-14 bg-orange-100 rounded-2xl flex items-center justify-center text-3xl mb-5 group-hover:bg-orange-200 transition-colors">
                🍽️
              </div>
              <h3 className="text-xl font-bold text-gray-900 mb-2">Restaurant</h3>
              <p className="text-gray-500 text-sm leading-relaxed mb-4">
                Manage bookings, live orders, and voice agent calls from one unified dashboard.
              </p>
              <span className="inline-block bg-orange-100 text-orange-700 text-xs font-semibold px-3 py-1 rounded-full">
                Food & Beverage
              </span>
            </div>

            {/* Insurance */}
            <div
              onClick={() => navigate('/login')}
              className="bg-white border-2 border-blue-100 hover:border-blue-400 rounded-2xl p-8 cursor-pointer transition-all duration-200 hover:shadow-lg group"
            >
              <div className="w-14 h-14 bg-blue-100 rounded-2xl flex items-center justify-center text-3xl mb-5 group-hover:bg-blue-200 transition-colors">
                🛡️
              </div>
              <h3 className="text-xl font-bold text-gray-900 mb-2">Insurance</h3>
              <p className="text-gray-500 text-sm leading-relaxed mb-4">
                Handle policy queries, claims intake, and client calls with AI agents.
              </p>
              <span className="inline-block bg-blue-100 text-blue-700 text-xs font-semibold px-3 py-1 rounded-full">
                Financial Services
              </span>
            </div>

          </div>
        </div>
      </section>

      {/* Features */}
      <section className="px-8 py-16 bg-white">
        <div className="max-w-4xl mx-auto">
          <p className="text-xs text-blue-600 uppercase tracking-widest font-semibold mb-2">Features</p>
          <h2 className="text-3xl font-bold text-gray-900 mb-3">Everything your business needs</h2>
          <p className="text-gray-500 text-base mb-10 leading-relaxed">
            One platform for voice agents, WhatsApp bots, booking management, and live dashboards.
          </p>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {[
              { icon: '📞', title: 'Voice AI Agent', desc: 'Handles inbound calls using your existing SIP number via Twilio or VAPI.', bg: 'bg-green-50', iconBg: 'bg-green-100' },
              { icon: '💬', title: 'WhatsApp Agent', desc: 'Responds to customers on WhatsApp automatically, around the clock.', bg: 'bg-emerald-50', iconBg: 'bg-emerald-100' },
              { icon: '📅', title: 'Booking Management', desc: 'Live reservation calendar with real-time updates from your AI agent.', bg: 'bg-purple-50', iconBg: 'bg-purple-100' },
              { icon: '📊', title: 'Live Dashboard', desc: 'Monitor orders, bookings, and agent activity in real time.', bg: 'bg-blue-50', iconBg: 'bg-blue-100' },
              { icon: '🔒', title: 'Secure JWT Auth', desc: 'Role-based access with JWT tokens and API gateway validation.', bg: 'bg-yellow-50', iconBg: 'bg-yellow-100' },
              { icon: '🔌', title: 'SIP Integration', desc: 'No new number needed. Connect your existing SIP trunk in minutes.', bg: 'bg-red-50', iconBg: 'bg-red-100' },
            ].map((f) => (
              <div key={f.title} className={`${f.bg} rounded-2xl p-6 hover:shadow-md transition-shadow duration-200`}>
                <div className={`w-12 h-12 ${f.iconBg} rounded-xl flex items-center justify-center text-2xl mb-4`}>
                  {f.icon}
                </div>
                <h3 className="text-base font-bold text-gray-900 mb-2">{f.title}</h3>
                <p className="text-sm text-gray-500 leading-relaxed">{f.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* How it works */}
      <section className="px-8 py-16 bg-gray-50">
        <div className="max-w-2xl mx-auto">
          <p className="text-xs text-blue-600 uppercase tracking-widest font-semibold mb-2">How It Works</p>
          <h2 className="text-3xl font-bold text-gray-900 mb-3">Up and running in three steps</h2>
          <p className="text-gray-500 text-base mb-10 leading-relaxed">
            No infrastructure changes. No new phone numbers.
          </p>
          <div className="flex flex-col gap-6">
            {[
              { num: '01', title: 'Login and select your industry', desc: 'Sign in with your credentials and choose Restaurant or Insurance to load your tailored dashboard.' },
              { num: '02', title: 'Connect your existing SIP number', desc: "Point your current phone number's SIP trunk to our platform. No porting, no downtime, no new number required." },
              { num: '03', title: 'Your AI agent goes live', desc: 'Inbound calls and WhatsApp messages are handled automatically. Monitor everything from your live dashboard.' },
            ].map((step) => (
              <div key={step.num} className="flex gap-5 items-start bg-white rounded-2xl p-6 shadow-sm border border-gray-100">
                <div className="w-12 h-12 bg-blue-600 text-white rounded-xl flex items-center justify-center text-lg font-bold flex-shrink-0">
                  {step.num}
                </div>
                <div>
                  <h3 className="text-base font-bold text-gray-900 mb-1">{step.title}</h3>
                  <p className="text-sm text-gray-500 leading-relaxed">{step.desc}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA */}
      <section className="bg-blue-600 px-8 py-16 text-center">
        <h2 className="text-3xl font-bold text-white mb-3">Ready to deploy your AI agent?</h2>
        <p className="text-blue-200 text-base mb-8">Login to access your dashboard and get started in minutes.</p>
        <button
          onClick={() => navigate('/login')}
          className="bg-white hover:bg-gray-100 text-blue-600 font-bold px-8 py-3 rounded-xl text-base transition-colors duration-200 shadow-md"
        >
          Login to Your Dashboard →
        </button>
      </section>

      {/* Footer */}
      <footer className="bg-gray-900 px-8 py-6 flex flex-col sm:flex-row justify-between items-center gap-3">
        <p className="text-gray-400 text-sm">© 2026 AgentAI. All rights reserved.</p>
        <div className="flex gap-6">
          {['Privacy', 'Terms', 'Support'].map((link) => (
            <a key={link} href="#" className="text-gray-400 hover:text-white text-sm transition-colors duration-200">
              {link}
            </a>
          ))}
        </div>
      </footer>

    </div>
  )
}

export default HomePage