import Hero from "@/components/site/Hero";
import ProductCategories from "@/components/site/ProductCategories";
import TrendingProducts from "@/components/site/TrendingProducts";
import NewArrivals from "@/components/site/NewArrivals";
import Features from "@/components/site/Features";
import FAQ from "@/components/site/FAQ";

export default function Home() {
  return (
    <div className="min-h-screen bg-white dark:bg-black text-gray-900 dark:text-gray-100 overflow-hidden">
      <main className="flex flex-col gap-12 md:gap-20">
        <Hero />
        <ProductCategories />
        <TrendingProducts />
        <NewArrivals />
        <Features />
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 w-full">
          <FAQ />
        </div>
      </main>
    </div>
  );
}

