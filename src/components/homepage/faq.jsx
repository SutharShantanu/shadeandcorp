"use client";

import { useState } from "react";
import {
  AccordionItem,
  AccordionTrigger,
  Accordion,
  AccordionContent,
} from "../ui/accordion";
import { Button } from "../ui/button";
import { Loader2 } from "lucide-react";

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
    <div className="container mx-auto my-4">
      <h1 className="text-center text-title font-forum mb-6">
        Common Questions & Answers
      </h1>
      <p className="text-center text-description text-muted-foreground mb-8">
        Find out all the essential details about our clothing brand and how we
        can serve your needs.
      </p>
      {visibleFaqs.map((faq, index) => (
        <Accordion type="single" collapsible key={index}>
          <AccordionItem
            value={`faq-${index}`}
            className="group hover:bg-primary-foreground/50 transition-all ease-in-out px-4 hover:rounded-md border-b"
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
          className="mt-6 w-fit mx-auto bg-primary-default text-primary-foreground rounded-md text-center flex items-center gap-2"
          disabled={loading}
        >
          {loading ? <Loader2 className="animate-spin" size={20} /> : null}
          {showAll ? "Show Less" : "Show More"}
        </Button>
      )}
    </div>
  );
};

export default FAQ;
