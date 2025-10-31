import Navbar from "@/components/site/Navbar";
import Announcement from "@/components/site/Announcement";
import Features from "@/components/site/Features";
import ProductCard from "@/components/site/ProductCard";
import FAQ from "@/components/site/FAQ";
import Team from "@/components/site/Team";
import Footer from "@/components/site/Footer";
import {
  Carousel,
  CarouselContent,
  CarouselItem,
} from "@/components/ui/carousel";
import Hero from "@/components/site/Hero";

const sampleProducts = [
  { id: "1", title: "Classic Hoodie", price: "$49", image: "/product1.jpg" },
  { id: "2", title: "Everyday Tee", price: "$29", image: "/product2.jpg" },
  { id: "3", title: "Minimalist Watch", price: "$199", image: "/product3.jpg" },
  { id: "4", title: "Sneaker X", price: "$129", image: "/product4.jpg" },
];

export default function Home() {
  return (
    <div className="min-h-screen bg-zinc-50 dark:bg-black">
      <Announcement />
      <Navbar />
      <main className="flex flex-col gap-2">
        <Hero />

        <section className="mx-auto max-w-7xl px-6 py-12">
          <div className="flex items-center justify-between">
            <h2 className="text-2xl font-semibold">Trending now</h2>
            <a href="/collections/trending" className="text-sm text-zinc-600">
              See all
            </a>
          </div>

          <div className="mt-6">
            <Carousel>
              <CarouselContent>
                {sampleProducts.map((p) => (
                  <CarouselItem key={p.id} className="w-72">
                    <ProductCard product={p} />
                  </CarouselItem>
                ))}
              </CarouselContent>
            </Carousel>
          </div>
        </section>

        <Features />

        <section className="mx-auto max-w-7xl px-6 py-12">
          <h2 className="text-2xl font-semibold">On sale</h2>
          <div className="mt-6 grid gap-6 sm:grid-cols-3">
            {sampleProducts.slice(0, 3).map((p) => (
              <ProductCard key={p.id} product={p} />
            ))}
          </div>
        </section>

        <FAQ />

        <Team />
      </main>

      <Footer />
    </div>
  );
}
