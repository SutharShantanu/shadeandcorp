import Hero from "@/components/site/Hero";
import NewArrivals from "@/components/site/NewArrivals";
import TrendingProducts from "@/components/site/TrendingProducts";
import Features from "@/components/site/Features";
import FAQ from "@/components/site/FAQ";

export default function Home() {
  return (
    <div className="min-h-screen bg-background text-foreground overflow-hidden">
      <main className="flex flex-col">
        <Hero />
        <NewArrivals />
        <TrendingProducts />
        <Features />
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 w-full">
          <FAQ />
        </div>
      </main>
    </div>
  );
}
