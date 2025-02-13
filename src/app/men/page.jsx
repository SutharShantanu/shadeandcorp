// src/app/men/page.jsx
import Link from "next/link";

const categories = [
  {
    name: "Topwear",
    href: "/men/topwear",
    subcategories: [
      { name: "T-Shirts", href: "/men/topwear/t-shirts" },
      { name: "Casual Shirts", href: "/men/topwear/casual-shirts" },
      { name: "Formal Shirts", href: "/men/topwear/formal-shirts" },
      { name: "Sweatshirts", href: "/men/topwear/sweatshirts" },
      { name: "Sweaters", href: "/men/topwear/sweaters" },
      { name: "Jackets", href: "/men/topwear/jackets" },
      { name: "Blazers & Coats", href: "/men/topwear/blazers-coats" },
      { name: "Suits", href: "/men/topwear/suits" },
      { name: "Rain Jackets", href: "/men/topwear/rain-jackets" },
    ],
  },
  {
    name: "Bottomwear",
    href: "/men/bottomwear",
    subcategories: [
      { name: "Jeans", href: "/men/bottomwear/jeans" },
      { name: "Casual Trousers", href: "/men/bottomwear/casual-trousers" },
      { name: "Formal Trousers", href: "/men/bottomwear/formal-trousers" },
      { name: "Shorts", href: "/men/bottomwear/shorts" },
      {
        name: "Track Pants & Joggers",
        href: "/men/bottomwear/track-pants-joggers",
      },
    ],
  },
  {
    name: "Sportswear",
    href: "/men/sportswear",
    subcategories: [
      { name: "Activewear", href: "/men/sportswear/activewear" },
      { name: "Gym Apparel", href: "/men/sportswear/gym-apparel" },
      { name: "Sports T-Shirts", href: "/men/sportswear/sports-t-shirts" },
      { name: "Track Pants", href: "/men/sportswear/track-pants" },
      { name: "Gym Shorts", href: "/men/sportswear/gym-shorts" },
      { name: "Running Shoes", href: "/men/sportswear/running-shoes" },
    ],
  },
  {
    name: "Winterwear",
    href: "/men/winterwear",
    subcategories: [
      { name: "Jackets", href: "/men/winterwear/jackets" },
      { name: "Hoodies", href: "/men/winterwear/hoodies" },
      { name: "Sweaters", href: "/men/winterwear/sweaters" },
      { name: "Thermal Wear", href: "/men/winterwear/thermal-wear" },
      { name: "Woolen Coats", href: "/men/winterwear/woolen-coats" },
      { name: "Puffer Jackets", href: "/men/winterwear/puffer-jackets" },
      { name: "Cardigans", href: "/men/winterwear/cardigans" },
    ],
  },
  {
    name: "Swimwear",
    href: "/men/swimwear",
    subcategories: [
      { name: "Swim Trunks", href: "/men/swimwear/swim-trunks" },
      { name: "Board Shorts", href: "/men/swimwear/board-shorts" },
      { name: "Rash Guards", href: "/men/swimwear/rash-guards" },
    ],
  },
  {
    name: "Sleepwear",
    href: "/men/sleepwear",
    subcategories: [
      { name: "Pajamas", href: "/men/sleepwear/pajamas" },
      { name: "Night Suits", href: "/men/sleepwear/night-suits" },
      { name: "Sleep Shorts", href: "/men/sleepwear/sleep-shorts" },
      { name: "Lounge Pants", href: "/men/sleepwear/lounge-pants" },
    ],
  },
  {
    name: "Footwear",
    href: "/men/footwear",
    subcategories: [
      { name: "Casual Shoes", href: "/men/footwear/casual-shoes" },
      { name: "Sports Shoes", href: "/men/footwear/sports-shoes" },
      { name: "Formal Shoes", href: "/men/footwear/formal-shoes" },
      { name: "Sneakers", href: "/men/footwear/sneakers" },
      {
        name: "Sandals & Floaters",
        href: "/men/footwear/sandals-floaters",
      },
      { name: "Flip Flops", href: "/men/footwear/flip-flops" },
      { name: "Socks", href: "/men/footwear/socks" },
    ],
  },
  {
    name: "Sports Footwear",
    href: "/men/sports-footwear",
    subcategories: [
      { name: "Running Shoes", href: "/men/sports-footwear/running-shoes" },
      {
        name: "Training Shoes",
        href: "/men/sports-footwear/training-shoes",
      },
      {
        name: "Basketball Shoes",
        href: "/men/sports-footwear/basketball-shoes",
      },
      { name: "Hiking Boots", href: "/men/sports-footwear/hiking-boots" },
      {
        name: "Football Cleats",
        href: "/men/sports-footwear/football-cleats",
      },
    ],
  },
  {
    name: "Casual Footwear",
    href: "/men/casual-footwear",
    subcategories: [
      { name: "Loafers", href: "/men/casual-footwear/loafers" },
      { name: "Moccasins", href: "/men/casual-footwear/moccasins" },
      { name: "Espadrilles", href: "/men/casual-footwear/espadrilles" },
      { name: "Slip-Ons", href: "/men/casual-footwear/slip-ons" },
      { name: "Casual Boots", href: "/men/casual-footwear/casual-boots" },
      { name: "Boat Shoes", href: "/men/casual-footwear/boat-shoes" },
    ],
  },
  {
    name: "Rainwear Footwear",
    href: "/men/rainwear-footwear",
    subcategories: [
      {
        name: "Waterproof Boots",
        href: "/men/rainwear-footwear/waterproof-boots",
      },
      {
        name: "Rubber Sandals",
        href: "/men/rainwear-footwear/rubber-sandals",
      },
      { name: "Rain Shoes", href: "/men/rainwear-footwear/rain-shoes" },
    ],
  },
  {
    name: "Fragrances",
    href: "/men/fragrances",
    subcategories: [
      { name: "Perfumes", href: "/men/fragrances/perfumes" },
      { name: "Body Sprays", href: "/men/fragrances/body-sprays" },
      { name: "Deodorants", href: "/men/fragrances/deodorants" },
      { name: "Aftershave", href: "/men/fragrances/aftershave" },
      { name: "Cologne", href: "/men/fragrances/cologne" },
    ],
  },
  {
    name: "Watches",
    href: "/men/watches",
    subcategories: [
      { name: "Smart Watches", href: "/men/watches/smart-watches" },
      { name: "Analog Watches", href: "/men/watches/analog-watches" },
      { name: "Digital Watches", href: "/men/watches/digital-watches" },
    ],
  },
  {
    name: "Grooming",
    href: "/men/grooming",
    subcategories: [
      { name: "Shaving Kits", href: "/men/grooming/shaving-kits" },
      { name: "Beard Oils", href: "/men/grooming/beard-oils" },
      { name: "Beard Balms", href: "/men/grooming/beard-balms" },
      { name: "Trimmers", href: "/men/grooming/trimmers" },
      { name: "Aftershave Balms", href: "/men/grooming/aftershave-balms" },
    ],
  },
];

const MenCategories = () => {
  return (
    <div className="p-6">
      <h1 className="text-3xl font-bold mb-4">Men's Categories</h1>
      <ul className="space-y-2">
        {categories.map((slug) => (
          <li key={slug}>
            <Link
              href={`/men/${slug}`}
              className="text-primary-default hover:underline"
            >
              {slug.charAt(0).toUpperCase() + slug.slice(1)}
            </Link>
          </li>
        ))}
      </ul>
    </div>
  );
};

export default MenCategories;
