import { Separator } from "@/components/ui/separator";
import Link from "next/link";

export default function Footer() {
  const footerLinks = {
    shop: [
      { label: "All Products", href: "/products" },
      { label: "New Arrivals", href: "/new-arrivals" },
      { label: "Best Sellers", href: "/best-sellers" },
      { label: "Special Offers", href: "/offers" },
      { label: "Gift Cards", href: "/gift-cards" },
    ],
    support: [
      { label: "Help Center", href: "/help" },
      { label: "Contact Us", href: "/contact" },
      { label: "Shipping Info", href: "/shipping" },
      { label: "Returns", href: "/returns" },
      { label: "Order Status", href: "/order-status" },
    ],
    company: [
      { label: "About Us", href: "/about" },
      { label: "Careers", href: "/careers" },
      { label: "Blog", href: "/blog" },
      { label: "Press", href: "/press" },
      { label: "Sustainability", href: "/sustainability" },
    ],
    legal: [
      { label: "Terms of Service", href: "/terms" },
      { label: "Privacy Policy", href: "/privacy" },
      { label: "Cookie Policy", href: "/cookies" },
      { label: "Accessibility", href: "/accessibility" },
      { label: "Security", href: "/security" },
    ],
  };

  const whyShopWithUs = [
    {
      title: "Free Shipping",
      description: "On orders over $100",
    },
    {
      title: "Easy Returns",
      description: "30-day return policy",
    },
    {
      title: "Secure Shopping",
      description: "100% secure payment",
    },
    {
      title: "24/7 Support",
      description: "Ready to help anytime",
    },
  ];

  return (
    <footer className="border-t bg-card">
      <div className="mx-auto max-w-7xl px-6 py-12">
        {/* Why Shop With Us section */}
        <div className="grid grid-cols-2 gap-4 md:grid-cols-4 mb-12">
          {whyShopWithUs.map((item, index) => (
            <div
              key={index}
              className="flex flex-col items-center text-center p-4 rounded-lg bg-background/50"
            >
              <h3 className="font-semibold mb-2">{item.title}</h3>
              <p className="text-sm text-muted-foreground">{item.description}</p>
            </div>
          ))}
        </div>

        <Separator className="mb-12" />

        {/* Main footer links */}
        <div className="grid grid-cols-2 gap-8 md:grid-cols-4 mb-12">
          <div>
            <h3 className="font-semibold mb-4">Shop</h3>
            <ul className="space-y-2">
              {footerLinks.shop.map((link) => (
                <li key={link.href}>
                  <Link
                    href={link.href}
                    className="text-sm text-muted-foreground hover:text-foreground transition-colors"
                  >
                    {link.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>
          <div>
            <h3 className="font-semibold mb-4">Support</h3>
            <ul className="space-y-2">
              {footerLinks.support.map((link) => (
                <li key={link.href}>
                  <Link
                    href={link.href}
                    className="text-sm text-muted-foreground hover:text-foreground transition-colors"
                  >
                    {link.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>
          <div>
            <h3 className="font-semibold mb-4">Company</h3>
            <ul className="space-y-2">
              {footerLinks.company.map((link) => (
                <li key={link.href}>
                  <Link
                    href={link.href}
                    className="text-sm text-muted-foreground hover:text-foreground transition-colors"
                  >
                    {link.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>
          <div>
            <h3 className="font-semibold mb-4">Legal</h3>
            <ul className="space-y-2">
              {footerLinks.legal.map((link) => (
                <li key={link.href}>
                  <Link
                    href={link.href}
                    className="text-sm text-muted-foreground hover:text-foreground transition-colors"
                  >
                    {link.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>
        </div>

        {/* Newsletter subscription */}
        <div className="mb-12">
          <h3 className="font-semibold mb-4 text-center">
            Subscribe to our newsletter
          </h3>
          <form className="flex max-w-md mx-auto gap-2">
            <input
              type="email"
              placeholder="Enter your email"
              className="flex-1 min-w-0 px-4 py-2 border rounded-md bg-background"
            />
            <button
              type="submit"
              className="px-4 py-2 bg-primary text-primary-foreground rounded-md hover:bg-primary/90 transition-colors"
            >
              Subscribe
            </button>
          </form>
        </div>

        <Separator className="mb-8" />

        {/* Bottom section */}
        <div className="flex flex-col items-center gap-4">
          <div className="flex gap-4">
            <Link href="/terms" className="text-sm text-muted-foreground hover:text-foreground">
              Terms
            </Link>
            <Link href="/privacy" className="text-sm text-muted-foreground hover:text-foreground">
              Privacy
            </Link>
            <Link href="/cookies" className="text-sm text-muted-foreground hover:text-foreground">
              Cookies
            </Link>
          </div>
          <p className="text-sm text-muted-foreground">
            © {new Date().getFullYear()} Shade & Co. All rights reserved.
          </p>
        </div>
      </div>
    </footer>
  );
}
