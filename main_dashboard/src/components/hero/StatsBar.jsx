const stats = [
  { value: '24/7',  label: 'Always available' },
  { value: '2 min', label: 'Setup time' },
  { value: '3x',    label: 'More conversations handled' },
]

function StatItem() {
  return stats.map((stat, i) => (
    <div key={i} className="text-center px-16 flex-shrink-0">
      <h2 className="text-5xl font-bold text-violet-400">{stat.value}</h2>
      <p className="text-gray-400 mt-1">{stat.label}</p>
    </div>
  ))
}

export default function StatsBar() {
  return (
    <div className="overflow-hidden w-full bg-[#050816] py-8 border-t border-white/10 absolute bottom-0 left-0 right-0 z-10">
      <div className="flex animate-scroll whitespace-nowrap">
        <div className="flex min-w-full justify-around"><StatItem /></div>
        <div className="flex min-w-full justify-around"><StatItem /></div>
      </div>
    </div>
  )
}
