"use client";

import Banner from "@/components/homepage/banner";
import { Button } from "@/components/ui/button";
import { motion } from "framer-motion";
import { useState } from "react";
import {
  AccordionItem,
  AccordionTrigger,
  Accordion,
  AccordionContent,
} from "@/components/ui/accordion";
import { Spinner } from "@/components/ui/spinner";
import Image from "next/image";
import Marquee from "react-fast-marquee";
import { Card, CardContent } from "@/components/ui/card";
import { Avatar, AvatarImage, AvatarFallback } from "@/components/ui/avatar";
import { Carousel, CarouselContent, CarouselItem, CarouselNext, CarouselPrevious } from "@/components/ui/carousel";
import { Quote, Star, StarHalf } from "lucide-react";
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger, TooltipArrow } from "@/components/ui/tooltip";


const Homepage = () => {
  return (
    <div>
      <HeroSection />
      <FeaturedProducts />
      <Banner />
      <PartnersSection />
      <TestimonialSection />
      <FAQ />
      <NewsletterSignup />
    </div>
  );
};

export default Homepage;

const PartnersSection = () => {
  const partnerLogos = [
    { name: "Google", logo: "https://www.vectorlogo.zone/logos/google/google-ar21.svg" },
    { name: "Vercel", logo: "https://www.vectorlogo.zone/logos/vercel/vercel-ar21.svg" },
    { name: "Github", logo: "https://www.vectorlogo.zone/logos/github/github-ar21.svg" },
    { name: "Linkedin", logo: "https://www.vectorlogo.zone/logos/linkedin/linkedin-ar21.svg" },
    { name: "Microsoft", logo: "https://www.vectorlogo.zone/logos/microsoft/microsoft-ar21.svg" },
    { name: "Apple", logo: "https://www.vectorlogo.zone/logos/apple/apple-ar21.svg" },
    { name: "Tesla", logo: "https://www.vectorlogo.zone/logos/tesla/tesla-ar21.svg" },
    { name: "Amazon", logo: "https://www.vectorlogo.zone/logos/amazon/amazon-ar21.svg" },
    { name: "Facebook", logo: "https://www.vectorlogo.zone/logos/facebook/facebook-ar21.svg" },
    { name: "Twitter", logo: "https://www.vectorlogo.zone/logos/twitter/twitter-ar21.svg" },
    { name: "Netflix", logo: "https://www.vectorlogo.zone/logos/netflix/netflix-ar21.svg" },
    { name: "Spotify", logo: "https://www.vectorlogo.zone/logos/spotify/spotify-ar21.svg" },
  ];

  return (
    <motion.div className="container mx-auto my-4">
      <p className="text-center text-heading font-forum mb-6">Our Partners</p>
      <Marquee pauseOnHover={true} gradient={true} gradientColor="#f3f4f6" gradientWidth={250} speed={40}>
        {partnerLogos.map((brand, index) => (
          <Image
            key={index}
            src={brand.logo}
            alt={brand.name}
            width={80}
            height={50}
            className="h-12 w-auto px-8 object-contain"
          />
        ))}
      </Marquee>
    </motion.div>
  );
};

