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
  ArrowRight,
  Mail,
} from "lucide-react";
import { useState } from "react";

const FooterSection = ({ title, links }) => {
  return (
    <motion.div>
      <h3 className="text-description font-semibold mb-4">{title}</h3>
      <ul className="gap-4 flex flex-col text-muted-foreground">
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
    </motion.div>
  );
};

const SocialIcon = ({ href, icon: Icon, label }) => {
  return (
    <Link
      href={href}
      target="_blank"
      rel="noopener noreferrer"
      aria-label={label}
      className="group"
    >
      <Icon
        size={24}
        strokeWidth={1}
        className="transition-all ease-in-out hover:text-primary-foreground hover:fill-primary-default group-hover:scale-105 "
      />
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

  const currentYear = new Date().getFullYear();

  const [isTyping, setIsTyping] = useState(false);

  const handleInputChange = (e) => {
    setIsTyping(e.target.value.length > 0);
  };

  return (
    <motion.footer
      initial="hidden"
      whileInView="visible"
      variants={fadeIn}
      className="w-full py-10 border-t border-border"
    >
      <motion.div className="container mx-auto w-[90%] lg:w-full">
        <motion.div className=" p-6 bg-card border border-border rounded-xs">
          <motion.div className="flex flex-col md:flex-row justify-between items-start">
            <motion.div className="text-left">
              <h3 className="text-heading font-forum font-semibold mb-2">Shade and Crop</h3>
              <p className="text-muted-foreground text-small">
                Elevate your style with our curated collection of modern
                clothing and accessories.
              </p>
            </motion.div>
          </motion.div>
        </motion.div>
        <Separator orientation="horizontal" className="my-6 w-full" />
        <div className="grid grid-cols-2 md:grid-cols-6 gap-4">
          {sections.map((section, index) => (
            <FooterSection
              key={index}
              title={section.title}
              links={section.links}
            />
          ))}
          <motion.div className="col-span-2 flex flex-col gap-4">
            <motion.div className="">
              <h3 className="text-description font-semibold mb-4">
                Subscribe to our Newsletter
              </h3>
              <div className="flex justify-between gap-1">
                <motion.div className="flex items-center gap-2 px-2 rounded-xs bg-primary-foreground border border-border w-full">
                  {!isTyping && (
                    <Mail size={18} className="text-muted-foreground" strokeWidth={1} />
                  )}
                  <Input
                    type="email"
                    placeholder=" Enter your email"
                    className="border-none bg-primary-foreground px-0"
                    aria-label="Enter your email"
                    onChange={handleInputChange}
                  />
                </motion.div>
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
            </motion.div>
            <motion.div className="flex flex-col gap-6 justify-between">
              <motion.div className="flex items-center gap-2">
                <h3 className="text-description font-semibold select-none">Follow Us</h3>
              </motion.div>
              <motion.div className="flex gap-4 items-baseline">
                {socialLinks.map((link, index) => (
                  <SocialIcon
                    key={index}
                    href={link.href}
                    icon={link.icon}
                    label={link.label}
                  />
                ))}
              </motion.div>
            </motion.div>
          </motion.div>
        </div>
        <div className="border-t border-border mt-6 pt-8 text-center text-muted-foreground">
          <p>© {currentYear} Shade and Crop. All rights reserved.</p>
        </div>
      </motion.div>
    </motion.footer>
  );
};

export default Footer;
