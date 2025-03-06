"use client";

import Banner from "@/components/homepage/banner";
import { Button } from "@/components/ui/button";
import { motion } from "framer-motion";
import { useState, useEffect } from "react";
import {
  AccordionItem,
  AccordionTrigger,
  Accordion,
  AccordionContent,
} from "@/components/ui/accordion";
import { MenTopwear } from "@/dummy/clothes";
import { Spinner } from "@/components/ui/spinner";
import Image from "next/image";
import Marquee from "react-fast-marquee";
import { Card, CardContent } from "@/components/ui/card";
import { Avatar, AvatarImage, AvatarFallback } from "@/components/ui/avatar";
import { Carousel, CarouselContent, CarouselItem, CarouselNext, CarouselPrevious } from "@/components/ui/carousel";
import { ArrowRight, Quote, Star, StarHalf, User } from "lucide-react";
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger, TooltipArrow } from "@/components/ui/tooltip";
import ProductCard from "@/components/product/productCard";

const Homepage = () => {
  return (
    <div>
      <Banner />
      <Products />
      <FeaturesSection />
      <PartnersSection />
      <Brands />
      <TestimonialSection />
      <FAQ />
    </div>
  );
};

export default Homepage;

const Brands = () => {
  const brands = [
    { name: "Nike", logo: "https://cdn-icons-png.flaticon.com/512/732/732229.png", bg: "https://mir-s3-cdn-cf.behance.net/project_modules/max_1200/060d0541798249.57b4b1083209e.jpg" },
    { name: "Adidas", logo: "https://www.vectorlogo.zone/logos/adidas/adidas-ar21.svg", bg: "https://img.goodfon.com/wallpaper/nbig/f/43/adidas-fashion-stella-mccartney-sportivnaia-odezhda-model-ad.webp" },
    { name: "Puma", logo: "https://raw.githubusercontent.com/simple-icons/simple-icons/2aef7ce65fbaef8a013d254d3ee98cbf054a6aad/icons/puma.svg", bg: "https://w0.peakpx.com/wallpaper/541/98/HD-wallpaper-cara-delevingne-puma-x-2017-8k-cara-delevingne-celebrities-girls-puma.jpg" },
    { name: "Reebok", logo: "https://logos-world.net/wp-content/uploads/2020/04/Reebok-Logo-700x394.png", bg: "https://img.goodfon.com/wallpaper/nbig/9/4f/dzhidzhi-khadid-gigi-hadid-vintovaia-lestnitsa-reebok-ulybka.webp" },
    { name: "Under Armour", logo: "https://www.vectorlogo.zone/logos/underarmour/underarmour-ar21.svg", bg: "https://images.unsplash.com/photo-1606813901444-1f7e3c8d3b8b" },
    { name: "New Balance", logo: "https://www.vectorlogo.zone/logos/newbalance/newbalance-ar21.svg", bg: "https://images.unsplash.com/photo-1606813901444-1f7e3c8d3b8b" },
    { name: "Asics", logo: "https://www.vectorlogo.zone/logos/asics/asics-ar21.svg", bg: "https://images.unsplash.com/photo-1606813901444-1f7e3c8d3b8b" },
    { name: "Converse", logo: "https://www.vectorlogo.zone/logos/converse/converse-ar21.svg", bg: "https://images.unsplash.com/photo-1606813901444-1f7e3c8d3b8b" },
  ];

  const [visibleBrands, setVisibleBrands] = useState(4);
  const [isLoading, setIsLoading] = useState(false);

  const handleShowMore = () => {
    setIsLoading(true);
    setTimeout(() => {
      setVisibleBrands((prev) => (prev + 4 > brands.length ? brands.length : prev + 4));
      setIsLoading(false);
    }, 1000);
  };

  return (
    <motion.div className="container mx-auto w-full my-10">
      
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {brands.slice(0, visibleBrands).map((brand, index) => (
          <motion.div
            key={index}
            className="relative overflow-hidden rounded-xs w-full h-[350px] group"
          >
            <Image
              src={brand.bg}
              alt={brand.name}
              width={500}
              height={300}
              className="absolute inset-0 w-full h-[350px] transition-all ease-in-out scale-105 group-hover:scale-100 object-cover group-hover:blur-sm border border-border brightness-75 group-hover:brightness-100"
            />
            <div className="absolute inset-0 bg-black bg-opacity-50 transition-opacity duration-500 ease-in-out opacity-0 hover:opacity-100"></div>
            <div className="relative z-10 flex items-center justify-center h-full">
              <Image src={brand.logo} alt={brand.name} width={100} height={50} className="object-contain" />
            </div>
          </motion.div>
        ))}
      </div>
      <Button
        isLoading={isLoading}
        onClick={handleShowMore}
        className="mt-6 cursor-pointer w-fit ml-auto bg-primary-default text-primary-foreground rounded-xs text-center flex items-center gap-2 transition-all ease-in-out hover:bg-primary-default/80"
      >
        {isLoading ? <Spinner /> : (
          <motion.div className="flex items-center gap-2">
            Show More Brands
            <ArrowRight className="w-5 h-5 text-primary-foreground" />
          </motion.div>
        )}
      </Button>
    </motion.div>
  );
};

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

  const visibleFaqs = showAll ? faqs : faqs.slice(0, 8);

  return (
    <motion.div className="container mx-auto my-4">
      <p className="text-center text-heading font-forum mb-6">
        Frequently Asked Questions
      </p>
      <p className="text-center text-description text-muted-foreground mb-8">
        Find out all the essential details about our clothing brand and how we
        can serve your needs.
      </p>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-10">
        {visibleFaqs.map((faq, index) => (
          <Accordion type="single" collapsible key={index}>
            <AccordionItem
              value={`faq-${index}`}
              className="group hover:bg-primary-foreground/50 transition-all ease-in-out px-4 hover:rounded-xs border-b"
            >
              <AccordionTrigger className="text-default-primary font-subheading group-hover:no-underline flex items-center gap-10">
                {faq.question}
              </AccordionTrigger>
              <AccordionContent className="text-default-primary text-small">
                {faq.answer}
              </AccordionContent>
            </AccordionItem>
          </Accordion>
        ))}
      </div>

      {faqs.length > 10 && (
        <Button
          onClick={handleShowMore}
          className="mt-6 cursor-pointer hover:bg-primary-default/80 w-fit ml-auto bg-primary-default text-primary-foreground rounded-xs text-center flex items-center gap-2"
          disabled={loading}
        >
          {loading && <Spinner />}
          {showAll ? "Show Less" : "Show More"}
        </Button>
      )}
    </motion.div>
  );
};

