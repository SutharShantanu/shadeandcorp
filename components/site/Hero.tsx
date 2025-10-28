import Link from "next/link"

export default function Hero() {
  return (
    <section className="bg-gradient-to-r from-indigo-600 via-pink-600 to-amber-400 text-white">
      <div className="mx-auto max-w-7xl px-6 py-24">
        <div className="max-w-2xl">
          <h1 className="text-4xl font-bold">Discover curated products for your lifestyle</h1>
          <p className="mt-4 text-lg">High-quality goods, fair prices, and fast shipping. Shop new arrivals and exclusive drops.</p>
          <div className="mt-8 flex gap-4">
            <Link href="/collections/new" className="rounded bg-white/20 px-4 py-2 font-semibold hover:bg-white/30">Shop New</Link>
            <Link href="/collections/sale" className="rounded bg-white px-4 py-2 font-semibold text-black">Sale</Link>
          </div>
        </div>
      </div>
    </section>
  )
}
