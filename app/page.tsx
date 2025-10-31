import Navbar from "@/components/site/Navbar";
import Announcement from "@/components/site/Announcement";
import Features from "@/components/site/Features";
import FAQ from "@/components/site/FAQ";
import Team from "@/components/site/Team";
import Footer from "@/components/site/Footer";
import Hero from "@/components/site/Hero";
import TrendingProducts from "@/components/site/TrendingProducts";

export default function Home() {
  return (
    <div className="min-h-screen bg-zinc-50 dark:bg-black">
      <Announcement />
      <Navbar />
      <main className="flex flex-col gap-2">
        <Hero />
        <TrendingProducts />
        <Features />
        <FAQ />
        <Team />
      </main>
      <Footer />
    </div>
  );
}
