export default function Team() {
  const members = [
    { name: "Ava Smith", role: "Founder" },
    { name: "Noah Lee", role: "Head of Product" },
    { name: "Maya Patel", role: "Head of Design" },
  ]

  return (
    <section className="mx-auto max-w-7xl px-6 py-12">
      <h2 className="text-2xl font-semibold">Meet the team</h2>
      <div className="mt-6 grid gap-6 sm:grid-cols-3">
        {members.map((m) => (
          <div key={m.name} className="rounded border p-4 text-center">
            <div className="mx-auto h-24 w-24 rounded-full bg-zinc-200" />
            <h3 className="mt-4 font-medium">{m.name}</h3>
            <p className="mt-1 text-sm text-zinc-600">{m.role}</p>
          </div>
        ))}
      </div>
    </section>
  )
}
