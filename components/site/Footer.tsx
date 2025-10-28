import Link from "next/link"

export default function Footer() {
  return (
    <footer className="border-t bg-white dark:bg-zinc-900">
      <div className="mx-auto max-w-7xl px-6 py-12">
        <div className="grid gap-6 sm:grid-cols-3">
          <div>
            <h4 className="font-semibold">Shade & Co</h4>
            <p className="mt-2 text-sm text-zinc-600">Quality goods for modern life.</p>
          </div>

          <div>
            <h4 className="font-semibold">Company</h4>
            <ul className="mt-2 space-y-1 text-sm text-zinc-600">
              <li><Link href="/about">About</Link></li>
              <li><Link href="/careers">Careers</Link></li>
              <li><Link href="/press">Press</Link></li>
            </ul>
          </div>

          <div>
            <h4 className="font-semibold">Help</h4>
            <ul className="mt-2 space-y-1 text-sm text-zinc-600">
              <li><Link href="/help">Support</Link></li>
              <li><Link href="/shipping">Shipping</Link></li>
              <li><Link href="/returns">Returns</Link></li>
            </ul>
          </div>
        </div>

        <div className="mt-8 text-center text-sm text-zinc-500">© {new Date().getFullYear()} Shade & Co. All rights reserved.</div>
      </div>
    </footer>
  )
}
