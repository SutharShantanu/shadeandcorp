"use client";

import React from "react";
import { motion } from "framer-motion";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import {
  Truck,
  RefreshCw,
  Shield,
  Headphones,
  Award,
  Globe,
  Clock,
  HeartHandshake,
} from "lucide-react";

interface FeatureItem {
  icon: React.ReactNode;
  title: string;
  description: string;
  badge?: string;
}

const features: FeatureItem[] = [
  {
    icon: <Truck className="w-8 h-8" />,
    title: "Free & Fast Shipping",
    description:
      "Free delivery on orders over $50. Get your orders in 2-4 business days with express options available.",
    badge: "MOST POPULAR",
  },
  {
    icon: <RefreshCw className="w-8 h-8" />,
    title: "Easy Returns",
    description:
      "30-day hassle-free returns. No questions asked. We make returns simple and straightforward.",
  },
  {
    icon: <Shield className="w-8 h-8" />,
    title: "Secure Payments",
    description:
      "Your payments are 100% secure. We use industry-standard SSL encryption to protect your data.",
  },
  {
    icon: <Headphones className="w-8 h-8" />,
    title: "24/7 Support",
    description:
      "Our customer support team is available round the clock to help with any questions or concerns.",
  },
  {
    icon: <Award className="w-8 h-8" />,
    title: "Quality Guaranteed",
    description:
      "We work with trusted brands and suppliers to ensure you receive only the highest quality products.",
  },
  {
    icon: <Globe className="w-8 h-8" />,
    title: "Worldwide Delivery",
    description:
      "We ship to over 100 countries worldwide. International shipping options available.",
  },
  {
    icon: <Clock className="w-8 h-8" />,
    title: "Easy Exchanges",
    description:
      "Wrong size? Changed your mind? We offer quick and easy exchanges within 30 days of purchase.",
  },
  {
    icon: <HeartHandshake className="w-8 h-8" />,
    title: "Satisfaction Guarantee",
    description:
      "Not happy with your purchase? We offer a 100% satisfaction guarantee or your money back.",
  },
];

const FeatureCard: React.FC<{ feature: FeatureItem; index: number }> = ({
  feature,
  index,
}) => {
  return (
    <motion.div
      initial={{ opacity: 0, y: 30 }}
      whileInView={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.6, delay: index * 0.1 }}
      viewport={{ once: true }}
    >
      <Card
        className={`h-full transition-all duration-300 hover:shadow-lg rounded-2xl overflow-hidden group border`}
      >
        <CardContent className="p-6 text-center">
          {feature.badge && (
            <Badge
              variant="outline"
              className="mb-4 px-3 py-1 text-xs font-bold"
            >
              {feature.badge}
            </Badge>
          )}

          <div
            className={`inline-flex items-center justify-center w-16 h-16 rounded-2xl mb-4 transition-all group-hover:scale-110 `}
          >
            {feature.icon}
          </div>

          {/* Content */}
          <h3 className={`font-bold text-lg mb-3 `}>{feature.title}</h3>
          <p className={`text-sm leading-relaxed `}>{feature.description}</p>
        </CardContent>
      </Card>
    </motion.div>
  );
};

export default function Features() {
  return (
    <section className="py-16 md:py-24 bg-linear-to-b from-gray-50 to-white">
      <div className="max-w-7xl mx-auto ">
        {/* Section Header */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          viewport={{ once: true }}
          className="text-center mb-16"
        >
          <Badge
            variant="outline"
            className="mb-4 px-4 py-1 text-sm font-semibold border-gray-300"
          >
            WHY CHOOSE US
          </Badge>
          <h2 className="text-3xl md:text-5xl font-bold text-gray-900 mb-4 tracking-tight">
            Why Shop With Us
          </h2>
          <p className="text-lg md:text-xl text-gray-600 max-w-2xl mx-auto leading-relaxed">
            We&apos;re committed to providing you with the best shopping
            experience, from seamless delivery to exceptional customer service.
          </p>
        </motion.div>

        {/* Features Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          {features.map((feature, index) => (
            <FeatureCard key={feature.title} feature={feature} index={index} />
          ))}
        </div>

        {/* Stats Section - Inspired by Myntra/Amazon */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.4 }}
          viewport={{ once: true }}
          className="mt-20 bg-black rounded-3xl p-8 md:p-12 text-white"
        >
          <div className="grid grid-cols-2 md:grid-cols-4 gap-8 text-center">
            <div>
              <div className="text-3xl md:text-4xl font-bold mb-2">1M+</div>
              <div className="text-sm text-gray-300">Happy Customers</div>
            </div>
            <div>
              <div className="text-3xl md:text-4xl font-bold mb-2">50K+</div>
              <div className="text-sm text-gray-300">Products Available</div>
            </div>
            <div>
              <div className="text-3xl md:text-4xl font-bold mb-2">100+</div>
              <div className="text-sm text-gray-300">Brands Partnered</div>
            </div>
            <div>
              <div className="text-3xl md:text-4xl font-bold mb-2">24/7</div>
              <div className="text-sm text-gray-300">Customer Support</div>
            </div>
          </div>
        </motion.div>

        {/* Trust Badges - Inspired by H&M */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.6 }}
          viewport={{ once: true }}
          className="mt-12 flex flex-wrap justify-center items-center gap-8 md:gap-12"
        >
          <div className="text-center">
            <div className="w-12 h-12 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-2">
              <Shield className="w-6 h-6 text-green-600" />
            </div>
            <span className="text-sm font-medium text-gray-600">
              Secure Payment
            </span>
          </div>
          <div className="text-center">
            <div className="w-12 h-12 bg-blue-100 rounded-full flex items-center justify-center mx-auto mb-2">
              <Award className="w-6 h-6 text-blue-600" />
            </div>
            <span className="text-sm font-medium text-gray-600">
              Quality Guarantee
            </span>
          </div>
          <div className="text-center">
            <div className="w-12 h-12 bg-purple-100 rounded-full flex items-center justify-center mx-auto mb-2">
              <Globe className="w-6 h-6 text-purple-600" />
            </div>
            <span className="text-sm font-medium text-gray-600">
              Worldwide Shipping
            </span>
          </div>
          <div className="text-center">
            <div className="w-12 h-12 bg-orange-100 rounded-full flex items-center justify-center mx-auto mb-2">
              <RefreshCw className="w-6 h-6 text-orange-600" />
            </div>
            <span className="text-sm font-medium text-gray-600">
              Easy Returns
            </span>
          </div>
        </motion.div>
      </div>
    </section>
  );
}