const FAQ = () => {
  const faqs = [
    {
      question: "What sizes do you offer?",
      answer:
        "We offer sizes ranging from XS to XXL. Please refer to our size guide for exact measurements.",
    },
    {
      question: "How can I track my order?",
      answer:
        "Once your order is shipped, you'll receive a tracking link via email to monitor its delivery status.",
    },
    {
      question: "What is your return policy?",
      answer:
        "We accept returns within 30 days of purchase. Items must be unworn and in original packaging.",
    },
    {
      question: "Do you offer international shipping?",
      answer:
        "Yes, we ship worldwide. Shipping costs and delivery times vary depending on the destination.",
    },
    {
      question: "How do I care for my clothing?",
      answer:
        "Each item has specific care instructions on the product page and on the clothing tag.",
    },
    {
      question: "Can I modify or cancel my order after placing it?",
      answer:
        "Orders can be modified or canceled within 24 hours of placement. Contact our support team for assistance.",
    },
    {
      question: "What payment methods do you accept?",
      answer:
        "We accept all major credit cards, PayPal, and Apple Pay for secure transactions.",
    },
    {
      question: "Do you have a loyalty program?",
      answer:
        "Yes! Sign up for our rewards program to earn points on every purchase and redeem discounts.",
    },
    {
      question: "Are your products sustainable?",
      answer:
        "We prioritize sustainability by using eco-friendly materials and ethical production practices.",
    },
    {
      question: "How long does shipping take?",
      answer:
        "Shipping times vary by location, but domestic orders typically arrive within 3-7 business days.",
    },
    {
      question: "Do you offer gift cards?",
      answer:
        "Yes, we offer digital gift cards in various denominations that can be redeemed on our website.",
    },
  ];

  const [showAll, setShowAll] = useState(false);
  const [loading, setLoading] = useState(false);

  const handleShowMore = () => {
    setLoading(true);
    setTimeout(() => {
      setShowAll(!showAll);
      setLoading(false);
    }, 1000);
  };

  const visibleFaqs = showAll ? faqs : faqs.slice(0, 10);

  return (
    <motion.div className="container mx-auto my-4">
      <p className="text-center text-heading font-forum mb-6">
        Common Questions & Answers
      </p>
      <p className="text-center text-description text-muted-foreground mb-8">
        Find out all the essential details about our clothing brand and how we
        can serve your needs.
      </p>
      {visibleFaqs.map((faq, index) => (
        <Accordion type="single" collapsible key={index}>
          <AccordionItem
            value={`faq-${index}`}
            className="group hover:bg-primary-foreground/50 transition-all ease-in-out px-4 hover:rounded-xs border-b"
          >
            <AccordionTrigger className="text-default-primary font-subheading group-hover:no-underline flex items-center gap-2">
              {faq.question}
            </AccordionTrigger>
            <AccordionContent className="text-default-primary text-small">
              {faq.answer}
            </AccordionContent>
          </AccordionItem>
        </Accordion>
      ))}
      {faqs.length > 10 && (
        <Button
          onClick={handleShowMore}
          className="mt-6 w-fit mx-auto bg-primary-default text-primary-foreground rounded-xs text-center flex items-center gap-2"
          disabled={loading}
        >
          {loading ? <Spinner /> : null}
          {showAll ? "Show Less" : "Show More"}
        </Button>
      )}
    </motion.div>
  );
};

const HeroSection = () => (
  <motion.div className="text-center py-16 bg-gradient-to-r from-gray-900 to-gray-700 text-white">
    <h1 className="text-4xl font-bold mb-4">Discover Exclusive Fashion</h1>
    <p className="text-lg mb-6">Shop the latest trends with unbeatable quality.</p>
    <Button className="bg-primary-default px-6 py-2 text-lg rounded-md">Shop Now</Button>
  </motion.div>
);

const FeaturedProducts = () => {
  const products = [
    { name: "Classic Tee", image: "/images/tee.jpg", price: "$25" },
    { name: "Denim Jacket", image: "/images/jacket.jpg", price: "$60" },
    { name: "Sneakers", image: "/images/sneakers.jpg", price: "$80" },
  ];

  return (
    <motion.div className="container mx-auto my-12">
      <h2 className="text-center text-3xl font-bold mb-6">Best Sellers</h2>
      <motion.div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {products.map((product, index) => (
          <motion.div key={index} className="border p-4 rounded-md shadow-lg">
            <Image src={product.image} alt={product.name} width={200} height={200} className="w-full rounded-md" />
            <h3 className="text-lg font-semibold mt-4">{product.name}</h3>
            <p className="text-primary-default font-bold">{product.price}</p>
          </motion.div>
        ))}
      </motion.div>
    </motion.div>
  );
};

const NewsletterSignup = () => {
  return (
    <motion.div className="text-center py-12 bg-gray-900 text-white">
      <h2 className="text-2xl font-bold mb-4">Join Our Newsletter</h2>
      <p className="mb-6">Stay updated on exclusive deals and new arrivals.</p>
      <motion.div className="flex justify-center">
        <input type="email" placeholder="Enter your email" className="p-2 w-64 rounded-l-md text-black" />
        <Button className="bg-primary-default px-4 py-2 rounded-r-md">Subscribe</Button>
      </motion.div>
    </motion.div>
  );
};

