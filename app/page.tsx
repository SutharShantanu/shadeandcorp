import Announcement from "@/components/site/Announcement";
import Features from "@/components/site/Features";
import FAQ from "@/components/site/FAQ";
import Team from "@/components/site/Team";
import Hero from "@/components/site/Hero";
import TrendingProducts from "@/components/site/TrendingProducts";
import ProductCategories from "@/components/site/ProductCategories";
import NewArrivals from "@/components/site/NewArrivals";
// import BestSellers from "@/components/site/BestSellers";
// import BrandShowcase from "@/components/site/BrandShowcase";
// import Testimonials from "@/components/site/Testimonials";
// import Newsletter from "@/components/site/Newsletter";
// import Lookbook from "@/components/site/Lookbook";

export default function Home() {
  return (
    <div className="min-h-screen bg-zinc-50 dark:bg-black">
      <Announcement />
      <div className="max-w-7xl mx-auto">
        <main className="flex flex-col gap-8 md:gap-12">
          {/* Section 1: Hero Banner */}
          <Hero />

          {/* Section 2: Product Categories */}
          <ProductCategories />

          {/* Section 3: New Arrivals */}
          <NewArrivals />

          {/* Section 4: Trending Products */}
          <TrendingProducts />

          {/* Section 5: Best Sellers */}
          {/* <BestSellers /> */}

          {/* Section 6: Brand Showcase */}
          {/* <BrandShowcase /> */}

          {/* Section 7: Lookbook/Inspiration */}
          {/* <Lookbook /> */}

          {/* Section 8: Features/USP */}
          <Features />

          {/* Section 9: Testimonials */}
          {/* <Testimonials /> */}

          {/* Section 10: FAQ */}
          <FAQ />

          {/* Section 11: Team (Consider removing or making smaller) */}
          <Team />

          {/* Section 12: Newsletter */}
          {/* <Newsletter /> */}
        </main>
      </div>
    </div>
  );
}
