export default function FAQ() {
  const qas = [
    { q: "What is your return policy?", a: "30-day returns on unused items." },
    { q: "Do you ship internationally?", a: "Yes — international rates apply." },
    { q: "How can I track my order?", a: "Use the tracking link sent to your email." },
  ]

  return (
    <section className="mx-auto max-w-7xl px-6 py-12">
      <h2 className="text-2xl font-semibold">Frequently asked questions</h2>
      <div className="mt-6 grid gap-4 sm:grid-cols-2">
        {qas.map((qa) => (
          <div key={qa.q} className="rounded border p-4">
            <h3 className="font-medium">{qa.q}</h3>
            <p className="mt-2 text-sm text-zinc-600">{qa.a}</p>
          </div>
        ))}
      </div>
    </section>
  )
}