export const FeaturesSection = () => (
  <div className="container mx-auto w-full">
    <motion.div className="flex flex-col gap-6 w-full">
      <motion.div className="flex gap-2 flex-col">
        <h2 className="text-heading font-forum">
          Discover Our Unique Features
        </h2>
        <p className="text-lg max-w-xl lg:max-w-lg leading-relaxed tracking-tight text-muted-foreground text-left">
          Elevate your style with our exclusive clothing line, designed for comfort and elegance.
        </p>
      </motion.div>
      <motion.div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        <motion.div className="relative col-span-1 md:col-span-2 h-fit">
          <Image src="https://images.unsplash.com/photo-1697498435309-2c7864cfd607?q=80&w=1974&auto=format&fit=crop&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D" alt="Feature 1" width={400} height={400} className="w-full rounded-xs max-h-[700px] h-[700px] object-cover" />
          <div className="flex flex-col absolute bottom-0 left-0 rounded-xs p-6 gap-2 bg-primary-default/20 max-w-2/5 backdrop-blur-sm">
            <h3 className="text-subheading text-primary-foreground">Premium Quality</h3>
            <p className="bg-accent-default/50 text-small">
              Our clothing is made from high-quality materials to ensure durability and comfort.
            </p>
          </div>
        </motion.div>
        <motion.div className="relative col-span-1 h-fit">
          <Image src="https://images.unsplash.com/photo-1690993660127-1a7cdd87ec9e?q=80&w=1974&auto=format&fit=crop&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D" alt="Feature 2" width={400} height={400} className="w-full rounded-xs max-h-[700px] h-[700px] object-cover" />
          <div className="flex flex-col absolute bottom-0 left-0 rounded-xs p-6 gap-2 bg-primary-default/20 max-w-2/5 backdrop-blur-sm">
            <h3 className="text-subheading text-primary-foreground">Trendy Designs</h3>
            <p className="bg-accent-default/50 text-small">
              Stay ahead of the fashion curve with our latest trendy designs.
            </p>
          </div>
        </motion.div>
        <motion.div className="relative col-span-1 h-fit">
          <Image src="https://images.unsplash.com/photo-1558171813-4c088753af8f?q=80&w=1974&auto=format&fit=crop&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D" alt="Feature 3" width={400} height={400} className="w-full rounded-xs max-h-[700px] h-[700px] object-cover" />
          <div className="flex flex-col absolute bottom-0 left-0 rounded-xs p-6 gap-2 bg-primary-default/20 max-w-2/5 backdrop-blur-sm">
            <h3 className="text-subheading text-primary-foreground">Affordable Prices</h3>
            <p className="bg-accent-default/50 text-small">
              Enjoy premium quality clothing at prices that won't break the bank.
            </p>
          </div>
        </motion.div>
        <motion.div className="relative col-span-1 md:col-span-2 h-fit">
          <Image src="https://plus.unsplash.com/premium_photo-1673125286978-a540fa337c7d?q=80&w=1974&auto=format&fit=crop&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D" alt="Feature 4" width={400} height={400} className="w-full rounded-xs max-h-[700px] h-[700px] object-cover" />
          <div className="flex flex-col absolute bottom-0 left-0 rounded-xs p-6 gap-2 bg-primary-default/20 max-w-2/5 backdrop-blur-sm">
            <h3 className="text-subheading text-primary-foreground">Sustainable Fashion</h3>
            <p className="bg-accent-default/50 text-small">
              We are committed to sustainability, using eco-friendly materials and ethical production practices.
            </p>
          </div>
        </motion.div>
      </motion.div>
    </motion.div>
  </div>
);
const TestimonialSection = () => {

  const testimonials = [
    {
      name: "John Doe",
      role: "Verified Buyer",
      image: "https://picsum.photos/id/64/200/300",
      feedback: "This product exceeded my expectations! The quality is top-notch, and the delivery was super fast.",
      rating: 5,
    },
    {
      name: "Sarah Smith",
      role: "Fashion Enthusiast",
      image: "https://picsum.photos/id/64/200/300",
      feedback: "The design is stunning, and the material feels premium. Worth every penny!",
      rating: 5,
    },
    {
      name: "Alex Johnson",
      role: "Tech Reviewer",
      image: "https://picsum.photos/id/64/200/300",
      feedback: "Fantastic product with great features. I use it daily and absolutely love it!",
      rating: 5,
    },
    {
      name: "Emily Davis",
      role: "Frequent Shopper",
      image: "https://picsum.photos/id/64/200/300",
      feedback: "Super comfortable and stylish. I got so many compliments already!",
      rating: 5,
    },
    {
      name: "Michael Brown",
      role: "Gadget Lover",
      image: "https://picsum.photos/id/64/200/300",
      feedback: "Impressive quality and great functionality. A must-have for anyone looking for reliability.",
      rating: 4,
    },
    {
      name: "Jessica Wilson",
      role: "Graphic Designer",
      image: "https://picsum.photos/id/64/200/300",
      feedback: "The packaging was so elegant, and the product itself is even better. Highly recommend!",
      rating: 5,
    },
    {
      name: "David Lee",
      role: "Home Essentials Shopper",
      image: "https://picsum.photos/id/64/200/300",
      feedback: "It’s exactly as described. The quality is great, and I’m very happy with my purchase.",
      rating: 4,
    },
    {
      name: "Sophia Martinez",
      role: "Beauty Enthusiast",
      image: "https://picsum.photos/id/64/200/300",
      feedback: "Absolutely love it! The colors are vibrant, and the product feels luxurious.",
      rating: 5,
    },
    {
      name: "James Anderson",
      role: "Outdoor Enthusiast",
      image: "https://picsum.photos/id/64/200/300",
      feedback: "Perfect for my needs! Durable, stylish, and reasonably priced.",
      rating: 5,
    },
    {
      name: "Olivia Taylor",
      role: "Lifestyle Blogger",
      image: "https://picsum.photos/id/64/200/300",
      feedback: "This product has changed my daily routine for the better. I’m beyond satisfied!",
      rating: 5,
    }
  ];


  return (
    <div className="w-full py-12 ">
      <div className="w-fit mx-auto text-center">
        <h2 className="text-center text-heading font-forum mb-6">What Our Clients Say</h2>
        <p className="text-muted-foreground dark:text-gray-400 mt-2">Real feedback from our happy customers.</p>
      </div>

      <div className="mt-10 container ml-auto mr-auto">
        <Carousel className="border-l border-r border-border rounded-xs">
          <CarouselContent >
            {testimonials.map((testimonial, index) => {
              const fullStars = Math.floor(testimonial.rating);
              const hasHalfStar = testimonial.rating % 1 !== 0;

              return (
                <CarouselItem key={index} className="flex justify-center md:basis-1/2 lg:basis-1/3 ">
                  <Card className="w-full rounded-xs">
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

export const Products = () => {

  const [api, setApi] = useState();
  const [current, setCurrent] = useState(0);
  const [isHovered, setIsHovered] = useState(false);

  useEffect(() => {
    if (!api || isHovered) return;

    const interval = setInterval(() => {
      if (api.selectedScrollSnap() + 1 === api.scrollSnapList().length) {
        setCurrent(0);
        api.scrollTo(0);
      } else {
        api.scrollNext();
        setCurrent((prev) => prev + 1);
      }
    }, 1000);

    return () => clearInterval(interval);
  }, [api, current, isHovered]);

  return (
    <motion.div className="container mx-auto w-fit my-10">
      <motion.div className="flex flex-col gap-10">
        <h2 className="text-heading font-forum">
          Trusted by thousands of businesses worldwide
        </h2>
        <Carousel
          setApi={setApi}
          className="w-full"
          onMouseEnter={() => setIsHovered(true)}
          onMouseLeave={() => setIsHovered(false)}
        >
          <CarouselContent>
            {MenTopwear.map((product) => (
              <CarouselItem className="basis-1/4 lg:basis-1/5" key={product.id}>
                <ProductCard product={product} />
              </CarouselItem>
            ))}
          </CarouselContent>
        </Carousel>
      </motion.div>
    </motion.div>
  );
};

