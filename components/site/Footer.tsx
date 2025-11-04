"use client";

import { Separator } from "@/components/ui/separator";
import Image from "next/image";
import Link from "next/link";
import { z } from "zod";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { toast } from "sonner";
import { ArrowUpRight } from "lucide-react";

const formSchema = z.object({
  email: z.string().email("Please enter a valid email address"),
});

export default function Footer() {
  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: { email: "" },
  });

  const onSubmit = (values: z.infer<typeof formSchema>) => {
    // Simulate newsletter API call
    toast.success(`Subscribed successfully with ${values.email}`);
    form.reset();
  };

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
      icon: "https://cdn-icons-png.flaticon.com/512/726/726455.png",
      title: "Free Shipping",
      description: "On orders over $100",
    },
    {
      icon: "https://cdn-icons-png.flaticon.com/512/11153/11153363.png",
      title: "Easy Returns",
      description: "30-day return policy",
    },
    {
      icon: "https://cdn-icons-png.flaticon.com/512/1161/1161388.png",
      title: "Secure Shopping",
      description: "100% secure payment",
    },
    {
      icon: "https://cdn-icons-png.flaticon.com/512/8743/8743949.png",
      title: "24/7 Support",
      description: "Ready to help anytime",
    },
  ];

  return (
    <footer className="border-t bg-card text-muted-foreground">
      <div className="mx-auto max-w-7xl px-6 py-12">
        {/* WHY SHOP WITH US */}
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-6">
          {whyShopWithUs.map((item, i) => (
            <div
              key={i}
              className="group flex flex-col items-center text-center p-4 rounded-lg hover:bg-gray-50 transition-all ease-in-out"
            >
              <Image
                src={item.icon}
                alt={item.title}
                width={100}
                height={100}
                className="mb-3 transition-all h-10 w-10 group-hover:scale-110"
              />
              <h3 className="font-semibold mb-1 text-foreground group-hover:text-primary transition-all">
                {item.title}
              </h3>
              <p className="text-sm">{item.description}</p>
            </div>
          ))}
        </div>

        <Separator className="my-4" />

        <div className="grid grid-cols-1 md:grid-cols-5 gap-8 mb-12">
          <div className="md:col-span-3 grid grid-cols-2 sm:grid-cols-4 gap-8">
            {Object.entries(footerLinks).map(([section, links]) => (
              <div key={section}>
                <h3 className="font-semibold mb-4 text-foreground capitalize">
                  {section}
                </h3>
                <ul className="space-y-2">
                  {links.map((link) => (
                    <li key={link.href}>
                      <Link
                        href={link.href}
                        className="group flex items-center gap-1 text-sm text-muted-foreground hover:underline underline-offset-2 hover:text-foreground transition-all"
                      >
                        <span>{link.label}</span>
                        <ArrowUpRight
                          className="opacity-0 -translate-x-1 transition-all duration-300 ease-out group-hover:opacity-100 group-hover:translate-x-0"
                          strokeWidth={1}
                          size={14}
                        />
                      </Link>
                    </li>
                  ))}
                </ul>
              </div>
            ))}
          </div>

          {/* Newsletter */}
          <div className="md:col-span-2 flex flex-col gap-4 text-left">
            <h3 className="font-semibold text-foreground">
              Subscribe to our newsletter
            </h3>
            <p className="text-sm">
              Stay updated on new launches, offers, and style inspiration.
            </p>

            <Form {...form}>
              <form
                onSubmit={form.handleSubmit(onSubmit)}
                className="flex flex-col sm:flex-row gap-2"
              >
                <FormField
                  control={form.control}
                  name="email"
                  render={({ field }) => (
                    <FormItem className="flex-1">
                      <FormControl>
                        <Input
                          placeholder="Enter your email"
                          className="bg-background text-sm"
                          {...field}
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                <Button type="submit" className="sm:w-auto">
                  Subscribe
                </Button>
              </form>
            </Form>
          </div>
        </div>

        <Separator className="mb-8" />

        {/* FOOTER BOTTOM */}
        <div className="flex flex-col sm:flex-row sm:justify-between items-center gap-4 text-sm">
          <div className="flex space-x-4">
            {["Terms", "Privacy", "Cookies", "Accessibility"].map((item) => (
              <Link
                key={item}
                href={`/${item.toLowerCase()}`}
                className="group flex items-center text-xs gap-1 text-muted-foreground hover:text-foreground transition-all hover:underline underline-offset-2"
              >
                <span>{item}</span>
                <ArrowUpRight
                  className="opacity-0 -translate-x-1 transition-all ease-in-out group-hover:opacity-100 group-hover:translate-x-0"
                  strokeWidth={1}
                  size={14}
                />
              </Link>
            ))}
          </div>
          <p>© {new Date().getFullYear()} Shade & Co. All rights reserved.</p>
        </div>
      </div>
    </footer>
  );
}