const TestimonialSection = () => {

  const testimonials = [
    {
      name: "John Doe",
      role: "Verified Buyer",
      image: "https://picsum.photos/id/64/200/300",
      feedback: "This product exceeded my expectations! The quality is top-notch, and the delivery was super fast.",
      rating: 5,
      location: "San Francisco, CA"
    },
    {
      name: "Sarah Smith",
      role: "Fashion Enthusiast",
      image: "https://picsum.photos/id/64/200/300",
      feedback: "The design is stunning, and the material feels premium. Worth every penny!",
      rating: 5,
      location: "New York, NY"
    },
    {
      name: "Alex Johnson",
      role: "Tech Reviewer",
      image: "https://picsum.photos/id/64/200/300",
      feedback: "Fantastic product with great features. I use it daily and absolutely love it!",
      rating: 5,
      location: "Los Angeles, CA"
    },
    {
      name: "Emily Davis",
      role: "Frequent Shopper",
      image: "https://picsum.photos/id/64/200/300",
      feedback: "Super comfortable and stylish. I got so many compliments already!",
      rating: 5,
      location: "Austin, TX"
    },
    {
      name: "Michael Brown",
      role: "Gadget Lover",
      image: "https://picsum.photos/id/64/200/300",
      feedback: "Impressive quality and great functionality. A must-have for anyone looking for reliability.",
      rating: 4,
      location: "Seattle, WA"
    },
    {
      name: "Jessica Wilson",
      role: "Graphic Designer",
      image: "https://picsum.photos/id/64/200/300",
      feedback: "The packaging was so elegant, and the product itself is even better. Highly recommend!",
      rating: 5,
      location: "Chicago, IL"
    },
    {
      name: "David Lee",
      role: "Home Essentials Shopper",
      image: "https://picsum.photos/id/64/200/300",
      feedback: "It’s exactly as described. The quality is great, and I’m very happy with my purchase.",
      rating: 4,
      location: "Boston, MA"
    },
    {
      name: "Sophia Martinez",
      role: "Beauty Enthusiast",
      image: "https://picsum.photos/id/64/200/300",
      feedback: "Absolutely love it! The colors are vibrant, and the product feels luxurious.",
      rating: 5,
      location: "Miami, FL"
    },
    {
      name: "James Anderson",
      role: "Outdoor Enthusiast",
      image: "https://picsum.photos/id/64/200/300",
      feedback: "Perfect for my needs! Durable, stylish, and reasonably priced.",
      rating: 5,
      location: "Denver, CO"
    },
    {
      name: "Olivia Taylor",
      role: "Lifestyle Blogger",
      image: "https://picsum.photos/id/64/200/300",
      feedback: "This product has changed my daily routine for the better. I’m beyond satisfied!",
      rating: 5,
      location: "Atlanta, GA"
    }
  ];


  return (
    <div className="w-full py-12 bg-gray-100 dark:bg-gray-900">
      <div className="max-w-4xl mx-auto text-center">
        <h2 className="text-3xl font-bold text-gray-900 dark:text-white">What Our Clients Say</h2>
        <p className="text-gray-600 dark:text-gray-400 mt-2">Real feedback from our happy customers.</p>
      </div>

      <div className="mt-10 container ml-auto mr-auto">
        <Carousel>
          <CarouselContent>
            {testimonials.map((testimonial, index) => {
              const fullStars = Math.floor(testimonial.rating);
              const hasHalfStar = testimonial.rating % 1 !== 0;

              return (
                <CarouselItem key={index} className="flex justify-center md:basis-1/2 lg:basis-1/3 xl:basis-1/4">
                  <Card className="w-full ">
                    <CardContent className="flex flex-col justify-between gap-8 items-center text-center p-4 h-full">
                      <p className="text-subheading text-muted-foreground font-description">
                        <Quote size={14} className="rotate-180 inline mr-3 text-primary-default fill-primary-default" />
                        {testimonial.feedback}
                        <Quote size={14} className="inline ml-3 text-primary-default fill-primary-default" />
                      </p>
                      <motion.div className="flex items-center w-full justify-between">
                        <motion.div className="flex items-center gap-2 select-none">
                          <Avatar className=" bg-muted-foreground " size="xs">
                            <AvatarImage src={testimonial.image} alt={testimonial.name} />
                            <AvatarFallback>{testimonial.name[0]}</AvatarFallback>
                          </Avatar>
                          <motion.div className=" text-left">
                            <p className="text-description font-description">{testimonial.name}</p>
                            <p className="text-xs text-muted-foreground">{testimonial.role}</p>
                            <p className="text-xs text-muted-foreground">{testimonial.location}</p>
                          </motion.div>
                        </motion.div>
                        <TooltipProvider>
                          <Tooltip>
                            <TooltipTrigger>
                              <motion.div className="flex">
                                {[...Array(fullStars)].map((_, i) => (
                                  <Star strokeWidth={.5} key={`full-${i}`} className="w-5 h-5 text-rating-default fill-rating-default" />
                                ))}
                                {hasHalfStar && <StarHalf strokeWidth={.5} key="half" className="w-5 h-5  text-rating-default fill-rating-default" />}

                              </motion.div>
                            </TooltipTrigger>
                            <TooltipContent>
                              <p className="text-xs">{testimonial.rating}/5</p>
                            <TooltipArrow />
                            </TooltipContent>
                          </Tooltip>
                        </TooltipProvider>
                      </motion.div>
                    </CardContent>
                  </Card>
                </CarouselItem>
              );
            })}
          </CarouselContent>
          <CarouselPrevious />
          <CarouselNext />
        </Carousel>
      </div>
    </div>
  );
};
