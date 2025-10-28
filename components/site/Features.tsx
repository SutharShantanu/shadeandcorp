export default function Features() {
  const items = [
    { title: "Fast shipping", desc: "Get your order in 2-4 business days." },
    { title: "Easy returns", desc: "30-day hassle-free returns." },
    { title: "Secure payments", desc: "We use industry-standard encryption." },
  ]

  return (
    <section className="mx-auto max-w-7xl px-6 py-12">
      <h2 className="text-2xl font-semibold">Why shop with us</h2>
      <div className="mt-6 grid gap-6 sm:grid-cols-3">
        {items.map((it) => (
          <div key={it.title} className="rounded border p-4">
            <h3 className="font-medium">{it.title}</h3>
            <p className="mt-2 text-sm text-zinc-600">{it.desc}</p>
          </div>
        ))}
      </div>
    </section>
  )
}
