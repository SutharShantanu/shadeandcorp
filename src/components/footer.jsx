"use client";

import { motion } from "framer-motion";
import Link from "next/link";
import { Button } from "./ui/button";
import { Input } from "./ui/input";
import { Separator } from "./ui/separator";
import {
  Facebook,
  Instagram,
  Linkedin,
  Twitter,
  Youtube,
  ArrowUpRight,
  Send,
} from "lucide-react";

const FooterSection = ({ title, links }) => {
  return (
    <div>
      <h3 className="text-lg font-semibold mb-4">{title}</h3>
      <ul className="gap-y-4 flex flex-col text-muted-foreground">
        {links.map((link, index) => (
          <li key={index}>
            <Link
              href={link.href}
              className="hover:text-foreground text-small flex items-center group"
              aria-label={link.label}
            >
              {link.label}
              <ArrowUpRight
                size={14}
                className="ml-1 opacity-0 group-hover:opacity-100 transition-opacity"
              />
            </Link>
          </li>
        ))}
      </ul>
    </div>
  );
};

const SocialIcon = ({ href, icon: Icon, label }) => {
  return (
    <Link
      href={href}
      target="_blank"
      rel="noopener noreferrer"
      aria-label={label}
    >
      <Button
        variant="outline"
        size="icon"
        className="text-foreground border-border hover:bg-secondary rounded-full hover:bg-foreground hover:text-background hover:scale-95 transition-all ease-in-out group"
      >
        <Icon
          size={32}
          strokeWidth={1.75}
          absoluteStrokeWidth
          className="group-hover:rotate-6 transition-all ease-in-out"
        />
      </Button>
    </Link>
  );
};

const Footer = () => {
  const fadeIn = {
    hidden: { opacity: 0 },
    visible: { opacity: 1, transition: { duration: 1 } },
  };

  const sections = [
    {
      title: "Shop",
      links: [
        { href: "/men", label: "Men's Clothing" },
        { href: "/women", label: "Women's Clothing" },
        { href: "/accessories", label: "Accessories" },
        { href: "/new-arrivals", label: "New Arrivals" },
        { href: "/sale", label: "Sale" },
      ],
    },
    {
      title: "Support",
      links: [
        { href: "/shipping-info", label: "Shipping Info" },
        { href: "/returns-exchanges", label: "Returns & Exchanges" },
        { href: "/size-guide", label: "Size Guide" },
        { href: "/faq", label: "FAQ" },
        { href: "/contact-us", label: "Contact Us" },
      ],
    },
    {
      title: "Company",
      links: [
        { href: "/about-us", label: "About Us" },
        { href: "/careers", label: "Careers" },
        { href: "/sustainability", label: "Sustainability" },
        { href: "/press", label: "Press" },
        { href: "/affiliates", label: "Affiliates" },
      ],
    },
    {
      title: "Legal",
      links: [
        { href: "/privacy-policy", label: "Privacy Policy" },
        { href: "/terms-of-service", label: "Terms of Service" },
        { href: "/cookie-policy", label: "Cookie Policy" },
        { href: "/refund-policy", label: "Refund Policy" },
        { href: "/code-of-conduct", label: "Code of Conduct" },
      ],
    },
  ];

  const socialLinks = [
    {
      href: "https://instagram.com/shadeandcrop",
      icon: Instagram,
      label: "Instagram",
    },
    {
      href: "https://facebook.com/shadeandcrop",
      icon: Facebook,
      label: "Facebook",
    },
    {
      href: "https://twitter.com/shadeandcrop",
      icon: Twitter,
      label: "Twitter",
    },
    {
      href: "https://youtube.com/shadeandcrop",
      icon: Youtube,
      label: "YouTube",
    },
    {
      href: "https://linkedin.com/company/shadeandcrop",
      icon: Linkedin,
      label: "LinkedIn",
    },
  ];

  return (
    <motion.footer
      initial="hidden"
      whileInView="visible"
      variants={fadeIn}
      className="bg-background text-foreground py-10 border-t border-border"
    >
      <div className="container mx-auto">
        <div className=" p-6 bg-card border border-border rounded-lg">
          <div className="flex flex-col md:flex-row justify-between items-center">
            <div className="text-center md:text-left">
              <h3 className="text-xl font-semibold mb-2">Shade and Crop</h3>
              <p className="text-muted-foreground">
                Elevate your style with our curated collection of modern
                clothing and accessories.
              </p>
              <Button className="mt-4 md:mt-0 bg-primary-default text-primary-foreground hover:bg-primary-default/90">
                <Link href="/shop" aria-label="Shop Now">
                  Shop Now
                </Link>
              </Button>
            </div>
            <div>
              <h3 className="text-lg font-semibold mb-4">Follow Us</h3>
              <div className="flex gap-4">
                {socialLinks.map((link, index) => (
                  <SocialIcon
                    key={index}
                    href={link.href}
                    icon={link.icon}
                    label={link.label}
                  />
                ))}
              </div>
            </div>
          </div>
        </div>

        <Separator orientation="horizontal" className="my-6 w-full" />

        <div className="grid grid-cols-1 md:grid-cols-5 gap-x-4">
          {sections.map((section, index) => (
            <FooterSection
              key={index}
              title={section.title}
              links={section.links}
            />
          ))}
          <div className="">
            <h3 className="text-lg font-semibold mb-4">
              Subscribe to our Newsletter
            </h3>
            <div className="flex justify-between gap-1">
              <Input
                type="email"
                placeholder="Enter your email"
                className="bg-card text-card-foreground border-border"
                aria-label="Enter your email"
              />
              <Button
                className="bg-primary-default text-primary-foreground hover:bg-primary-default/90 w-fit group"
                aria-label="Subscribe"
              >
                Subscribe
                <Send
                  size={16}
                  className="group-hover:rotate-45 transition-all ease-in-out"
                />
              </Button>
            </div>
          </div>
        </div>
        <div className="border-t border-border mt-8 pt-8 text-center text-muted-foreground">
          <p>© 2024 Shade and Crop. All rights reserved.</p>
        </div>
      </div>
    </motion.footer>
  );
};

export default Footer;
