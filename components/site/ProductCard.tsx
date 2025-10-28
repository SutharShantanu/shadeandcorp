import Image from "next/image"

type Product = {
  id: string
  title: string
  price: string
  image: string
}

export default function ProductCard({ product }: { product: Product }) {
  return (
    <article className="rounded bg-white p-4 shadow dark:bg-zinc-800">
      <div className="relative h-48 w-full overflow-hidden rounded">
        <Image src={product.image} alt={product.title} fill className="object-cover" />
      </div>
      <h3 className="mt-3 text-sm font-medium">{product.title}</h3>
      <div className="mt-2 flex items-center justify-between">
        <span className="text-sm font-semibold">{product.price}</span>
      </div>
    </article>
  )
}
